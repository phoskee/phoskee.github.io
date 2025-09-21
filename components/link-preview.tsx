"use client";

import { useState, type SVGProps } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";

type CodeFeature = {
  type: "code";
  command: string;
};

export type LinkPreviewData = {
  url: string;
  title: string;
  description?: string;
  image?: string;
  siteName?: string;
  feature?: CodeFeature;
};

type LinkPreviewProps = {
  link: LinkPreviewData;
};

export function LinkPreview({ link }: LinkPreviewProps) {
  const [copied, setCopied] = useState(false);

  const domain = (() => {
    try {
      return link.siteName ?? new URL(link.url).hostname;
    } catch (_err) {
      return link.siteName ?? link.url;
    }
  })();

  const codeFeature = link.feature?.type === "code" ? link.feature : null;

  const handleCopy = async () => {
    if (!codeFeature) return;
    try {
      await navigator.clipboard.writeText(codeFeature.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      setCopied(false);
    }
  };

  return (
    <a href={link.url} target="_blank" rel="noreferrer" className="block">
      <div className="relative mx-auto flex h-full max-w-sm flex-col items-start border border-black/[0.2] p-4 dark:border-white/[0.2]">
        <Icon className="absolute -top-3 -left-3 h-6 w-6 text-black dark:text-white" />
        <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-white" />
        <Icon className="absolute -top-3 -right-3 h-6 w-6 text-black dark:text-white" />
        <Icon className="absolute -right-3 -bottom-3 h-6 w-6 text-black dark:text-white" />
        {link.image && (
          <div className="bg-muted relative mb-0 h-[10rem] w-full overflow-hidden rounded-lg">
            <Image
              src={link.image || "/window.svg"}
              alt={link.title}
              fill
              className="rounded-lg object-cover"
            />

            <div className="absolute top-2 right-2 opacity-0 transition-opacity hover:opacity-100">
              <div className="bg-background/90 rounded-full p-1.5">
                <ExternalLink className="h-3 w-3" />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col">
          <div className="space-y-2 pb-3">
            <span className="text-muted-foreground text-xs">{domain}</span>

            <h3 className="text-base leading-tight font-medium text-balance">
              {link.title}
            </h3>
          </div>

          {link.description && (
            <div className="flex-1 pt-0 pb-4">
              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                {link.description}
              </p>
            </div>
          )}

          {codeFeature && (
            <div className="pt-0 pb-4">
              <div className="bg-muted rounded-md p-3">
                <div className="flex items-center justify-between gap-3">
                  <code className="bg-background text-foreground flex-1 truncate rounded px-2 py-1.5 font-mono text-xs">
                    {codeFeature.command}
                  </code>

                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 bg-transparent"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleCopy();
                    }}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        Copiato
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3 w-3" />
                        Copia
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

export const Icon = ({ className, ...rest }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
