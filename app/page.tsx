"use client";

import * as React from "react";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import {
  Check,
  Copy,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import resourcesTree from "@/data/link-groups.json";

type TreeFeature = {
  type: string;
  command: string;
};

type ResourceNode = {
  label: string;
  children?: string[];
  url?: string;
  description?: string;
  siteName?: string;
  image?: string;
  feature?: TreeFeature;
};

type ResourceTree = {
  rootItemId: string;
  items: Record<string, ResourceNode>;
};

const treeData = resourcesTree as ResourceTree;
const indent = 20;
const initialExpandedItems = [
  treeData.rootItemId,
  ...(treeData.items[treeData.rootItemId]?.children ?? []),
];

export default function Page() {
  const { rootItemId, items } = treeData;
  const [copiedItem, setCopiedItem] = React.useState<string | null>(null);
  const copyResetTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleCopy = React.useCallback(
    async (itemId: string, command: string) => {
      if (!command) return;

      if (typeof navigator === "undefined" || !navigator.clipboard) {
        return;
      }

      try {
        await navigator.clipboard.writeText(command);
        setCopiedItem(itemId);
        if (copyResetTimeout.current) {
          clearTimeout(copyResetTimeout.current);
        }
        copyResetTimeout.current = setTimeout(() => setCopiedItem(null), 2000);
      } catch (_error) {
        setCopiedItem(null);
      }
    },
    [],
  );

  React.useEffect(() => {
    return () => {
      if (copyResetTimeout.current) {
        clearTimeout(copyResetTimeout.current);
      }
    };
  }, []);

  const tree = useTree<ResourceNode>({
    initialState: {
      expandedItems: [],
      focusedItem: rootItemId,
    },
    indent,
    rootItemId,
    getItemName: (item) => item.getItemData().label,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => {
        const itemData = items[itemId];

        if (!itemData) {
          throw new Error(`Missing tree item for id \"${itemId}\"`);
        }

        return itemData;
      },
      getChildren: (itemId) => items[itemId]?.children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });

  return (
    <div className="flex w-full justify-center">
      <ScrollArea className="flex h-[85svh] w-md flex-col gap-3 rounded-3xl border p-2">
        <Tree indent={indent} tree={tree}>
          {tree.getItems().map((item) => {
            const data = item.getItemData();
            const isFolder = item.isFolder();
            const hasLink = Boolean(!isFolder && data?.url);
            const command =
              data?.feature?.type === "code" ? data.feature.command : null;
            const icon = isFolder ? (
              item.isExpanded() ? (
                <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
              ) : (
                <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
              )
            ) : (
              <FileIcon className="text-muted-foreground pointer-events-none size-4" />
            );
            const isCopied = copiedItem === item.getId();

            return (
              <TreeItem
                key={item.getId()}
                item={item}
                asChild={hasLink}
                className="text-left"
              >
                {hasLink && data?.url ? (
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-1"
                    title={data.description}
                  >
                    <TreeItemLabel className="before:bg-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 before:content-['']">
                      <span className="flex items-center gap-2">
                        {icon}
                        <span className="flex-1 truncate">
                          {item.getItemName() || data?.siteName}
                        </span>
                      </span>
                    </TreeItemLabel>
                    {data.description ? (
                      <span className="text-muted-foreground ps-7 text-xs leading-snug">
                        {data.description}
                      </span>
                    ) : null}
                    {command ? (
                      <div className="flex items-center gap-2 ps-7">
                        <code className="bg-muted text-foreground/80 flex-1 truncate rounded-md px-2 py-1 font-mono text-[11px]">
                          {command}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-6 p-0"
                          aria-label="Copia comando"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleCopy(item.getId(), command);
                          }}
                        >
                          {isCopied ? (
                            <Check className="size-3" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </Button>
                      </div>
                    ) : null}
                  </a>
                ) : (
                  <TreeItemLabel className="before:bg-background relative font-medium before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 before:content-['']">
                    <span className="flex items-center gap-2">
                      {icon}
                      <span>{item.getItemName()}</span>
                    </span>
                  </TreeItemLabel>
                )}
              </TreeItem>
            );
          })}
        </Tree>
        <p className="text-muted-foreground text-xs">
          Suggerimento: usa frecce, invio e barra spaziatrice per navigare nel
          tree. I link vengono aperti in una nuova scheda.
        </p>
      </ScrollArea>
    </div>
  );
}
