"use client";

import { useState, type SVGProps } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

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
      toast.success("Operazione non supportata");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      setCopied(false);
    }
  };

  return (
    <a href={link.url} target="_blank" rel="noreferrer" className="block">
      <div className="relative mx-auto flex max-w-xs flex-col border border-black/[0.2] p-3 dark:border-white/[0.2]">
        <Icon className="absolute -top-2 -left-2 h-4 w-4 text-black dark:text-white" />
        <Icon className="absolute -bottom-2 -left-2 h-4 w-4 text-black dark:text-white" />
        <Icon className="absolute -top-2 -right-2 h-4 w-4 text-black dark:text-white" />
        <Icon className="absolute -right-2 -bottom-2 h-4 w-4 text-black dark:text-white" />

        <div className="flex items-start gap-3">
          {link.image ? (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={link.image || "/placeholder.svg"}
                alt={link.title}
                fill
                className="rounded-lg object-contain dark:invert-30"
              />
              <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-100">
                <div className="bg-background/90 absolute top-1 right-1 rounded-full p-0.5">
                  <ExternalLink className="h-2 w-2" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
              <ExternalLink className="text-muted-foreground h-5 w-5" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm leading-tight font-medium text-balance">
              {link.title}
            </h3>

            {link.description && (
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                {link.description}
              </p>
            )}

            <p className="text-muted-foreground mt-1 text-xs">{domain}</p>
          </div>
        </div>

        {codeFeature && (
          <div className="border-border/50 mt-3 border-t pt-2">
            <div className="flex items-center gap-2">
              <code className="bg-muted text-foreground flex-1 truncate rounded-md px-2 py-1 font-mono text-xs">
                {codeFeature.command}
              </code>

              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 shrink-0 bg-transparent p-0"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleCopy();
                }}
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        )}
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
