"use client";

import { Slider } from "@/components/ui/slider";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  type TooltipProps,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";

import { BudgetReport } from "./budget-report";
import { MonthlyIncomeTable } from "./monthly-income-table";
import { SpendingTables, type SpendingTotals } from "./spending-tables";
import { Label } from "@/components/ui/label";

export const description = "A line chart";

type LoanChartPoint = {
  month: number;
  quotaInteressi: number;
  quotaCapitale: number;
  capitaleResiduo: number;
  pagamentoTotale: number;
};

type LoanScheduleResult = {
  data: LoanChartPoint[];
  totalInterest: number;
  monthlyPayment: number;
};

const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

function calculateLoanSchedule(
  principal: number,
  annualRate: number,
  years: number,
): LoanScheduleResult {
  if (principal <= 0 || years <= 0) {
    return {
      data: [],
      totalInterest: 0,
      monthlyPayment: 0,
    };
  }

  const payments = Math.max(Math.round(years * 12), 1);
  const monthlyRate = annualRate > 0 ? annualRate / 100 / 12 : 0;
  const monthlyPayment =
    monthlyRate === 0
      ? principal / payments
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -payments));

  let balance = principal;
  const schedule: LoanChartPoint[] = [];
  let totalInterest = 0;

  for (let installment = 1; installment <= payments; installment += 1) {
    const interestPayment = monthlyRate === 0 ? 0 : balance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;

    if (installment === payments) {
      principalPayment = balance;
    }

    balance = Math.max(balance - principalPayment, 0);
    totalInterest += interestPayment;

    schedule.push({
      month: installment,
      quotaInteressi: Number(interestPayment.toFixed(2)),
      quotaCapitale: Number(principalPayment.toFixed(2)),
      capitaleResiduo: Number(balance.toFixed(2)),
      pagamentoTotale: Number((interestPayment + principalPayment).toFixed(2)),
    });
  }

  return {
    data: schedule,
    totalInterest: Number(totalInterest.toFixed(2)),
    monthlyPayment: schedule[0]?.pagamentoTotale ?? 0,
  };
}

const chartConfig = {
  quotaInteressi: {
    label: "Quota Interessi",
    color: "var(--chart-1)",
  },
  quotaCapitale: {
    label: "Quota Capitale",
    color: "var(--chart-2)",
  },
  capitaleResiduo: {
    label: "Capitale Residuo",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

function LoanTooltipContent({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload as LoanChartPoint | undefined;

  if (!point) {
    return null;
  }

  const colors = payload.reduce<Record<string, string | undefined>>(
    (acc, item) => {
      if (item.dataKey) {
        acc[item.dataKey.toString()] = item.color;
      }
      return acc;
    },
    {},
  );

  const rows: Array<{ label: string; value: number; color?: string }> = [
    {
      label: "Quota interessi",
      value: point.quotaInteressi,
      color: colors.quotaInteressi,
    },
    {
      label: "Quota capitale",
      value: point.quotaCapitale,
      color: colors.quotaCapitale,
    },
    {
      label: "Totale pagato",
      value: point.pagamentoTotale,
    },
    {
      label: "Capitale residuo",
      value: point.capitaleResiduo,
      color: colors.capitaleResiduo ?? "var(--color-capitaleResiduo)",
    },
  ];

  return (
    <div className="border-border/50 bg-background grid min-w-[12rem] gap-2 rounded-lg border px-3 py-2 text-xs shadow-xl">
      <div className="font-medium">Mese {point.month}</div>
      <div className="grid gap-1.5">
        {rows.map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <div className="text-muted-foreground flex items-center gap-2">
              {color ? (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: color }}
                />
              ) : null}
              <span>{label}</span>
            </div>
            <span className="text-foreground font-mono tabular-nums">
              {formatCurrency(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoanChart() {
  const [tassoInteresse, setTassoInteresse] = useState(2.5);
  const [anni, setAnni] = useState(30);
  const [richiesta, setRichiesta] = useState(150000);
  const [loanSummary, setLoanSummary] = useState<LoanScheduleResult>(() =>
    calculateLoanSchedule(150000, 2.5, 30),
  );
  const [monthlyIncomeTotal, setMonthlyIncomeTotal] = useState(0);
  const [spendingTotals, setSpendingTotals] = useState<SpendingTotals>({
    annuali: 0,
    mensili: 0,
    settimanali: 0,
    giornaliere: 0,
  });

  const { data: chartData, totalInterest, monthlyPayment } = loanSummary;

  useEffect(() => {
    setLoanSummary(calculateLoanSchedule(richiesta, tassoInteresse, anni));
  }, [anni, richiesta, tassoInteresse]);

  return (
    <div className="flex flex-col gap-2">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Piano di ammortamento</CardTitle>
          <CardDescription>
            Distribuzione mensile tra interessi, capitale e saldo residuo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip cursor={false} content={<LoanTooltipContent />} />
              <Line
                dataKey="quotaInteressi"
                type="natural"
                stroke="var(--color-quotaInteressi)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="quotaCapitale"
                type="natural"
                stroke="var(--color-quotaCapitale)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex w-full flex-wrap gap-2 sm:flex-nowrap">
            <div className="w-full rounded-md border p-2">
              <div className="flex items-center justify-between gap-4">
                <Label className="text-xl">Interessi totali</Label>
                <Label className="text-xl">
                  {formatCurrency(totalInterest)}
                </Label>
              </div>
            </div>
            <div className="w-full rounded-md border p-2">
              <div className="flex items-center justify-between gap-4">
                <Label className="text-xl">Rata mensile</Label>
                <Label className="text-xl">
                  {formatCurrency(monthlyPayment)}
                </Label>
              </div>
            </div>
          </div>
          <div className="w-full rounded-md border p-2">
            <div className="flex items-center justify-between gap-4">
              <Slider
                className="max-w-md"
                value={[richiesta]}
                min={1000}
                max={300000}
                step={1000}
                onValueChange={(values) =>
                  setRichiesta(Number(values[0] ?? richiesta))
                }
              />
              <Label className="text-xl">{formatCurrency(richiesta)}</Label>
            </div>
          </div>

          <div className="w-full rounded-md border p-2">
            <div className="flex items-center justify-between gap-4">
              <Slider
                className="max-w-md"
                value={[tassoInteresse]}
                min={0}
                max={15}
                step={0.1}
                onValueChange={(values) =>
                  setTassoInteresse(Number(values[0] ?? tassoInteresse))
                }
              />
              <Label className="text-xl">
                {tassoInteresse.toLocaleString("it-IT", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 1,
                })}
                %
              </Label>
            </div>
          </div>
          <div className="w-full rounded-md border p-2">
            <div className="flex items-center justify-between gap-4">
              <Slider
                className="max-w-md"
                value={[anni]}
                min={1}
                max={40}
                step={1}
                onValueChange={(values) => setAnni(Number(values[0] ?? anni))}
              />
              <Label className="text-xl">{anni} anni</Label>
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="space-y-2">
        <MonthlyIncomeTable onTotalChange={setMonthlyIncomeTotal} />

        <SpendingTables
          rataMensile={monthlyPayment}
          onTotalsChange={setSpendingTotals}
        />

        <BudgetReport
          monthlyIncome={monthlyIncomeTotal}
          expenseTotals={spendingTotals}
        />
      </div>
    </div>
  );
}
