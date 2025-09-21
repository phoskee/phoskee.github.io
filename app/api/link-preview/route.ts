// app/api/link-preview/route.ts
import { NextResponse } from "next/server";

const FETCH_TIMEOUT_MS = 10000;
const MAX_HTML_BYTES = 800_000; // ~800KB
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

function abortableFetch(
  resource: string | URL,
  opts: RequestInit & { timeout?: number } = {},
) {
  const controller = new AbortController();
  const id = setTimeout(
    () => controller.abort(),
    opts.timeout ?? FETCH_TIMEOUT_MS,
  );
  return fetch(resource, { ...opts, signal: controller.signal }).finally(() =>
    clearTimeout(id),
  );
}

// Mini parser HTML senza dipendenze: estraiamo meta/og/twitter e title
function extractMeta(html: string) {
  const take = (re: RegExp) => {
    const m = re.exec(html);
    return m?.[1]?.trim();
  };

  // title (prefer head)
  const title =
    take(/<title[^>]*>([\s\S]*?)<\/title>/i) ??
    take(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ??
    take(/<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i);

  const description =
    take(
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
    ) ??
    take(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ??
    take(
      /<meta[^>]+name=["']twitter:description["'][^>]+content=["']([^"']+)["']/i,
    );

  const image =
    take(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
    take(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);

  const siteName =
    take(
      /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
    ) ?? undefined;

  return { title, description, image, siteName };
}

// Guardie minime anti-SSRF (no file:, no IP privati se l’URL è letterale IP)
function isPrivateIp(ip: string) {
  // IPv4 privati/loopback/link-local
  return (
    /^127\./.test(ip) ||
    /^10\./.test(ip) ||
    /^192\.168\./.test(ip) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip) ||
    /^169\.254\./.test(ip)
  );
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (typeof url !== "string") {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
      return NextResponse.json(
        { error: "Protocol not allowed" },
        { status: 400 },
      );
    }

    // Se l’host è un IP letterale, rifiuta privati/loopback
    const literalIp = parsed.hostname.match(
      /^(?:\d{1,3}\.){3}\d{1,3}$/, // IPv4 semplice; (IPv6 escluso per brevità)
    );
    if (literalIp && isPrivateIp(parsed.hostname)) {
      return NextResponse.json(
        { error: "Private IP not allowed" },
        { status: 403 },
      );
    }

    // Fetch con redirect e UA “civile”
    const res = await abortableFetch(parsed.toString(), {
      timeout: FETCH_TIMEOUT_MS,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; LinkPreviewBot/1.0; +https://example.com/bot)",
        Accept: "text/html,application/xhtml+xml",
      },
      // IMPORTANT: non usare cache "force-cache" qui; controlliamo noi i headers
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream ${res.status}` },
        { status: 502 },
      );
    }

    // Limita la dimensione letta
    const reader = res.body?.getReader();
    if (!reader) {
      return NextResponse.json({ error: "No body" }, { status: 502 });
    }
    const decoder = new TextDecoder("utf-8");
    let received = 0;
    let html = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > MAX_HTML_BYTES) break;
      html += decoder.decode(value, { stream: true });
    }
    html += decoder.decode();

    const meta = extractMeta(html);

    // Normalizza absolute URL per l’immagine (se relativa)
    let imageAbs = meta.image;
    if (imageAbs && !/^https?:\/\//i.test(imageAbs)) {
      try {
        imageAbs = new URL(imageAbs, res.url).toString();
      } catch {}
    }

    const out = {
      url: res.url,
      domain: new URL(res.url).hostname,
      title: meta.title ?? new URL(res.url).hostname,
      description: meta.description ?? undefined,
      image: imageAbs ?? undefined,
      siteName: meta.siteName ?? undefined,
    };

    const response = NextResponse.json(out, {
      status: 200,
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
    return response;
  } catch (e: any) {
    const msg = e?.name === "AbortError" ? "Timeout" : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
