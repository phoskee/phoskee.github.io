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
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";

import { BudgetReport } from "./budget-report";
import { MonthlyIncomeTable } from "./monthly-income-table";
import { SpendingTables, type SpendingTotals } from "./spending-tables";
import { DataManagement } from "./data-management";
import { AdvancedAnalytics } from "./advanced-analytics";
import { Label } from "@/components/ui/label";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  calculateLoanSchedule,
  formatCurrency,
  type LoanScheduleResult,
} from "@/lib/financial-utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFinancialStore } from "@/lib/financial-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const description = "A line chart";

type LoanChartPoint = {
  month: number;
  quotaInteressi: number;
  quotaCapitale: number;
  capitaleResiduo: number;
  pagamentoTotale: number;
};

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

function LoanChartContent() {
  const { loanParams, updateLoanParams } = useFinancialStore();
  const {
    principal: richiesta,
    annualRate: tassoInteresse,
    years: anni,
  } = loanParams;

  const [loanSummary, setLoanSummary] = useState<LoanScheduleResult>(() =>
    calculateLoanSchedule(richiesta, tassoInteresse, anni),
  );
  const [monthlyIncomeTotal, setMonthlyIncomeTotal] = useState(0);
  const [spendingTotals, setSpendingTotals] = useState<SpendingTotals>({
    annuali: 0,
    mensili: 0,
    settimanali: 0,
    giornaliere: 0,
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const {
    data: chartData,
    totalInterest,
    monthlyPayment,
    isValid,
    error,
  } = loanSummary;

  useEffect(() => {
    const calculateAsync = async () => {
      setIsCalculating(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const result = calculateLoanSchedule(richiesta, tassoInteresse, anni);
        setLoanSummary(result);
      } catch (err) {
        console.error("[v0] Error calculating loan schedule:", err);
        setLoanSummary({
          data: [],
          totalInterest: 0,
          monthlyPayment: 0,
          isValid: false,
          error: "Errore nel calcolo del piano di ammortamento",
        });
      } finally {
        setIsCalculating(false);
      }
    };

    calculateAsync();
  }, [anni, richiesta, tassoInteresse]);

  const handlePrincipalChange = (values: number[]) => {
    const value = values[0] ?? richiesta;
    if (value >= 1000 && value <= 1000000) {
      updateLoanParams({ principal: value });
    }
  };

  const handleRateChange = (values: number[]) => {
    const value = values[0] ?? tassoInteresse;
    if (value >= 0 && value <= 20) {
      updateLoanParams({ annualRate: value });
    }
  };

  const handleYearsChange = (values: number[]) => {
    const value = values[0] ?? anni;
    if (value >= 1 && value <= 50) {
      updateLoanParams({ years: value });
    }
  };

  return (
    <Tabs defaultValue="calculator" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="calculator">Calcoli</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="data">Gestione Dati</TabsTrigger>
      </TabsList>

      <TabsContent value="calculator" className="w-full space-y-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Piano di ammortamento</CardTitle>
            <CardDescription>
              Distribuzione mensile tra interessi, capitale e saldo residuo
            </CardDescription>
            {!isValid && error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent>
            {isCalculating ? (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : isValid && chartData.length > 0 ? (
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
                  <ChartTooltip
                    cursor={false}
                    content={<LoanTooltipContent />}
                  />
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
            ) : (
              <div className="text-muted-foreground flex h-64 items-center justify-center">
                Impossibile generare il grafico con i parametri attuali
              </div>
            )}
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

            <div className="w-full space-y-4">
              <div className="w-full rounded-md border p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <Label className="text-sm font-medium">
                    Importo richiesto
                  </Label>
                  <Label className="text-lg font-semibold">
                    {formatCurrency(richiesta)}
                  </Label>
                </div>
                <Slider
                  className="w-full"
                  value={[richiesta]}
                  min={1000}
                  max={1000000}
                  step={1000}
                  onValueChange={handlePrincipalChange}
                  aria-label="Importo del mutuo"
                />
                <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                  <span>1.000€</span>
                  <span>1.000.000€</span>
                </div>
              </div>

              <div className="w-full rounded-md border p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <Label className="text-sm font-medium">
                    Tasso di interesse
                  </Label>
                  <Label className="text-lg font-semibold">
                    {tassoInteresse.toLocaleString("it-IT", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 1,
                    })}
                    %
                  </Label>
                </div>
                <Slider
                  className="w-full"
                  value={[tassoInteresse]}
                  min={0}
                  max={20}
                  step={0.1}
                  onValueChange={handleRateChange}
                  aria-label="Tasso di interesse annuale"
                />
                <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                  <span>0%</span>
                  <span>20%</span>
                </div>
              </div>

              <div className="w-full rounded-md border p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <Label className="text-sm font-medium">Durata</Label>
                  <Label className="text-lg font-semibold">{anni} anni</Label>
                </div>
                <Slider
                  className="w-full"
                  value={[anni]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={handleYearsChange}
                  aria-label="Durata del mutuo in anni"
                />
                <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                  <span>1 anno</span>
                  <span>50 anni</span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-2">
          <ErrorBoundary>
            <MonthlyIncomeTable onTotalChange={setMonthlyIncomeTotal} />
          </ErrorBoundary>

          <ErrorBoundary>
            <SpendingTables
              rataMensile={monthlyPayment}
              onTotalsChange={setSpendingTotals}
            />
          </ErrorBoundary>
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="flex w-full flex-col gap-2">
        <ErrorBoundary>
          <AdvancedAnalytics
            monthlyIncome={monthlyIncomeTotal}
            monthlyPayment={monthlyPayment}
            spendingTotals={spendingTotals}
          />
          <BudgetReport
            monthlyIncome={monthlyIncomeTotal}
            expenseTotals={spendingTotals}
          />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="data">
        <ErrorBoundary>
          <DataManagement />
        </ErrorBoundary>
      </TabsContent>
    </Tabs>
  );
}

export function LoanChart() {
  return (
    <ErrorBoundary>
      <LoanChartContent />
    </ErrorBoundary>
  );
}
