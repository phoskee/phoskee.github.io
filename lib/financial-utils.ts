import { z } from "zod"

// Validation schemas
export const currencySchema = z
  .string()
  .transform((val) => {
    if (!val) return 0
    const normalized = val.replace(/\./g, "").replace(",", ".")
    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) ? parsed : 0
  })
  .refine((val) => val >= 0, { message: "Il valore deve essere positivo" })

export const loanParametersSchema = z.object({
  principal: z.number().min(1000, "Importo minimo 1.000€").max(1000000, "Importo massimo 1.000.000€"),
  annualRate: z.number().min(0, "Tasso minimo 0%").max(20, "Tasso massimo 20%"),
  years: z.number().min(1, "Durata minima 1 anno").max(50, "Durata massima 50 anni"),
})

export const incomeRowSchema = z.object({
  id: z.string(),
  motivo: z.string().min(1, "Il motivo è obbligatorio"),
  entrata: z.string().min(1, "L'importo è obbligatorio"),
  isCommitted: z.boolean(),
})

export const spendingRowSchema = z.object({
  id: z.string(),
  motivo: z.string().min(1, "Il motivo è obbligatorio"),
  spesa: z.string().min(1, "L'importo è obbligatorio"),
  isCommitted: z.boolean(),
})

// Currency formatting
export const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
})

export const formatCurrency = (value: number): string => currencyFormatter.format(value)

// Input parsing with validation
export function parseCurrencyInput(value: string): number {
  try {
    return currencySchema.parse(value)
  } catch {
    return 0
  }
}

// Loan calculation with error handling
export type LoanChartPoint = {
  month: number
  quotaInteressi: number
  quotaCapitale: number
  capitaleResiduo: number
  pagamentoTotale: number
}

export type LoanScheduleResult = {
  data: LoanChartPoint[]
  totalInterest: number
  monthlyPayment: number
  isValid: boolean
  error?: string
}

export function calculateLoanSchedule(principal: number, annualRate: number, years: number): LoanScheduleResult {
  try {
    // Validate inputs
    const validation = loanParametersSchema.safeParse({ principal, annualRate, years })
    if (!validation.success) {
      return {
        data: [],
        totalInterest: 0,
        monthlyPayment: 0,
        isValid: false,
        error: validation.error.issues[0]?.message || "Parametri non validi",
      }
    }

    if (principal <= 0 || years <= 0) {
      return {
        data: [],
        totalInterest: 0,
        monthlyPayment: 0,
        isValid: false,
        error: "Importo e durata devono essere maggiori di zero",
      }
    }

    const payments = Math.max(Math.round(years * 12), 1)
    const monthlyRate = annualRate > 0 ? annualRate / 100 / 12 : 0
    const monthlyPayment =
      monthlyRate === 0 ? principal / payments : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -payments))

    let balance = principal
    const schedule: LoanChartPoint[] = []
    let totalInterest = 0

    for (let installment = 1; installment <= payments; installment += 1) {
      const interestPayment = monthlyRate === 0 ? 0 : balance * monthlyRate
      let principalPayment = monthlyPayment - interestPayment

      if (installment === payments) {
        principalPayment = balance
      }

      balance = Math.max(balance - principalPayment, 0)
      totalInterest += interestPayment

      schedule.push({
        month: installment,
        quotaInteressi: Number(interestPayment.toFixed(2)),
        quotaCapitale: Number(principalPayment.toFixed(2)),
        capitaleResiduo: Number(balance.toFixed(2)),
        pagamentoTotale: Number((interestPayment + principalPayment).toFixed(2)),
      })
    }

    return {
      data: schedule,
      totalInterest: Number(totalInterest.toFixed(2)),
      monthlyPayment: schedule[0]?.pagamentoTotale ?? 0,
      isValid: true,
    }
  } catch (error) {
    return {
      data: [],
      totalInterest: 0,
      monthlyPayment: 0,
      isValid: false,
      error: error instanceof Error ? error.message : "Errore nel calcolo",
    }
  }
}

// Export utilities
export function downloadFile(content: string, filename: string, contentType = "application/json") {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateCSVFromData(data: any[]): string {
  if (!data.length) return ""

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value
        })
        .join(","),
    ),
  ].join("\n")

  return csvContent
}
