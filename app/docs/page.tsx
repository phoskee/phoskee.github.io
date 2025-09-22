"use client";

import * as React from "react";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import {
  Check,
  Copy,
  ExternalLink,
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
const defaultExpanded = treeData.items[treeData.rootItemId]?.children ?? [];
const initialExpandedItems = [treeData.rootItemId, ...defaultExpanded];

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
      expandedItems: [...initialExpandedItems],
      focusedItem: defaultExpanded[0] ?? rootItemId,
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

  const focusedItem = tree.getFocusedItem();
  const focusedItemId = focusedItem?.getId() ?? defaultExpanded[0] ?? rootItemId;
  const focusedItemData = items[focusedItemId];
  const isFocusedFolder = Boolean(focusedItemData?.children?.length);
  const focusedCommand =
    focusedItemData?.feature?.type === "code"
      ? focusedItemData.feature.command
      : null;

  const openFocusedLink = React.useCallback(() => {
    if (!focusedItemData?.url) return;
    if (typeof window === "undefined") return;
    window.open(focusedItemData.url, "_blank", "noopener,noreferrer");
  }, [focusedItemData?.url]);

  const isCommandCopied = copiedItem === focusedItemId;

  return (
    <div className="flex h-[85svh] w-[95svw] flex-col gap-3 p-2">
      <ScrollArea className="grow rounded-lg border">
        <div className="flex min-h-full flex-col gap-4 p-4 md:flex-row md:items-start">
          <Tree
            indent={indent}
            tree={tree}
            className="relative min-w-64 gap-0.5 p-2 before:absolute before:-ms-1 before:inset-0 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))] before:content-['']"
          >
            {tree.getItems().map((item) => {
              const data = item.getItemData();
              const icon = item.isFolder() ? (
                item.isExpanded() ? (
                  <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
                ) : (
                  <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
                )
              ) : (
                <FileIcon className="text-muted-foreground pointer-events-none size-4" />
              );

              return (
                <TreeItem
                  key={item.getId()}
                  item={item}
                  className="text-left"
                  onDoubleClick={() => {
                    const leafUrl = data?.children?.length ? null : data?.url;
                    if (!leafUrl || typeof window === "undefined") return;
                    window.open(leafUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  <TreeItemLabel className="before:bg-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 before:content-['']">
                    <span className="flex items-center gap-2">
                      {icon}
                      <span className="flex-1 truncate">
                        {item.getItemName() || data?.siteName}
                      </span>
                    </span>
                  </TreeItemLabel>
                </TreeItem>
              );
            })}
          </Tree>

          <div className="flex flex-1 flex-col gap-4 rounded-lg border border-dashed p-4">
            <div className="space-y-1">
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Selezione attuale
              </div>
              <h2 className="text-lg font-semibold leading-tight">
                {focusedItemData?.label ?? "Sconosciuto"}
              </h2>
              {focusedItemData?.siteName && (
                <p className="text-muted-foreground text-sm">
                  {focusedItemData.siteName}
                </p>
              )}
            </div>

            {focusedItemData?.description && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {focusedItemData.description}
              </p>
            )}

            {isFocusedFolder && focusedItemData?.children ? (
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase text-muted-foreground">
                  Contenuto
                </div>
                <ul className="list-disc space-y-1 ps-5 text-sm text-muted-foreground">
                  {focusedItemData.children.map((childId) => (
                    <li key={childId}>{items[childId]?.label ?? childId}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {!isFocusedFolder && focusedItemData?.url ? (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={openFocusedLink}
                >
                  <ExternalLink className="size-4" />
                  Apri risorsa
                </Button>
                <span className="text-muted-foreground text-xs break-all">
                  {focusedItemData.url}
                </span>
              </div>
            ) : null}

            {focusedCommand ? (
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase text-muted-foreground">
                  Comando
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <code className="bg-muted text-foreground/80 flex-1 min-w-[12rem] truncate rounded-md px-3 py-2 text-xs font-mono">
                    {focusedCommand}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => handleCopy(focusedItemId, focusedCommand)}
                  >
                    {isCommandCopied ? (
                      <>
                        <Check className="size-4" /> Copiato
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" /> Copia
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </ScrollArea>
      <p className="text-muted-foreground text-xs">
        Suggerimento: usa frecce, invio e barra spaziatrice per navigare nel tree. Fai doppio
        clic su una voce per aprire il link associato.
      </p>
    </div>
  );
}
