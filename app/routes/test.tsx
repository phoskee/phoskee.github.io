import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { REGEXP_ONLY_CHARS } from "input-otp";

import type { MetaFunction } from "@remix-run/node";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Tests" }];
};

export default function Index() {
  const [value, setValue] = React.useState("");
  const [paroleTrovateMap, setParoleTrovateMap] = useState([]);

  const avviaRicerca = async () => {
    if (value.length < 25) {
      alert("inserisci tutti i caratteri");
    } else {
      console.log("ok");
      console.log("chiamo trovo parole");
      // Chiamata a trovaParole dopo la sostituzione delle lettere
      const risultatiTrovati = await trovaParole(
        value,
        "dizionario_no_accenti_minuscolo.txt",
        4,
        16
      );
      console.log("Risultati trovati:", risultatiTrovati);
      setParoleTrovateMap(risultatiTrovati);

      /*fine else*/
    }
    async function trovaParole(
      letters: string,
      fileParole: string,
      lunghezzaMin: number,
      lunghezzaMax: number
    ) {
      console.log("avvio trova parole");
      const risultati: { parola: any; coordinate: any[] }[] = [];
      const paroleDaTrovare = [];
      // Creazione della griglia
      const griglia = [];

      for (let i = 0; i < 5; i++) {
        griglia.push([]);
        for (let j = 0; j < 5; j++) {
          const id = i * 5 + j + 1; // Calcola l'ID incrementale basato sulla posizione
          const lettera = letters[i * 5 + j].toUpperCase();
          griglia[i][j] = { id, lettera };
        }
        console.log("griglia creata");
      }
      console.log("griglia ", griglia);
      console.log(
        "test griglia[0][0].id",
        griglia[0][0].id,
        "test griglia[0][0].lettera",
        griglia[0][0].lettera
      );

      await fetch(fileParole)
        .then((response) => response.text())
        .then((data) => {
          console.log("fetch file parole", fileParole);
          const parole = data.split("\n");
          for (const parola of parole) {
            const parolaSenzaSpazi = parola.trim().toUpperCase();
            if (
              parolaSenzaSpazi.length >= lunghezzaMin &&
              parolaSenzaSpazi.length <= lunghezzaMax
            ) {
              paroleDaTrovare.push(parolaSenzaSpazi);
            }
          }
          console.log("paroleDaTrovare lunghezza", paroleDaTrovare.length);
        })
        .catch((error) =>
          console.error("Errore nel caricamento del file parole:", error)
        );

      function ricercaParole(
        riga: number,
        colonna: number,
        parolaCorrente: string,
        parolaRestante: string,
        visitate
      ) {
        if (visitate.has(`${riga},${colonna}`)) {
          return;
        }

        visitate.add(`${riga},${colonna}`);

        if (parolaRestante === "") {
          risultati.push({
            parola: parolaCorrente,
            coordinate: Array.from(visitate).map((coordinate) => {
              const [row, col] = coordinate.split(",").map(Number);
              return griglia[row][col].id;
            }),
          });
          return;
        }

        const prossimaLettera = parolaRestante[0];

        for (
          let i = Math.max(0, riga - 1);
          i < Math.min(griglia.length, riga + 2);
          i++
        ) {
          for (
            let j = Math.max(0, colonna - 1);
            j < Math.min(griglia[0].length, colonna + 2);
            j++
          ) {
            if (griglia[i][j].lettera.toUpperCase() === prossimaLettera) {
              ricercaParole(
                i,
                j,
                parolaCorrente + griglia[i][j].lettera,
                parolaRestante.slice(1),
                new Set(visitate)
              );
            }
          }
        }
      }

      const paroleUniche = Array.from(new Set(paroleDaTrovare)); // Rimuovi duplicati
      paroleUniche.sort((a, b) => b.length - a.length); // Ordina dalla più lunga alla più corta

      for (const parola of paroleUniche) {
        for (let i = 0; i < griglia.length; i++) {
          for (let j = 0; j < griglia[0].length; j++) {
            if (griglia[i][j].lettera === parola[0]) {
              ricercaParole(
                i,
                j,
                griglia[i][j].lettera,
                parola.slice(1),
                new Set()
              );
            }
          }
        }
      }
      alert("Ricerca completata");
      return risultati;
    }
  };

  return (
    <div className="flex place-items-center min-h-svh ">
      <div className="mx-auto">
        <div className="mb-2 bg-pink-200 ">
          <InputOTP
            inputMode="text"
            pattern={REGEXP_ONLY_CHARS}
            maxLength={26}
            value={value}
            onChange={(value) => setValue(value)}
          >
            <InputOTPGroup className="grid grid-cols-5 gap-1 rounded-xl p-2">
              {Array.from({ length: 25 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="bg-white rounded-md"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="grid rounded-xl bg-pink-200 w-full p-2 gap-2">
          <Button
            id="ricerca-btn"
            className="rounded-xl"
            variant={"secondary"}
            onClick={avviaRicerca}
          >
            Avvia ricerca parole
          </Button>
          <Select>
            <SelectTrigger className="w-full rounded-xl bg-white p-2">
              <SelectValue placeholder="Seleziona una parola" />
            </SelectTrigger>
            <SelectContent>
              {paroleTrovateMap.map((parola, index) => (
                <SelectItem
                  key={index}
                  value={`${parola.parola}-${parola.coordinate.join("-")}`}
                >
                  {parola.parola}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link to="/test" reloadDocument>
            <Button className="rounded-xl w-full" variant={"secondary"}>
              Reset
            </Button>
          </Link>
          {/* <Input className="rounded-xl bg-white text-black"></Input>
          <Button id="cerca-btn" className="rounded-xl" variant={"secondary"}>
            Cerca
          </Button> */}
        </div>
      </div>
    </div>
  );
}
