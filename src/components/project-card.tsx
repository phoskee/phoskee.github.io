import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { Github, AlertCircle, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  link: string
  image: string
  status?: "WIP" | "Done"
}

export function ProjectCard({ title, description, tags, link, image, status = "Done" }: ProjectCardProps) {
  const isWIP = status === "WIP";
  
  return (
    <div className="relative group">
      {isWIP && (
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
      <Card className={`overflow-hidden group transition-all hover:shadow-md relative ${
        isWIP ? "border-2 border-yellow-400/50 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-yellow-400/20" : "group-hover:scale-[1.02]"
      }`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1">
            {isWIP ? (
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
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold">{title}</h3>
            <Link href={link} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

