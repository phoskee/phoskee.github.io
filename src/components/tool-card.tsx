"use client"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { Code, ExternalLink, FileJson, Palette, Terminal, Settings, Zap, Copy, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface ToolCardProps {
  title: string
  description: string
  icon: "FileJson" | "Palette" | "Code" | "Terminal" | "Settings" | "Zap"
  link: string
  command?: string
}

export function ToolCard({ title, description, icon, link, command }: ToolCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!command) return;
    
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Errore durante la copia:', err);
    }
  };

  const IconComponent = () => {
    switch (icon) {
      case "FileJson":
        return <FileJson className="h-10 w-10 text-primary" />
      case "Palette":
        return <Palette className="h-10 w-10 text-primary" />
      case "Code":
        return <Code className="h-10 w-10 text-primary" />
      case "Terminal":
        return <Terminal className="h-10 w-10 text-primary" />
      case "Settings":
        return <Settings className="h-10 w-10 text-primary" />
      case "Zap":
        return <Zap className="h-10 w-10 text-primary" />
      default:
        return <FileJson className="h-10 w-10 text-primary" />
    }
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <IconComponent />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
        {command && (
          <div className="mt-4 p-3 bg-muted rounded-md font-mono text-sm relative group">
            <div className="absolute right-2 top-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 opacity-50 group-hover:opacity-100"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <code className="block pr-8">{command}</code>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={copyToClipboard}
          disabled={!command}
        >
          <div className="flex items-center gap-2">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Comando Copiato!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copia Comando
              </>
            )}
          </div>
        </Button>
      </CardFooter>
    </Card>
  )
}

