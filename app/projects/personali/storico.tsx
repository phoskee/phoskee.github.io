"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartData = {
  year: string;
  temperature2mMax: number;
  temperature2mMin: number;
};

type StoricoProps = {
  chartData: ChartData[];
};

const formatTemperature = (value: number) => `${value.toFixed(1)}°C`;

export function Storico({ chartData }: StoricoProps) {
  if (!chartData.length) {
    return (
      <div className="flex h-48 items-center justify-center rounded-md border text-sm text-muted-foreground">
        Nessun dato disponibile per i parametri selezionati.
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full md:h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
            formatter={(value: number | string, name) => [
              formatTemperature(Number(value)),
              name === "temperature2mMax" ? "Max" : "Min",
            ]}
          />
          <Line
            type="monotone"
            dataKey="temperature2mMax"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="temperature2mMin"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
