"use client";

import { Progress } from "@radix-ui/react-progress";
import { Input } from "~/components/ui-clean/input";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui-clean/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui-clean/card";
import { toast } from "~/components/ui-clean/use-toast";


export default function GuessingGame() {
  const [secretNumber, setSecretNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [hint, setHint] = useState<string>("");
  const [gameWon, setGameWon] = useState<boolean>(false);


  const maxAttempts = 10;

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setSecretNumber(Math.floor(Math.random() * 100) + 1);
    setAttempts(0);
    setGuess("");
    setHint("");
    setGameWon(false);
  };

  const handleGuess = () => {
    const guessNumber = parseInt(guess);

    if (isNaN(guessNumber)) {
      toast({
        variant: "destructive",
        title: "Errore!",
        description: "Inserisci un numero valido!",
      });
      return;
    }

    setAttempts((prev) => prev + 1);

    if (guessNumber === secretNumber) {
      setGameWon(true);
      toast({
        title: "Congratulazioni! 🎉",
        description: `Hai indovinato in ${attempts + 1} tentativi!`,
      });
    } else if (guessNumber < secretNumber) {
      setHint("Troppo basso!");
    } else {
      setHint("Troppo alto!");
    }
  };

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Indovina il Numero</CardTitle>
          <CardDescription>
            Indovina un numero tra 1 e 100. Hai {maxAttempts - attempts}{" "}
            tentativi rimasti!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={(attempts / maxAttempts) * 100} />

          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Inserisci un numero..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={gameWon || attempts >= maxAttempts}
            />

            {hint && (
              <p
                className={`text-sm font-medium ${
                  hint === "Troppo alto!" ? "text-red-500" : "text-blue-500"
                }`}
              >
                {hint}
              </p>
            )}
          </div>

          <div className="space-x-2">
            <Button
              onClick={handleGuess}
              disabled={gameWon || attempts >= maxAttempts}
            >
              Prova
            </Button>
            <Button variant="outline" onClick={startNewGame}>
              Nuova Partita
            </Button>
          </div>

          {gameWon && (
            <p className="text-center font-medium text-green-500">
              Hai vinto! 🎉
            </p>
          )}

          {attempts >= maxAttempts && !gameWon && (
            <p className="text-center font-medium text-red-500">
              Game Over! Il numero era {secretNumber}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
