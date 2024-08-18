export default function Index() {
  return <div>WORK IN PROGRESS</div>;
}

// "use client";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "~/components/ui/input-otp";
// import { REGEXP_ONLY_CHARS } from "input-otp";

// import { useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "~/components/ui/select";
// import { Button } from "~/components/ui/button";
// //import { Input } from "~/components/ui/input";
// import { Label } from "~/components/ui/label";
// import Link from "next/link";

// interface LetteraGriglia {
//   id: number;
//   lettera: string;
// }

// interface RisultatoRicerca {
//   parola: string;
//   coordinate: number[];
// }



// export default function Index() {
//   const [value, setValue] = useState<string>("");
//   const [paroleTrovateMap, setParoleTrovateMap] = useState<RisultatoRicerca[]>(
//     [],
//   );

//   const avviaRicerca = async () => {
//     if (value.length < 25) {
//       alert("inserisci tutti i caratteri");
//     } else {
//       console.log("ok");
//       console.log("chiamo trova parole");
//       const risultatiTrovati = await trovaParole(
//         value,
//         "dizionario_no_accenti_minuscolo.txt",
//         4,
//         16,
//       );
//       console.log("Risultati trovati:", risultatiTrovati);
//       setParoleTrovateMap(risultatiTrovati);
//     }
//   };

//   async function trovaParole(
//     letters: string,
//     fileParole: string,
//     lunghezzaMin: number,
//     lunghezzaMax: number,
//   ): Promise<RisultatoRicerca[]> {
//     console.log("avvio trova parole");
//     const risultati: RisultatoRicerca[] = [];
//     const paroleDaTrovare: string[] = [];
//     const griglia: LetteraGriglia[][] = [];

//     for (let i = 0; i < 5; i++) {
//       griglia.push([]);
//       for (let j = 0; j < 5; j++) {
//         const id = i * 5 + j + 1; // Calcola l'ID incrementale basato sulla posizione
//         const lettera = letters[i * 5 + j]!.toUpperCase();
//         griglia?[i][j] = { id, lettera };
//       }
//       console.log("griglia creata");
//     }
//     console.log("griglia ", griglia);
//     console.log(
//       "test griglia[0][0].id",
//       griglia[0][0].id,
//       "test griglia[0][0].lettera",
//       griglia[0][0].lettera,
//     );

//     await fetch(fileParole)
//       .then((response) => response.text())
//       .then((data) => {
//         console.log("fetch file parole", fileParole);
//         const parole = data.split("\n");
//         for (const parola of parole) {
//           const parolaSenzaSpazi = parola.trim().toUpperCase();
//           if (
//             parolaSenzaSpazi.length >= lunghezzaMin &&
//             parolaSenzaSpazi.length <= lunghezzaMax
//           ) {
//             paroleDaTrovare.push(parolaSenzaSpazi);
//           }
//         }
//         console.log("paroleDaTrovare lunghezza", paroleDaTrovare.length);
//       })
//       .catch((error) =>
//         console.error("Errore nel caricamento del file parole:", error),
//       );

//     function ricercaParole(
//       riga: number,
//       colonna: number,
//       parolaCorrente: string,
//       parolaRestante: string,
//       visitate: Set<string>,
//     ) {
//       if (visitate.has(`${riga},${colonna}`)) {
//         return;
//       }

//       visitate.add(`${riga},${colonna}`);

//       if (parolaRestante === "") {
//         risultati.push({
//           parola: parolaCorrente,
//           coordinate: Array.from(visitate).map((coordinate) => {
//             const [row, col] = coordinate.split(",").map(Number);
//             return griglia[row][col].id;
//           }),
//         });
//         return;
//       }

//       const prossimaLettera = parolaRestante[0];

