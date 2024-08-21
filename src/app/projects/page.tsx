"use client";
import React from "react";
import Link from "next/link";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export default function Index() {
  const progetti = [
    {
      name: "phoskee-meteo",
      url: "/projects/personali",
      description: "discover",
      label: "WIP",
    },
    {
      name: "project-arianna",
      url: "/projects/paroliere",
      description: "paroliere",
      label: "WIP",
    },  
    {
      name: "project-puddu",
      url: "/projects/test",
      description: "Test Landigpage fullbread.dev",
      label: "Done",
    },
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {progetti.map((progetto) => (
          <Link href={progetto.url} key={progetto.url}>
            <Card>
              <CardHeader >
                <CardTitle>{progetto.name}</CardTitle>
                <CardDescription>{progetto.description}</CardDescription>
              </CardHeader>
              <CardFooter className="place-content-end p-2">
                <Badge variant={"neutral"}>{progetto.label}</Badge>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
