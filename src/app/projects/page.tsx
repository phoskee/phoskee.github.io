"use client";

import { ArrowLeftIcon, CaretSortIcon, CopyIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import React, { Children, useState } from "react";
import { Label } from "~/components/ui/label";
import Link from "next/link";
import { ChildProcess } from "child_process";

type CopiedState = Record<number, boolean>;


export default function Index() {
  const [isOpen, setIsOpen] = React.useState<number | null>(null);
  const [copied, setCopied] = useState<CopiedState>({});

  const handleCollapsibleOpen = (collapsibleIndex: number) => {
    setIsOpen((prevIndex) =>
      prevIndex === collapsibleIndex ? null : collapsibleIndex
    );
  };

  const copyToClipboard = async (text: string, collapsibleIndex: number) => {
    if ("clipboard" in navigator) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied((prev) => ({ ...prev, [collapsibleIndex]: true }));
        setTimeout(
          () => setCopied((prev) => ({ ...prev, [collapsibleIndex]: false })),
          3000
        );
      } catch (error) {
        console.error(
          "Errore durante la copia del testo negli appunti:",
          error
        );
      }
    }
  };

  return (
    <div className="flex place-items-center min-h-svh">
      <Link href="/" className="place-self-start absolute">
        <Button className="p-2 m-2" size="icon">
          <ArrowLeftIcon className=" size-12 " />
        </Button>
      </Link>

      <div className="mx-auto min-w-fit border rounded-lg p-5s">
        <Collapsible
          open={isOpen === 1}
          onOpenChange={() => handleCollapsibleOpen(1)}
          className="w-[350px] space-y-2"
        >
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold">project-martina</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <CaretSortIcon className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="flex rounded-md border px-4 py-2 font-mono text-sm shadow-sm ">
              <Link className="p-2" href={"/projects/casellario-alfanumerico"}><Button>1x3x3</Button></Link>
              <Link className="p-2" href={"/projects/casellario_10"}><Button>10x3x3</Button></Link>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible
          open={isOpen === 2}
          onOpenChange={() => handleCollapsibleOpen(2)}
          className="w-[350px] space-y-2"
        >
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold">project-arianna</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <CaretSortIcon className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="flex items-center justify-between rounded-md border px-4 py-2 font-mono text-sm shadow-sm ">
            <Link className="p-2" href={"/projects/paroliere"}><Button>test-paroliere-wip</Button></Link>
            <Label>work in progress</Label>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
