"use client";
import { ArrowLeftIcon, CaretSortIcon, CopyIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";

type CopiedState = Record<number, boolean>;

export default function Index() {
  const [isOpen, setIsOpen] = React.useState<number | null>(null);
  const [copied, setCopied] = useState<CopiedState>({});

  const handleCollapsibleOpen = (collapsibleIndex: number) => {
    setIsOpen((prevIndex) =>
      prevIndex === collapsibleIndex ? null : collapsibleIndex,
    );
  };

  const copyToClipboard = async (text: string, collapsibleIndex: number) => {
    if ("clipboard" in navigator) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied((prev) => ({ ...prev, [collapsibleIndex]: true }));
        setTimeout(
          () => setCopied((prev) => ({ ...prev, [collapsibleIndex]: false })),
          3000,
        );
      } catch (error) {
        console.error(
          "Errore durante la copia del testo negli appunti:",
          error,
        );
      }
    }
  };

  return (
    <div className="flex place-items-center">

      <Card className="mx-auto pt-5">
        <CardContent>
          <Collapsible
            open={isOpen === 1}
            onOpenChange={() => handleCollapsibleOpen(1)}
            className="space-y-2"
          >
            <div className="flex items-center justify-between space-x-4 px-4">
              <h4 className="text-sm font-semibold">Windows Activator</h4>
              <CollapsibleTrigger asChild>
                <Button variant="neutral" size="sm">
                  <CaretSortIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <div className="flex items-center justify-between rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
                <h1>irm https://get.activated.win | iex</h1>
                <Button
                  variant={"link"}
                  size={"icon"}
                  onClick={() =>
                    copyToClipboard("irm https://get.activated.win | iex", 1)
                  }
                >
                  {copied[1] ? <span>👍</span> : <CopyIcon />}
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
        <CardContent>
          <Collapsible
            open={isOpen === 2}
            onOpenChange={() => handleCollapsibleOpen(2)}
            className="space-y-2"
          >
            <div className="flex items-center justify-between space-x-4 px-4">
              <h4 className="text-sm font-semibold">Windows Tweaks</h4>
              <CollapsibleTrigger asChild>
                <Button variant="neutral" size="sm">
                  <CaretSortIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <div className="flex items-center justify-between rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
                <h1>irm https://christitus.com/win | iex</h1>
                <Button
                  variant="link"
                  size={"icon"}
                  onClick={() =>
                    copyToClipboard("irm https://christitus.com/win | iex", 2)
                  }
                >
                  {copied[2] ? <span>👍</span> : <CopyIcon />}
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
