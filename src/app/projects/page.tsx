"use client";
import React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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
    {
      name: "project-qrcode",
      url: "/projects/qrcode",
      description: "simple qrcode generator",
      label: "WIP",
    },
    {
      name: "project-cookie",
      url: "/projects/cookie",
      description: "cookie viewer",
      label: "Done",
    },
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
        {progetti.map((progetto) => (
          <Link href={progetto.url} key={progetto.url} className="group">
            <div className="relative">
              {progetto.label === "WIP" && (
                <>
                  {/* Nastro nell'angolo superiore destro */}
                  <div className="absolute -right-3 -top-3 w-28 h-28 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[200%] h-[200%] transform -translate-x-1/2 -translate-y-1/2">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-b from-yellow-400 to-yellow-500 rotate-45 transform origin-bottom-left">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)]" />
                      </div>
                    </div>
                  </div>
                  {/* Effetto glow intorno alla card */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-black opacity-20 group-hover:opacity-30 blur transition-opacity rounded-lg" />
                </>
              )}
              <Card className={`relative transition-all duration-300 ${
                progetto.label === "WIP" 
                  ? "border-2 border-yellow-400/50 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-yellow-400/20" 
                  : "group-hover:scale-[1.02]"
              }`}>
                <div className="absolute top-2 right-2">
                  {progetto.label === "WIP" ? (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-500">In Sviluppo</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-medium text-green-500">Completato</span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{progetto.name}</CardTitle>
                  <CardDescription>{progetto.description}</CardDescription>
                </CardHeader>
                <CardFooter className="place-content-end p-2">
                  <Badge variant={progetto.label === "WIP" ? "secondary" : "default"}>
                    {progetto.label}
                  </Badge>
                </CardFooter>
              </Card>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
