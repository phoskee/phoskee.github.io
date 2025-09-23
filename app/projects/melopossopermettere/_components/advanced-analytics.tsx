"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/financial-utils"
import { useFinancialStore } from "@/lib/financial-store"
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ChartTooltip } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, AlertTriangle, Target, PiggyBank, Calculator } from "lucide-react"

type AnalyticsProps = {
  monthlyIncome: number
  monthlyPayment: number
  spendingTotals: {
    annuali: number
    mensili: number
    settimanali: number
    giornaliere: number
  }
}

export function AdvancedAnalytics({ monthlyIncome, monthlyPayment, spendingTotals }: AnalyticsProps) {
  const { loanParams } = useFinancialStore()

  const analytics = useMemo(() => {
    // Calculate monthly expenses
    const monthlyExpenses =
      spendingTotals.mensili +
      (spendingTotals.settimanali * 52) / 12 +
      spendingTotals.giornaliere * 30 +
      spendingTotals.annuali / 12

    const netMonthlyIncome = monthlyIncome - monthlyExpenses
    const savingsRate = monthlyIncome > 0 ? (netMonthlyIncome / monthlyIncome) * 100 : 0
    const debtToIncomeRatio = monthlyIncome > 0 ? (monthlyPayment / monthlyIncome) * 100 : 0

    // Spending breakdown for pie chart
    const spendingBreakdown = [
      { name: "Mutuo", value: monthlyPayment, color: "#ef4444" },
      { name: "Spese Mensili", value: spendingTotals.mensili - monthlyPayment, color: "#f97316" },
      { name: "Spese Settimanali", value: (spendingTotals.settimanali * 52) / 12, color: "#eab308" },
      { name: "Spese Giornaliere", value: spendingTotals.giornaliere * 30, color: "#22c55e" },
      { name: "Spese Annuali", value: spendingTotals.annuali / 12, color: "#3b82f6" },
    ].filter((item) => item.value > 0)

    // Financial health score (0-100)
    let healthScore = 100
    if (savingsRate < 10) healthScore -= 30
    else if (savingsRate < 20) healthScore -= 15

    if (debtToIncomeRatio > 40) healthScore -= 30
    else if (debtToIncomeRatio > 30) healthScore -= 15

    if (netMonthlyIncome < 0) healthScore -= 40

    healthScore = Math.max(0, Math.min(100, healthScore))

    // Loan analysis
    const totalLoanCost = monthlyPayment * loanParams.years * 12
    const totalInterest = totalLoanCost - loanParams.principal
    const interestPercentage = (totalInterest / loanParams.principal) * 100

    // Savings projection (next 5 years)
    const savingsProjection = Array.from({ length: 60 }, (_, month) => ({
      month: month + 1,
      savings: Math.max(0, netMonthlyIncome * (month + 1)),
      year: Math.floor(month / 12) + 1,
    }))

    return {
      monthlyExpenses,
      netMonthlyIncome,
      savingsRate,
      debtToIncomeRatio,
      spendingBreakdown,
      healthScore,
      totalLoanCost,
      totalInterest,
      interestPercentage,
      savingsProjection,
    }
  }, [monthlyIncome, monthlyPayment, spendingTotals, loanParams])

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getHealthScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "Eccellente" }
    if (score >= 60) return { variant: "secondary" as const, text: "Buono" }
    if (score >= 40) return { variant: "outline" as const, text: "Discreto" }
    return { variant: "destructive" as const, text: "Critico" }
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Mensile</CardTitle>
            {analytics.netMonthlyIncome >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${analytics.netMonthlyIncome >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(analytics.netMonthlyIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.netMonthlyIncome >= 0 ? "Surplus mensile" : "Deficit mensile"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasso di Risparmio</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.savingsRate.toFixed(1)}%</div>
            <Progress value={Math.max(0, analytics.savingsRate)} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Obiettivo: 20%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapporto Debito/Reddito</CardTitle>
            <Calculator className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.debtToIncomeRatio.toFixed(1)}%</div>
            <Progress value={analytics.debtToIncomeRatio} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Limite consigliato: 30%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salute Finanziaria</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthScoreColor(analytics.healthScore)}`}>
              {analytics.healthScore}/100
            </div>
            <div className="mt-2">
              <Badge {...getHealthScoreBadge(analytics.healthScore)}>
                {getHealthScoreBadge(analytics.healthScore).text}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Spending Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuzione Spese Mensili</CardTitle>
            <CardDescription>Breakdown delle tue spese per categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.spendingBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.spendingBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">{formatCurrency(data.value)}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {analytics.spendingBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Savings Projection */}
        <Card>
          <CardHeader>
            <CardTitle>Proiezione Risparmi</CardTitle>
            <CardDescription>Accumulo risparmi nei prossimi 5 anni</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.savingsProjection.filter((_, i) => i % 6 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tickFormatter={(value) => `Anno ${value}`} />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-lg">
                            <p className="font-medium">Anno {label}</p>
                            <p className="text-sm text-muted-foreground">
                              Risparmi: {formatCurrency(payload[0].value as number)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area type="monotone" dataKey="savings" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loan Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Analisi Mutuo</CardTitle>
          <CardDescription>Dettagli completi del tuo mutuo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Costo Totale Mutuo</p>
              <p className="text-2xl font-bold">{formatCurrency(analytics.totalLoanCost)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Interessi Totali</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(analytics.totalInterest)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Percentuale Interessi</p>
              <p className="text-2xl font-bold">{analytics.interestPercentage.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Raccomandazioni Finanziarie
          </CardTitle>
          <CardDescription>Suggerimenti per migliorare la tua situazione finanziaria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.savingsRate < 10 && (
              <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <h4 className="font-medium text-yellow-800">Aumenta il Tasso di Risparmio</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Il tuo tasso di risparmio è del {analytics.savingsRate.toFixed(1)}%. Cerca di raggiungere almeno il
                  20% riducendo le spese non essenziali.
                </p>
              </div>
            )}

            {analytics.debtToIncomeRatio > 30 && (
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h4 className="font-medium text-red-800">Rapporto Debito/Reddito Elevato</h4>
                <p className="text-sm text-red-700 mt-1">
                  Il tuo rapporto debito/reddito è del {analytics.debtToIncomeRatio.toFixed(1)}%. Considera di aumentare
                  le entrate o ridurre i debiti.
                </p>
              </div>
            )}

            {analytics.netMonthlyIncome < 0 && (
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h4 className="font-medium text-red-800">Deficit Mensile</h4>
                <p className="text-sm text-red-700 mt-1">
                  Stai spendendo più di quanto guadagni. È urgente rivedere il budget e ridurre le spese.
                </p>
              </div>
            )}

            {analytics.healthScore >= 80 && (
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <h4 className="font-medium text-green-800">Ottima Gestione Finanziaria!</h4>
                <p className="text-sm text-green-700 mt-1">
                  La tua situazione finanziaria è eccellente. Continua così e considera investimenti per far crescere i
                  tuoi risparmi.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
