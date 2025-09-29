export const dynamic = "force-static"; // next export richiede dati totalmente statici

import type { MetadataRoute } from "next";

const BASE_URL = "https://phoskee.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
