'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import Link from "next/link"

const features = [
  {
    title: "Richieste di Follow in Sospeso",
    description: "Visualizza e gestisci le richieste di follow inviate su Instagram",
    link: "/ig/pending",
    icon: "📨"
  },
  {
    title: "Following",
    description: "Elenco delle persone che segui su Instagram",
    link: "/ig/following",
    icon: "👥"
  },
  {
    title: "Followers",
    description: "Elenco delle persone che ti seguono su Instagram",
    link: "/ig/followers",
    icon: "🫂"
  },
  {
    title: "Richieste di Follow Ricevute",
    description: "Visualizza le richieste di follow che hai ricevuto",
    link: "/ig/received-requests",
    icon: "📥"
  },
  {
    title: "Profili Bloccati",
    description: "Elenco dei profili che hai bloccato",
    link: "/ig/blocked",
    icon: "🚫"
  },
  {
    title: "Amici Stretti",
    description: "Lista dei tuoi amici stretti su Instagram",
    link: "/ig/close-friends",
    icon: "💚"
  },
  {
    title: "Profili Non Seguiti",
    description: "Elenco dei profili che hai smesso di seguire recentemente",
    link: "/ig/unfollowed",
    icon: "👋"
  },
  {
    title: "Profili con Restrizioni",
    description: "Visualizza i profili a cui hai applicato delle restrizioni",
    link: "/ig/restricted",
    icon: "🔒"
  },
  {
    title: "Suggerimenti Rimossi",
    description: "Lista dei suggerimenti di profili che hai rimosso",
    link: "/ig/removed-suggestions",
    icon: "❌"
  }
]

export default function Page() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Instagram Data Explorer</h1>
        <p className="text-xl text-gray-600">Esplora e analizza i tuoi dati Instagram</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <Link href={feature.link} className="block h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{feature.icon}</span>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Esplora {feature.title} →
                </Button>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
