"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SpendingTotals } from "./spending-tables";

const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

const chartConfig = {
  balance: {
    label: "Saldo cumulato",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export type BudgetReportProps = {
  monthlyIncome: number;
  expenseTotals: SpendingTotals;
};

export function BudgetReport({
  monthlyIncome,
  expenseTotals,
}: BudgetReportProps) {
  const monthlyExpense = expenseTotals.mensili;
  const weeklyExpense = expenseTotals.settimanali;
  const dailyExpense = expenseTotals.giornaliere;
  const annualExpense = expenseTotals.annuali;

  const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const totalDays = monthLengths.reduce((sum, length) => sum + length, 0);
  const halfYearDay =
    monthLengths.slice(0, 6).reduce((sum, length) => sum + length, 0) + 1; // primo giorno del mese 7

  const chartData: Array<{ day: number; balance: number }> = [];
  const monthEndBalances: number[] = [];

  let balance = 0;
  let dayOfYear = 0;
  let annualApplied = false;

  monthLengths.forEach((monthLength, monthIndex) => {
    for (let dayInMonth = 1; dayInMonth <= monthLength; dayInMonth += 1) {
      dayOfYear += 1;

      if (dayInMonth === 1) {
        balance += monthlyIncome;
      }

      if (dayOfYear % 7 === 0 && weeklyExpense > 0) {
        balance -= weeklyExpense;
      }

      if (dayInMonth === 15 && monthlyExpense > 0) {
        balance -= monthlyExpense;
      }

      if (!annualApplied && dayOfYear === halfYearDay && annualExpense > 0) {
        balance -= annualExpense;
        annualApplied = true;
      }

      if (dailyExpense > 0) {
        balance -= dailyExpense;
      }

      chartData.push({ day: dayOfYear, balance: Number(balance.toFixed(2)) });
    }

    monthEndBalances.push(balance);
  });

  const monthlyRemaining = monthEndBalances[0] ?? 0;
  const yearlyRemaining = chartData.at(-1)?.balance ?? 0;

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Report finanziario</CardTitle>
        <CardDescription>
          Evoluzione del saldo nell'arco dei 12 mesi con eventi ricorrenti.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 5,
              right: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
              interval={Math.max(1, Math.floor(totalDays / 12))}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Area
              dataKey="balance"
              type="natural"
              stroke="var(--color-balance)"
              fill="var(--color-balance)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border p-4">
            <div className="text-muted-foreground text-sm">Saldo mensile</div>
            <div className="text-2xl font-semibold">
              {formatCurrency(monthlyRemaining)}
            </div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-muted-foreground text-sm">Saldo annuale</div>
            <div className="text-2xl font-semibold">
              {formatCurrency(yearlyRemaining)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
