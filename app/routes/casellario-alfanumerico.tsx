import React, { useState, useEffect } from "react";
import { REGEXP_ONLY_CHARS } from "input-otp";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import { Link } from "@remix-run/react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

export default function CasellarioAlfanumerico() {
  const [randomChars, setRandomChars] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showRandomChars, setShowRandomChars] = useState(false);
  const [timeoutValue, setTimeoutValue] = useState(2000); // valore di default: 2000 ms
  const [numChars, setNumChars] = useState(4); // valore di default: 4 caratteri
  const [open, setOpen] = React.useState(false);
  const [corrette, setCorrette] = useState(0);

  /// Genera una nuova sequenza di caratteri casuali e posizionali in modo random all'interno della griglia
  const generateNewChars = () => {
    const chars = [];
    const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const randomIndexes = [];

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
    let timeout;
    if (showRandomChars) {
      timeout = setTimeout(() => {
        setShowRandomChars(false);
      }, timeoutValue);
    }
    return () => clearTimeout(timeout);
  }, [showRandomChars, timeoutValue]);

  // Verifica le lettere inserite
  const verifyInput = () => {
    let correctCount = 0;
    for (let i = 0; i < inputValue.length; i++) {
      if (inputValue[i] === randomChars[i]) {
        correctCount++;
        setCorrette(correctCount);
      }
    }
    //alert(`Hai indovinato ${correctCount} caratteri.`);
    setOpen(true);
    setTimeoutValue(10000);
    setShowRandomChars(true);
  };

  // Genera una nuova sequenza di caratteri casuali e mostra
  const handleNewSequence = () => {
    const newRandomChars = generateNewChars();
    setCorrette(0);
    setTimeoutValue(1000);
    setRandomChars(newRandomChars);
    setShowRandomChars(true);
    setInputValue("");
  };

  return (
    <div className="min-h-svh flex place-items-center">
      <Link to="/" className="place-self-start absolute">
        <Button className="p-2 m-2" size="icon">
          <ArrowLeftIcon className=" size-12 " />
        </Button>
      </Link>
      <div className="flex-col place-items-center mx-auto w-fit">
        <div className="p-1">
          <div className="w-fit grid grid-cols-3 gap-1 rounded-xl bg-pink-200 p-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="bg-white text-center rounded-md size-14"
                value={showRandomChars ? randomChars[index] : ""}
                disabled={showRandomChars}
                onChange={(e) => {
                  if (!showRandomChars) {
                    const newValue = [...inputValue];
                    newValue[index] = e.target.value.toUpperCase();
                    setInputValue(newValue.join("").toUpperCase());
                  }
                }}
              />
            ))}
          </div>
        </div>
        <div className="p-1">
          <div className="w-fit grid grid-cols-3 gap-1 rounded-xl bg-pink-200 p-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                pattern={REGEXP_ONLY_CHARS}
                className="bg-white text-center rounded-md size-14"
                value={inputValue[index] || ""}
                onChange={(e) => {
                  const newValue = [...inputValue];
                  newValue[index] = e.target.value.toUpperCase();
                  setInputValue(newValue);
                }}
              />
            ))}
          </div>
        </div>

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
          <Button className="w-full my-1" onClick={verifyInput}>
            Verifica
          </Button>
          <Button className="w-full my-1" onClick={handleNewSequence}>
            Nuovo
          </Button>
        </div>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>SEI UNA GRANDE!</AlertDialogTitle>
            <AlertDialogDescription>
              Hai indovinato {corrette} caratteri su {numChars}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setOpen(false)}>Continua</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
