"use client";
import React from "react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";

export default function Index() {
  const progetti = [
    {
      name: "project-martina",
      url: "/projects/casellario-alfanumerico",
      description: "casellario alfanumerico",
      label: "WIP",
    },
    {
      name: "project-arianna",
      url: "/projects/paroliere",
      description: "paroliere",
      label: "WIP",
    },
    {
      name: "project-martina",
      url: "/projects/casellario_10",
      description: "Casellario alfanumerico 10x10",
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
    <div className="flex min-h-dvh items-center justify-center p-4">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {progetti.map((progetto) => (
          <Link key={progetto.name} href={progetto.url} className="group">
            <div className="flex flex-col overflow-hidden rounded-lg border">
              <div className="flex flex-col p-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-semibold">{progetto.name}</h4>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {progetto.description}
                </p>
                <div className="mt-4 flex justify-end">
                  <Badge className="px-2 py-1 text-xs">{progetto.label}</Badge>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
