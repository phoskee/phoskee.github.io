"use client";
import React, { useState, useEffect } from "react";
import { Storico } from "./storico";
import { Slider } from "~/components/ui/slider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

// Funzione per formattare la data in "YYYY-MM-DD"
const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

// Funzione per ottenere le date dinamiche
const getDynamicDates = (day: number, month: number) => {
  const today = new Date();

  // Data di riferimento per la fine (end_date) è il giorno scelto nell'anno corrente
  const endDate = new Date(today.getFullYear(), month - 1, day + 1);

  // Data di inizio (start_date) è il giorno scelto nel 1940
  const startDate = new Date(1940, month - 1, day + 1);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

export default function Index() {
  // Stati per il giorno e il mese scelti dall'utente
  const [chosenDay, setChosenDay] = useState<number>(new Date().getDate() - 1); // Default: ieri
  const [chosenMonth, setChosenMonth] = useState<number>(
    new Date().getMonth() + 1,
  ); // Default: mese corrente
  const [viewChosenDay, setViewChosenDay] = useState<number>(chosenDay);
  const [viewChosenMonth, setViewChosenMonth] = useState<number>(chosenMonth);
  const [risposta, setRisposta] = useState<string>("");
  const [chartData, setChartData] = useState<
    { year: string; temperature2mMax: number; temperature2mMin: number }[]
  >([]);
  const [weatherData, setWeatherData] = useState<{
    time: Date[];
    temperature2mMax: number[];
    temperature2mMin: number[];
  } | null>(null); // Stato per i dati meteorologici fetchati
  const [season, setSeason] = useState<"estate" | "inverno">("estate");

  // Fetch dei dati solo al caricamento della pagina
  useEffect(() => {
    async function fetchData() {
      try {
        const searchParams = new URLSearchParams({
          latitude: "41.89",
          longitude: "12.48",
          start_date: "1940-01-01",
          end_date: new Date().toISOString().split("T")[0],
          daily: "temperature_2m_max,temperature_2m_min",
          timezone: "auto",
        });

        const response = await fetch(
          `https://archive-api.open-meteo.com/v1/archive?${searchParams.toString()}`,
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = await response.json();
        const daily = json.daily ?? {};

        if (!daily.time || !daily.temperature_2m_max || !daily.temperature_2m_min) {
          throw new Error("Unexpected response format from Open Meteo API");
        }

        const data = {
          time: (daily.time as string[]).map((iso: string) => new Date(iso)),
          temperature2mMax: daily.temperature_2m_max as number[],
          temperature2mMin: daily.temperature_2m_min as number[],
        };

        setWeatherData(data);
      } catch (error) {
        console.error("Errore nel fetch dei dati meteorologici:", error);
      }
    }

    fetchData();
  }, []);

  // Aggiorna i dati visualizzati in base ai parametri dell'utente
  useEffect(() => {
    if (!weatherData) return;

    const { endDate } = getDynamicDates(chosenDay, chosenMonth);

    if (!endDate) {
      console.error("endDate è undefined.");
      return;
    }

    const temperaturesByYear = weatherData.time
      .map((date: Date, index: number) => {
        if (
          date.getDate() === chosenDay &&
          date.getMonth() === chosenMonth - 1
        ) {
          return {
            year: date.getFullYear().toString(),
            temperature2mMax:
              weatherData.temperature2mMax[index] !== undefined
                ? weatherData.temperature2mMax[index]
                : NaN,
            temperature2mMin:
              weatherData.temperature2mMin[index] !== undefined
                ? weatherData.temperature2mMin[index]
                : NaN,
          };
        }
        return null;
      })
      .filter(
        (entry): entry is { year: string; temperature2mMax: number; temperature2mMin: number } =>
          entry !== null,
      );

    setChartData(temperaturesByYear);

    if (!temperaturesByYear.length) {
      setRisposta("Nessun dato storico disponibile per il giorno selezionato.");
      return;
    }

    const maxTemperatureEntry = temperaturesByYear.reduce(
      (max, entry) =>
        entry.temperature2mMax > max.temperature2mMax ? entry : max,
      temperaturesByYear[0]!,
    );

    const minTemperatureEntry = temperaturesByYear.reduce(
      (min, entry) =>
        entry.temperature2mMin < min.temperature2mMin ? entry : min,
      temperaturesByYear[0]!,
    );

    const isExtremeDay =
      season === "estate"
        ? maxTemperatureEntry.year === endDate.split("-")[0]
        : minTemperatureEntry.year === endDate.split("-")[0];

    const responseText = `È il giorno più ${season === "estate" ? "caldo" : "freddo"} di sempre (per il ${chosenDay}/${chosenMonth})? Considerando la temperatura massima di questo giorno negli ultimi 84 anni, la risposta è: ${isExtremeDay ? "Sì" : "No"}. 
    La temperatura più alta è stata di ${Math.round(maxTemperatureEntry.temperature2mMax)}°C nel ${maxTemperatureEntry.year}, 
    mentre la temperatura più bassa è stata di ${Math.round(minTemperatureEntry.temperature2mMin)}°C nel ${minTemperatureEntry.year}.`;

    setRisposta(responseText);
  }, [chosenDay, chosenMonth, weatherData, season]);

  return chartData.length === 0 ? (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg">Nessun dato o limite massimo superato</p>
    </div>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl md:text-3xl">
            Analisi Storica delle Temperature a Roma
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Giorno: {viewChosenDay}
            </label>
            <Slider
              defaultValue={[chosenDay]}
              min={1}
              max={31}
              step={1}
              onValueCommit={(e) => {
                if (e[0] !== undefined) setChosenDay(e[0]);
              }}
              onValueChange={(e) => {
                if (e[0] !== undefined) setViewChosenDay(e[0]);
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Mese: {viewChosenMonth}
            </label>
            <Slider
              defaultValue={[chosenMonth]}
              min={1}
              max={12}
              step={1}
              onValueCommit={(e) => {
                if (e[0] !== undefined) setChosenMonth(e[0]);
              }}
              onValueChange={(e) => {
                if (e[0] !== undefined) setViewChosenMonth(e[0]);
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Seleziona la stagione:
            </label>
            <Select
              value={season}
              onValueChange={(e) => setSeason(e as "estate" | "inverno")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleziona la stagione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estate">Estate</SelectItem>
                <SelectItem value="inverno">Inverno</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <CardContent>
          <Storico chartData={chartData} />
        </CardContent>

        <CardFooter>
          <p className="text-center text-sm md:text-base">{risposta}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
