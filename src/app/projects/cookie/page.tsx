"use client";

import { useState, useEffect } from "react";
import { CardContent } from "~/components/ui-clean/card";
import { Button } from "~/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";

interface Cookie {
  name: string;
  value: string;
  expires?: string;
}

export default function CookieViewer() {
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllCookies = () => {
    // NOTA: Questo metodo può accedere solo ai cookie non-HttpOnly
    const cookieList = document.cookie.split(";");
    const parsedCookies = cookieList
      .map((cookie) => {
        const [name = "", value = ""] = cookie.trim().split("=");
        return { name, value };
      })
      .filter((cookie) => cookie.name !== "");
    setCookies(parsedCookies);
  };

  const createTestCookie = () => {
    const now = new Date();
    document.cookie = `testCookie_${now.getTime()}=valore_${Math.random().toString(36).substring(7)}`;
    window.location.reload();
  };

  const deleteCookie = (cookieName: string) => {
    // Prova diversi percorsi comuni per assicurarsi che il cookie venga eliminato
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/projects/cookie;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    getAllCookies(); // Aggiorna la lista dei cookie
  };

  useEffect(() => {
    getAllCookies();
  }, []);

  const filteredCookies = cookies.filter(
    (cookie) =>
      cookie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cookie.value.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className="mx-2">
      <CardHeader className="mx-auto max-w-4xl">
        <CardTitle>Cookie Explorer 🍪</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Cerca cookie..."
          className="flex-1 p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="overflow-hidden rounded-xl shadow-lg p-2 border-2 border-primary">
          <div>
            {filteredCookies.length === 0 ? (
              <div className="text-center">Nessun cookie trovato</div>
            ) : (
              <ScrollArea className="h-[50svh]">
                {filteredCookies.map((cookie, index) => (
                  <div key={index} className="p-2 transition-colors">
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                      <div>
                        <h3 className="text-lg font-medium text-wrap">
                          {cookie.name}
                        </h3>
                        <p className="break-all text-sm">{cookie.value}</p>
                      </div>
                      <Button
                        onClick={() => deleteCookie(cookie.name)}
                        className="text-sm"
                        variant="reverse"
                      >
                        Elimina
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            )}
          </div>
        </div>
        {/* Stats */}
        <div className="mt-4 text-sm text-muted ">
          Totale cookie: {filteredCookies.length} - Questo metodo può accedere
          solo ai cookie non-HttpOnly
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={createTestCookie}>Crea un cookie di prova</Button>
      </CardFooter>
    </Card>
  );
}
