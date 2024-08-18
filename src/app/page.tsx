"use client";
import { Button } from "~/components/ui/button";
import { InstagramLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import React from "react";
import Link from "next/link";

export default function Index() {
  return (
    <div>
      <Card className="p-2">
        <Avatar className="mx-auto my-5 size-36">
          <AvatarImage src="https://github.com/phoskee.png" />
          <AvatarFallback>JF</AvatarFallback>
        </Avatar>

        <CardContent>
          <div className="my-2 space-y-1">
            <h2 className="text-center text-xl font-semibold sm:text-2xl">
              Jacopo Foschi
            </h2>
            <p className="px-5 text-center text-xs sm:text-base">
              Digital Dabbler
            </p>
          </div>
        </CardContent>
        <CardContent className="flex flex-col gap-2">
          <Link href={"/tools"}>
            <Button className="w-full">TOOLS</Button>
          </Link>

          <Link href={"/projects"}>
            <Button className="w-full">PROJECTS</Button>
          </Link>
        </CardContent>
        <Separator className="my-4" />
        <CardContent className="flex justify-between">
          <Link href="https://instagram.com/foschijacopo">
            <InstagramLogoIcon className="m-2 size-10" />
          </Link>

          <CardContent>
            <Separator orientation="vertical" className="m-2" />
          </CardContent>

          <Link href="https://github.com/phoskee">
            <GitHubLogoIcon className="m-2 size-10" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
