"use client";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function CasellarioAlfanumerico() {
  const [randomChars, setRandomChars] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showRandomChars, setShowRandomChars] = useState(false);
  const [timeoutValue, setTimeoutValue] = useState(2000); // valore di default: 2000 ms
  const [numChars, setNumChars] = useState(4); // valore di default: 4 caratteri


  /// Genera una nuova sequenza di caratteri casuali e posizionali in modo random all'interno della griglia
  const generateNewChars = () => {
    const chars = [];
    const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const randomIndexes: number[] = [];

    // Genera un array di indici random unici
    while (randomIndexes.length < numChars) {
      const randomIndex = Math.floor(Math.random() * 9);
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
      }
    }

    // Riempie l'array randomChars con i caratteri casuali nelle posizioni random
    for (let i = 0; i < 9; i++) {
      if (randomIndexes.includes(i)) {
        const randomCharIndex = Math.floor(
          Math.random() * possibleChars.length
        );
        chars.push(possibleChars.charAt(randomCharIndex));
      } else {
        chars.push(""); // Inserisci una stringa vuota nelle posizioni non random
      }
    }

    return chars;
  };

  // Mostra i caratteri casuali per il timeout specificato
  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout | undefined;
    if (showRandomChars) {
      timeout = setTimeout(() => {
        setShowRandomChars(false);
      }, timeoutValue);
    }
    return () => clearTimeout(timeout);
  }, [showRandomChars, timeoutValue]);


  // Genera una nuova sequenza di caratteri casuali e mostra
  const handleNewSequence = () => {
    const newRandomChars = [];
    for (let i = 0; i < 10; i++) {
      const gridChars = generateNewChars();
      newRandomChars.push(...gridChars);
    }
    setTimeoutValue(2000);
    setRandomChars(newRandomChars);
    setShowRandomChars(true);
    setInputValue("");
  };

  return (
    <div className="min-h-svh flex place-items-center">
      <Link href="/" className="place-self-start absolute">
        <Button className="p-2 m-2" size="icon">
          <ArrowLeftIcon className=" size-12 " />
        </Button>
      </Link>
      <div className="flex-col place-items-center mx-auto w-fit">
        <div className=" grid grid-cols-2 md:grid-cols-5 gap-1 p-1">
          {[...Array(10)].map((_, gridIndex) => (
            <div
              key={gridIndex}
              className="w-fit grid grid-cols-3 gap-1 rounded-xl bg-pink-200 p-1"
            >
              {[...Array(9)].map((_, cellIndex) => (
                <input
                  key={cellIndex}
                  type="text"
                  maxLength={1}
                  className="bg-white text-center rounded-md size-14 sm:size-4 md:size-8 xl:size-16 "
                  value={
                    showRandomChars
                      ? randomChars[cellIndex + gridIndex * 9]
                      : ""
                  }
                  disabled={showRandomChars}
                  onChange={(e) => {
                    if (!showRandomChars) {
                      const newValue = [...inputValue];
                      newValue[cellIndex + gridIndex * 9] =
                        e.target.value.toUpperCase();
                      setInputValue(newValue.join("").toUpperCase());
                    }
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <Button className="w-full my-1" onClick={handleNewSequence}>
          Nuovo
        </Button>
        <div className="p-1">
          <Label htmlFor="timeoutInput">TimeOut {timeoutValue} (ms)</Label>
          <Input
            id="timeoutInput"
            type="number"
            value={timeoutValue}
            onChange={(e) => setTimeoutValue(parseInt(e.target.value))}
            className="w-full"
            step={100}
          />
          <Slider
            id="timeoutInput"
            max={10000}
            step={100}
            defaultValue={[timeoutValue]}
            onValueChange={(e) => setTimeoutValue(parseInt(e))}
            className="my-4"
          />
        </div>
        <div className="p-1">
          <Label htmlFor="numCharsInput">Numero di Caratteri: {numChars}</Label>
          <Slider
            id="numCharsInput"
            max={9}
            step={1}
            defaultValue={[numChars]}
            onValueChange={(e) => setNumChars(parseInt(e))}
            className="mb-5"
          />
        </div>
      </div>
    </div>
  );
}
