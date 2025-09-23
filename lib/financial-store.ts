import { create } from "zustand"
import { persist } from "zustand/middleware"

export type SpendingRow = {
  id: string
  motivo: string
  spesa: string
  isCommitted: boolean
}

export type IncomeRow = {
  id: string
  motivo: string
  entrata: string
  isCommitted: boolean
}

export type SpendingTotals = {
  annuali: number
  mensili: number
  settimanali: number
  giornaliere: number
}

export type LoanParameters = {
  principal: number
  annualRate: number
  years: number
}

export type FinancialState = {
  // Loan parameters
  loanParams: LoanParameters

  // Income data
  incomeRows: IncomeRow[]
  monthlyIncomeTotal: number

  // Spending data
  spendingRows: {
    annuali: SpendingRow[]
    mensili: SpendingRow[]
    settimanali: SpendingRow[]
    giornaliere: SpendingRow[]
  }
  spendingTotals: SpendingTotals

  // UI state
  isLoading: boolean
  lastSaved: Date | null

  // Actions
  updateLoanParams: (params: Partial<LoanParameters>) => void
  setIncomeRows: (rows: IncomeRow[]) => void
  setMonthlyIncomeTotal: (total: number) => void
  setSpendingRows: (category: keyof SpendingTotals, rows: SpendingRow[]) => void
  setSpendingTotals: (totals: SpendingTotals) => void
  exportData: () => string
  importData: (data: string) => boolean
  resetData: () => void
}

const initialState = {
  loanParams: {
    principal: 150000,
    annualRate: 2.5,
    years: 30,
  },
  incomeRows: [],
  monthlyIncomeTotal: 0,
  spendingRows: {
    annuali: [],
    mensili: [],
    settimanali: [],
    giornaliere: [],
  },
  spendingTotals: {
    annuali: 0,
    mensili: 0,
    settimanali: 0,
    giornaliere: 0,
  },
  isLoading: false,
  lastSaved: null,
}

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateLoanParams: (params) =>
        set((state) => ({
          loanParams: { ...state.loanParams, ...params },
          lastSaved: new Date(),
        })),

      setIncomeRows: (rows) =>
        set(() => ({
          incomeRows: rows,
          lastSaved: new Date(),
        })),

      setMonthlyIncomeTotal: (total) =>
        set(() => ({
          monthlyIncomeTotal: total,
          lastSaved: new Date(),
        })),

      setSpendingRows: (category, rows) =>
        set((state) => ({
          spendingRows: {
            ...state.spendingRows,
            [category]: rows,
          },
          lastSaved: new Date(),
        })),

      setSpendingTotals: (totals) =>
        set(() => ({
          spendingTotals: totals,
          lastSaved: new Date(),
        })),

      exportData: () => {
        const state = get()
        const exportData = {
          loanParams: state.loanParams,
          incomeRows: state.incomeRows,
          spendingRows: state.spendingRows,
          exportDate: new Date().toISOString(),
          version: "1.0",
        }
        return JSON.stringify(exportData, null, 2)
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data)
          if (parsed.version === "1.0") {
            set((state) => ({
              ...state,
              loanParams: parsed.loanParams || initialState.loanParams,
              incomeRows: parsed.incomeRows || [],
              spendingRows: parsed.spendingRows || initialState.spendingRows,
              lastSaved: new Date(),
            }))
            return true
          }
          return false
        } catch {
          return false
        }
      },

      resetData: () =>
        set(() => ({
          ...initialState,
          lastSaved: new Date(),
        })),
    }),
    {
      name: "financial-data",
      version: 1,
    },
  ),
)
