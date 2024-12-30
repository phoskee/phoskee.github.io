"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

interface ChartData {
  year: string;
  temperature2mMax: number;
  temperature2mMin: number;
}


const chartConfig = {
  temperature2mMax: {
    label: "temperatura massima",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Storico({ chartData }: { chartData: ChartData[] }) {
  console.log(chartData);
  return (

        <ChartContainer config={chartConfig} >
          <LineChart  accessibilityLayer data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -35}}>
          <CartesianGrid stroke="#eee" strokeDasharray="10 10"/>
          <XAxis dataKey="year" />
          <YAxis dataKey="temperature2mMax" domain={['auto', 'auto']}   />
            <ChartTooltip
              content={<ChartTooltipContent  />}
            />
            <Line type="monotone" dataKey="temperature2mMax" stroke="var(--color-temperature2mMax)" strokeWidth={1} dot={false} />
          </LineChart>
        </ChartContainer>

  );
}
