"use client";
import React, { useState, useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";
import { Storico } from "./storico";
import { Slider } from "~/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

// Funzione per formattare la data in "YYYY-MM-DD"
const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

// Funzione per ottenere le date dinamiche
const getDynamicDates = (day: number, month: number) => {
  const today = new Date();

  // Data di riferimento per la fine (end_date) è il giorno scelto nell'anno corrente
  const endDate = new Date(today.getFullYear(), month - 1, day);

  // Data di inizio (start_date) è il giorno scelto nel 1940
  const startDate = new Date(1940, month - 1, day);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};
const chartDataV = [
  {
    year: ["2024"],
    temperature2mMax: ["0"],
  },
];

export default function Index() {
  // Stati per il giorno e il mese scelti dall'utente
  const [chosenDay, setChosenDay] = useState<number>(new Date().getDate() - 1); // Default: ieri
  const [chosenMonth, setChosenMonth] = useState<number>(
    new Date().getMonth() + 1,
  ); // Default: mese corrente
  const [viewChosenDay, setViewChosenDay] = useState<number>(chosenDay);
  const [viewChosenMonth, setViewChosenMonth] = useState<number>(chosenMonth);
  const [risposta, setRisposta] = useState<string>("");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const { startDate, endDate } = getDynamicDates(chosenDay, chosenMonth);

    // Parametri dinamici basati sul giorno e mese scelti
    const params = {
      latitude: 41.89,
      longitude: 12.48,
      start_date: startDate, // Data dinamica di inizio
      end_date: endDate, // Data dinamica di fine
      daily: "temperature_2m_max",
      timezone: "auto",
    };

    const url = "https://archive-api.open-meteo.com/v1/archive";

    async function fetchData() {
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const daily = response.daily()!;

      const weatherData = {
        time: Array.from(
          {
            length:
              (Number(daily.timeEnd()) - Number(daily.time())) /
              daily.interval(),
          },
          (_, i) =>
            new Date(
              (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
                1000,
            ),
        ),
        temperature2mMax: daily.variables(0)!.valuesArray()!,
      };

      const temperaturesByYear = weatherData.time
        .map((date, index) => {
          if (
            date.getDate() === chosenDay &&
            date.getMonth() === chosenMonth - 1
          ) {
            return {
              year: date.getFullYear().toString(),
              temperature2mMax: parseFloat(
                weatherData.temperature2mMax[index],
              )?.toFixed(1),
            };
          }
          return null;
        })
        .filter((entry) => entry !== null);

      setChartData(temperaturesByYear);

      const maxTemperatureEntry = temperaturesByYear.reduce(
        (max, entry) =>
          entry!.temperature2mMax > max.temperature2mMax ? entry! : max,
        temperaturesByYear[0]!,
      );

      const minTemperatureEntry = temperaturesByYear.reduce(
        (min, entry) =>
          entry!.temperature2mMax < min.temperature2mMax ? entry! : min,
        temperaturesByYear[0]!,
      );

      const isHottestDay = maxTemperatureEntry.year === endDate.split("-")[0];

      const responseText = `È il giorno più caldo di sempre (per il ${chosenDay}/${chosenMonth})? Considerando la temperatura massima di questo giorno negli ultimi 84 anni, la risposta è: ${isHottestDay ? "Sì" : "No"}. 
      La temperatura più alta è stata di ${maxTemperatureEntry.temperature2mMax}°C nel ${maxTemperatureEntry.year}, 
      mentre la temperatura più bassa è stata di ${minTemperatureEntry.temperature2mMax}°C nel ${minTemperatureEntry.year}.`;

      setRisposta(responseText);
    }

    void fetchData();
  }, [chosenDay, chosenMonth]);
console.log(chartData);

  return (
    chartData.length === 0 ? <div>Nessun dato o limite massimo superato</div> :
    <Card className="m-4 max-w-prose bg-gray-200">
      <CardHeader>
        <CardTitle>Analisi Storica delle Temperature a Roma</CardTitle>
      </CardHeader>

      <CardContent className="w-full">
        <label className="">Giorno: {viewChosenDay}</label>
        <Slider
          defaultValue={[chosenDay]}
          min={1}
          max={31}
          step={1}
          onValueCommit={(e) => setChosenDay(e[0])}
          onValueChange={(e) => setViewChosenDay(e[0])}
          className="p-2"
        />

        <label className="">Mese: {viewChosenMonth}</label>
        <Slider
          defaultValue={[chosenMonth]}
          min={1}
          max={12}
          step={1}
          onValueCommit={(e) => setChosenMonth(e[0])}
          onValueChange={(e) => setViewChosenMonth(e[0])}
          className="p-2"
        />
      </CardContent>
      <CardContent>
        <Storico chartData={chartData} />
      </CardContent>
      <CardFooter>
        <p className="text-lg">{risposta}</p>
      </CardFooter>
    </Card>
  );
}
