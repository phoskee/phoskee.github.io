"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  {
    label: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    variant: "secondary" | "default";
    color: string;
  }
> = {
  wip: {
    label: "In sviluppo",
    icon: Clock3,
    variant: "secondary",
    color: "text-warning",
  },
  done: {
    label: "Completato",
    icon: CheckCircle2,
    variant: "default",
    color: "text-success",
  },
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = projectStatus[project.status];
  const StatusIcon = status.icon;

  return (
    <Link
      href={project.url}
      className="group focus-visible:ring-primary/60 focus-visible:ring-offset-background block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <div className="bg-card border-border group-hover:border-border/80 group-hover:bg-card/80 relative h-full rounded-xl border p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-black/20">
        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center gap-1.5 ${status.color}`}>
            <StatusIcon className="size-4" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-foreground group-hover:text-primary text-xl font-semibold text-balance transition-colors">
              {project.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
              {project.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Badge variant={status.variant} className="text-xs font-medium">
              {status.label}
            </Badge>

            <div className="text-muted-foreground group-hover:text-foreground flex items-center gap-1 transition-colors">
              <span className="text-xs font-medium">Esplora</span>
              <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* Subtle gradient overlay on hover */}
        <div className="from-primary/5 pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </Link>
  );
}
