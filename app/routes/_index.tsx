import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import {
  InstagramLogoIcon,
  GitHubLogoIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Link } from "@remix-run/react";
import { Separator } from "~/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import React from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Home" }];
};

export default function Index() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="flex place-items-center min-h-svh">
      <Card className="w-fit mx-auto p-2">
        <Avatar className="mx-auto my-5">
          <AvatarImage src="https://github.com/phoskee.png" />
          <AvatarFallback>JF</AvatarFallback>
        </Avatar>
        <CardContent>
          <div className="my-2 space-y-1">
            <h2 className=" text-center text-xl font-semibold sm:text-2xl">
              Jacopo Foschi
            </h2>
            <p className="text-center px-5 text-xs sm:text-base dark:text-gray-400">
              Digital Dabbler
            </p>
          </div>
        </CardContent>
        <CardContent>
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-[200px] space-y-2"
          >
            <div className="flex items-center justify-between space-x-4 px-4">
              <h4 className="text-sm font-semibold">Links</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <CaretSortIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <Link to={"/tools"}>
                <Button className="w-full">TOOLS</Button>
              </Link>
            </CollapsibleContent>
            <CollapsibleContent className="space-y-2">
              <Link to={"/projects"}>
                <Button className="w-full">PROJECTS</Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
        <Separator className="my-4" />
        <CardContent className="flex justify-between">
          <Link to="https://instagram.com/foschijacopo">
            <InstagramLogoIcon className=" size-10 m-2" />
          </Link>

          <CardContent>
            <Separator orientation="vertical" className="m-2" />
          </CardContent>

          <Link to="https://github.com/phoskee">
            <GitHubLogoIcon className=" size-10 m-2" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
