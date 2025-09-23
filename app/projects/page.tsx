"use client";

import { ProjectCard } from "./_components/projects-card";

type ProjectStatus = "wip" | "done";

type Project = {
  name: string;
  title: string;
  url: string;
  description: string;
  status: ProjectStatus;
};

const projects: Project[] = [
  {
    name: "Me lo posso permettere?",
    title: "Me lo posso permettere?",
    url: "/projects/melopossopermettere",
    description:
      "Calcola mutuo e spese annuali con precisione. Strumento completo per la pianificazione finanziaria personale.",
    status: "wip",
  },
  {
    name: "phoskee-meteo",
    title: "Phoskee Meteo",
    url: "/projects/personali",
    description:
      "Panoramica meteo personalizzata e in continuo aggiornamento. Dashboard elegante per le previsioni locali.",
    status: "wip",
  },
  {
    name: "project-arianna",
    title: "Project Arianna",
    url: "/projects/paroliere",
    description:
      "Un paroliere digitale per sfidare amici e colleghi. Gioco di parole interattivo e coinvolgente.",
    status: "wip",
  },
  {
    name: "project-puddu",
    title: "Project Puddu",
    url: "/projects/test",
    description:
      "Landing page sperimentale realizzata per fullbread.dev. Showcase di design moderno e funzionale.",
    status: "done",
  },
  {
    name: "project-qrcode",
    title: "Project QR Code",
    url: "/projects/qrcode",
    description:
      "Generatore di QR code con anteprima istantanea. Strumento veloce e intuitivo per la creazione di codici.",
    status: "wip",
  },
  {
    name: "project-cookie",
    title: "Project Cookie",
    url: "/projects/cookie",
    description:
      "Strumento rapido per ispezionare e copiare i cookie del browser. Utility essenziale per sviluppatori.",
    status: "done",
  },
];

export default function ProjectsPage() {
  const completedProjects = projects.filter((p) => p.status === "done");
  const wipProjects = projects.filter((p) => p.status === "wip");

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Header */}
        <header className="mb-16 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
              Project Hub
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed text-pretty">
              Una raccolta curata dei prototipi e degli strumenti che sto
              sperimentando. Ogni progetto rappresenta un'esplorazione di nuove
              tecnologie e approcci creativi.
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <div className="bg-success size-2 rounded-full" />
              <span className="text-muted-foreground text-sm">
                {completedProjects.length} completati
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-warning size-2 rounded-full" />
              <span className="text-muted-foreground text-sm">
                {wipProjects.length} in sviluppo
              </span>
            </div>
          </div>
        </header>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>

        {/* Footer */}
        <footer className="border-border mt-20 border-t pt-8">
          <p className="text-muted-foreground text-center text-sm">
            Tutti i progetti sono in continua evoluzione.
            <span className="text-foreground">
              {" "}
              Torna presto per nuovi aggiornamenti.
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}
