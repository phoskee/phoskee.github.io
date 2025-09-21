import { LinkPreview, LinkPreviewData } from "@/components/link-preview";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import linkGroups from "@/data/link-groups.json";

type LinkGroup = {
  id: string;
  label: string;
  links: LinkPreviewData[];
};

const groups = linkGroups as LinkGroup[];

export default function Page() {
  const defaultTab = groups[0]?.id;

  return (
    <Tabs defaultValue={defaultTab} className="w-fit">
      <TabsList className="w-full">
        {groups.map(({ id, label }) => (
          <TabsTrigger key={id} value={id}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {groups.map(({ id, links }) => (
        <TabsContent key={id} value={id}>
          <ScrollArea className="h-[85svh] w-[95svw] rounded-md p-2">
            <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {links.map((link) => (
                <LinkPreview key={link.url} link={link} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}
