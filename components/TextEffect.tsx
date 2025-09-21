"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TextEffectProps = {
  children: React.ReactNode;
  className?: string;
  per?: "char" | "word";
  preset?: "fade" | "none";
};

function toDisplayStrings(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  return React.Children.toArray(children).join(" ");
}

export function TextEffect({
  children,
  className,
  per = "char",
  preset = "fade",
}: TextEffectProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const timeout = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(timeout);
  }, []);

  const content = toDisplayStrings(children);

  if (preset === "none") {
    return <p className={cn(className)}>{content}</p>;
  }

  const units = per === "word" ? content.split(/(\s+)/) : Array.from(content);

  return (
    <p className={cn("inline-flex flex-wrap", className)}>
      {units.map((unit, index) => (
        <span
          key={`${unit}-${index}`}
          style={{
            opacity: mounted ? 1 : 0,
            transition: `opacity 0.6s ease ${index * 50}ms`,
          }}
        >
          {unit === " " ? "\u00A0" : unit}
        </span>
      ))}
    </p>
  );
}
