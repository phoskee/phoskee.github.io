"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProjectStatus = "wip" | "done";

type Project = {
  name: string;
  title: string;
  url: string;
  description: string;
  status: ProjectStatus;
};

const projectStatus: Record<
  ProjectStatus,
  { label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  wip: {
    label: "In sviluppo",
    icon: Clock3,
  },
  done: {
    label: "Completato",
    icon: CheckCircle2,
  },
};

const projects: Project[] = [
  {
    name: "Me lo posso permettere?",
    title: "Me lo posso permettere?",
    url: "/projects/melopossopermettere",
    description: "Calcola mutuo e spese annuali.",
    status: "wip",
  },
  {
    name: "phoskee-meteo",
    title: "Phoskee Meteo",
    url: "/projects/personali",
    description: "Panoramica meteo personalizzata e in continuo aggiornamento.",
    status: "wip",
  },
  {
    name: "project-arianna",
    title: "Project Arianna",
    url: "/projects/paroliere",
    description: "Un paroliere digitale per sfidare amici e colleghi.",
    status: "wip",
  },
  {
    name: "project-puddu",
    title: "Project Puddu",
    url: "/projects/test",
    description: "Landing page sperimentale realizzata per fullbread.dev.",
    status: "done",
  },
  {
    name: "project-qrcode",
    title: "Project QR Code",
    url: "/projects/qrcode",
    description: "Generatore di QR code con anteprima istantanea.",
    status: "wip",
  },
  {
    name: "project-cookie",
    title: "Project Cookie",
    url: "/projects/cookie",
    description:
      "Strumento rapido per ispezionare e copiare i cookie del browser.",
    status: "done",
  },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Project Hub</h1>
        <p className="text-muted-foreground text-sm">
          Una raccolta compatta dei prototipi e degli strumenti che sto
          sperimentando. Ogni card porta alla demo interattiva con dettagli
          sullo stato del progetto.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => {
          const status = projectStatus[project.status];
          const StatusIcon = status.icon;

          return (
            <Link
              href={project.url}
              key={project.url}
              className="group focus-visible:ring-primary/60 block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Card className="border-border/60 group-hover:border-border h-full transition-transform duration-200 group-hover:-translate-y-1">
                <CardHeader className="flex flex-col gap-3 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    <StatusIcon className="text-muted-foreground mt-1 size-5" />
                  </div>
                </CardHeader>
                <CardFooter className="border-border/80 bg-muted/30 flex items-center justify-between border-t px-4 py-3">
                  <Badge
                    variant={project.status === "wip" ? "secondary" : "default"}
                  >
                    {status.label}
                  </Badge>
                  <span className="text-muted-foreground text-xs font-medium">
                    Apri progetto
                  </span>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
