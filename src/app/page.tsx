import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Github, Instagram, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import { ProjectCard } from "~/components/project-card"
import { ToolCard } from "~/components/tool-card"
import { FileJson, Palette, Code, Terminal, Settings, Zap } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"

const projects: { title: string; description: string; tags: string[]; link: string; image: string; status: "WIP" | "Done" }[] = [
  {
    title: "Analisi Temperature",
    description: "Applicazione per analizzare lo storico delle temperature a Roma dal 1940 ad oggi, con visualizzazione grafica e analisi dei giorni più caldi/freddi.",
    tags: ["React", "TypeScript", "OpenMeteo API", "Data Viz"],
    link: "/projects/personali",
    image: "/projects/temperature.png",
    status: "WIP"
  },
  {
    title: "Cookie Explorer",
    description: "Strumento per esplorare, gestire e analizzare i cookie del browser con funzionalità di ricerca e gestione in tempo reale.",
    tags: ["Next.js", "React", "Browser API"],
    link: "/projects/cookie",
    image: "/projects/cookie.png",
    status: "Done"
  },
  {
    title: "Triangolo di Sierpiński",
    description: "Visualizzazione interattiva del frattale di Sierpiński con controlli per velocità, colore e dimensione dei punti.",
    tags: ["Canvas", "React", "Matematica"],
    link: "/projects/triangolo",
    image: "/projects/sierpinski.png",
    status: "Done"
  },
  {
    title: "QR Code Generator",
    description: "Generatore di codici QR in tempo reale con personalizzazione della dimensione e del livello di correzione.",
    tags: ["React", "qrcode.react"],
    link: "/projects/qrcode",
    image: "/projects/qrcode.png",
    status: "Done"
  },
  {
    title: "Test Project",
    description: "Ambiente di test per sperimentare nuove funzionalità e componenti prima dell'implementazione.",
    tags: ["Next.js", "React", "Testing"],
    link: "/projects/test",
    image: "/projects/test.png",
    status: "WIP"
  },
  {
    title: "Paroliere",
    description: "Gioco di parole ispirato a Wordle, con dizionario italiano e statistiche di gioco.",
    tags: ["React", "TypeScript", "Game"],
    link: "/projects/paroliere",
    image: "/projects/paroliere.png",
    status: "Done"
  }
];

const tools = [
  {
    title: "Windows Activator",
    description: "Attiva Windows in modo semplice e veloce con un singolo comando.",
    icon: "Terminal",
    link: "/tools",
    command: "irm https://get.activated.win | iex"
  },
  {
    title: "Windows Tweaks",
    description: "Ottimizza e personalizza Windows con una suite completa di strumenti.",
    icon: "Settings",
    link: "/tools",
    command: "irm https://christitus.com/win | iex"
  },
  
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
     

      {/* Hero Section */}
      <section className="container mx-auto py-24 flex flex-col items-center justify-center text-center space-y-8">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-primary/50 blur opacity-70"></div>
          <div className="relative w-32 h-32 rounded-full bg-background flex items-center justify-center border-4 border-primary">
            <Avatar className="w-full h-full">
              <AvatarImage src="https://avatars.githubusercontent.com/u/125825348" />
              <AvatarFallback>JF</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Jacopo Foschi</h1>
          <p className="text-xl text-muted-foreground">Digital Dabbler | Developer | Creator</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Benvenuto nel mio portfolio digitale, dove condivido i miei progetti, strumenti e piccole applicazioni.
          </p>
        </div>

        <div className="flex gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="https://github.com/phoskee" target="_blank" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon">
            <Link href="#" target="_blank" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon">
            <Link href="#" target="_blank" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon">
            <Link href="mailto:contact@example.com" aria-label="Email">
              <Mail className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto py-12 space-y-8">
        <Tabs defaultValue="projects" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="projects">Progetti</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="apps">App</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="projects" className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-8">I Miei Progetti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  link={project.link}
                  image={project.image}
                  status={project.status}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-8">Strumenti Utili</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <ToolCard
                  key={index}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon as "FileJson" | "Palette" | "Code" | "Terminal" | "Settings" | "Zap"}
                  link={tool.link}
                  command={tool.command}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="apps" className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-8">Mini Applicazioni</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6 hover:shadow-md transition-all">
                <h3 className="text-xl font-semibold mb-2">Instagram Data Explorer</h3>
                <p className="text-muted-foreground mb-4">
                  Esplora e analizza i tuoi dati di Instagram in modo semplice e intuitivo. Visualizza le tue interazioni e richieste di follow.
                </p>
                <Button asChild>
                  <Link href="/ig">Apri App</Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Jacopo Foschi. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  )
}