//       for (
//         let i = Math.max(0, riga - 1);
//         i < Math.min(griglia.length, riga + 2);
//         i++
//       ) {
//         for (
//           let j = Math.max(0, colonna - 1);
//           j < Math.min(griglia[0].length, colonna + 2);
//           j++
//         ) {
//           if (griglia[i][j].lettera.toUpperCase() === prossimaLettera) {
//             ricercaParole(
//               i,
//               j,
//               parolaCorrente + griglia[i][j].lettera,
//               parolaRestante.slice(1),
//               new Set(visitate),
//             );
//           }
//         }
//       }
//     }

//     const paroleUniche = Array.from(new Set(paroleDaTrovare)); // Rimuovi duplicati
//     paroleUniche.sort((a, b) => b.length - a.length); // Ordina dalla più lunga alla più corta

//     for (const parola of paroleUniche) {
//       for (let i = 0; i < griglia.length; i++) {
//         for (let j = 0; j < griglia[0].length; j++) {
//           if (griglia[i][j].lettera === parola[0]) {
//             ricercaParole(
//               i,
//               j,
//               griglia[i][j].lettera,
//               parola.slice(1),
//               new Set(),
//             );
//           }
//         }
//       }
//     }
//     alert("Ricerca completata");
//     return risultati;
//   }
//   const [slotClasses, setSlotClasses] = useState(
//     Array(25).fill("bg-white rounded-md"),
//   );

//   const handleValueChange = (value) => {
//     console.log("value", value);

//     // Assicurati che `value` sia un array
//     const indices = Array.isArray(value) ? value : value.split(",").map(Number);

//     // Crea una copia dell'array delle classi
//     const newClasses = Array(25).fill("bg-white rounded-md");

//     // Imposta la classe per gli indici specificati
//     indices.forEach((index) => {
//       console.log("index", index);
//       newClasses[index - 1] = "bg-yellow-200  rounded-md";
//     });

//     // Aggiorna lo stato delle classi
//     setSlotClasses(newClasses);
//   };

//   //    setSlotClasses(Array(25).fill('bg-yellow-200 rounded-md'));

//   return (
//     <div className="flex min-h-svh select-none place-items-center">
//       <div className="mx-auto">
//         <div className="mb-2 select-none rounded-xl border">
//           <InputOTP
//             inputMode="text"
//             pattern={REGEXP_ONLY_CHARS}
//             maxLength={26}
//             value={value}
//             onChange={(value) => setValue(value)}
//           >
//             <InputOTPGroup className="grid select-none grid-cols-5 gap-1 rounded-xl p-2">
//               {Array.from({ length: 25 }).map((_, index) => (
//                 <InputOTPSlot
//                   key={index}
//                   index={index}
//                   className={slotClasses[index]}
//                 />
//               ))}
//             </InputOTPGroup>
//           </InputOTP>
//         </div>
//         <div className="grid w-full gap-2 rounded-xl border p-2">
//           <Button
//             id="ricerca-btn"
//             className="rounded-xl"
//             variant={"secondary"}
//             onClick={avviaRicerca}
//           >
//             Avvia ricerca parole
//           </Button>
//           <Select onValueChange={(e) => handleValueChange(e)}>
//             <SelectTrigger className="w-full rounded-xl p-2">
//               <SelectValue placeholder="Seleziona una parola" />
//             </SelectTrigger>
//             <SelectContent>
//               {paroleTrovateMap.map((parola, index) => (
//                 <SelectItem key={index} value={`${parola.coordinate}`}>
//                   {parola.parola}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Link href="/projects/test">
//             <Button className="w-full rounded-xl" variant={"secondary"}>
//               Reset
//             </Button>
//           </Link>
//           {/* <Input className="rounded-xl bg-white text-black"></Input>
//           <Button id="cerca-btn" className="rounded-xl" variant={"secondary"}>
//             Cerca
//           </Button> */}
//         </div>
//       </div>
//       <Label className="absolute bottom-0 left-0 m-2">versione 0.0.2</Label>
//     </div>
//   );
// }
