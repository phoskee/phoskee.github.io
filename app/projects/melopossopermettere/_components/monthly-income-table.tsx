"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, parseCurrencyInput } from "@/lib/financial-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useFinancialStore } from "@/lib/financial-store"

type IncomeRow = {
  id: string
  motivo: string
  entrata: string
  isCommitted: boolean
  errors?: {
    motivo?: string
    entrata?: string
  }
}

export type MonthlyIncomeTableProps = {
  onTotalChange?: (total: number) => void
}

function validateIncomeRow(row: IncomeRow): IncomeRow {
  const errors: IncomeRow["errors"] = {}

  if (!row.motivo.trim()) {
    errors.motivo = "Il motivo è obbligatorio"
  } else if (row.motivo.length > 100) {
    errors.motivo = "Il motivo non può superare i 100 caratteri"
  }

  if (!row.entrata.trim()) {
    errors.entrata = "L'importo è obbligatorio"
  } else {
    const amount = parseCurrencyInput(row.entrata)
    if (amount <= 0) {
      errors.entrata = "L'importo deve essere maggiore di zero"
    } else if (amount > 1000000) {
      errors.entrata = "L'importo non può superare 1.000.000€"
    }
  }

  return {
    ...row,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  }
}

export function MonthlyIncomeTable({ onTotalChange }: MonthlyIncomeTableProps) {
  const idCounterRef = useRef(0)
  const [isLoading, setIsLoading] = useState(false)

  const { incomeRows, setIncomeRows } = useFinancialStore()

  const createEmptyRow = useCallback((): IncomeRow => {
    idCounterRef.current += 1
    return {
      id: `inc-${idCounterRef.current}`,
      motivo: "",
      entrata: "",
      isCommitted: false,
    }
  }, [])

  const [rows, setRows] = useState<IncomeRow[]>(() => {
    if (incomeRows.length > 0) {
      return incomeRows as IncomeRow[]
    }

    idCounterRef.current = 0
    return [createEmptyRow()]
  })

  useEffect(() => {
    setIncomeRows(rows)
  }, [rows, setIncomeRows])

  const total = useMemo(
    () =>
      rows.reduce((sum, row) => {
        if (!row.isCommitted) {
          return sum
        }
        return sum + parseCurrencyInput(row.entrata)
      }, 0),
    [rows],
  )

  useEffect(() => {
    onTotalChange?.(total)
  }, [onTotalChange, total])

  const handleChange = (
    rowId: string,
    field: keyof Omit<IncomeRow, "id" | "isCommitted" | "errors">,
    value: string,
  ) => {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== rowId) return row

        const updatedRow = {
          ...row,
          [field]: field === "entrata" ? value.replace(/[^0-9.,-]/g, "") : value,
        }

        // Validate the updated row
        return validateIncomeRow(updatedRow)
      }),
    )
  }

  const appendDraftRow = (nextRows: IncomeRow[]) =>
    nextRows.some((row) => !row.isCommitted) ? nextRows : [...nextRows, createEmptyRow()]

  const handleCommit = async (rowId: string) => {
    setIsLoading(true)
    try {
      // Simulate async validation
      await new Promise((resolve) => setTimeout(resolve, 200))

      setRows((current) => {
        const rowToCommit = current.find((row) => row.id === rowId)

        if (!rowToCommit || rowToCommit.errors) {
          return current // Don't commit if there are validation errors
        }

        return appendDraftRow(
          current.map((row) => (row.id === rowId ? { ...row, isCommitted: true, errors: undefined } : row)),
        )
      })
    } catch (error) {
      console.error("[v0] Error committing income row:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (rowId: string) => {
    setRows((current) => {
      const filtered = current.filter((row) => row.id !== rowId)
      const next = filtered.length ? filtered : [createEmptyRow()]
      return appendDraftRow(next)
    })
  }

  const totalIsPositive = total >= 0
  const hasValidationErrors = rows.some((row) => row.errors && Object.keys(row.errors).length > 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>Entrate mensili</CardTitle>
          </div>
          <span
            className={
              totalIsPositive
                ? "ml-auto rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-700"
                : "ml-auto rounded-md bg-rose-100 px-2 py-0.5 text-rose-700"
            }
          >
            {formatCurrency(total)}
          </span>
        </div>
        {hasValidationErrors && (
          <Alert variant="destructive">
            <AlertDescription>Alcuni campi contengono errori. Correggili prima di salvare.</AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm sm:text-base">Motivo</TableHead>
              <TableHead className="text-right text-sm sm:text-base">Importo</TableHead>
              <TableHead className="text-right text-sm sm:text-base">Azione</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const hasErrors = row.errors && Object.keys(row.errors).length > 0
              const disableCommit = !row.motivo.trim() || !row.entrata.trim() || hasErrors

              return (
                <TableRow key={row.id} className={hasErrors ? "bg-destructive/5" : ""}>
                  <TableCell className="align-top text-sm sm:text-base">
                    <div className="space-y-1">
                      <Input
                        disabled={row.isCommitted}
                        placeholder="Motivo"
                        value={row.motivo}
                        onChange={(event) => handleChange(row.id, "motivo", event.target.value)}
                        className={row.errors?.motivo ? "border-destructive" : ""}
                        aria-invalid={!!row.errors?.motivo}
                        aria-describedby={row.errors?.motivo ? `${row.id}-motivo-error` : undefined}
                      />
                      {row.errors?.motivo && (
                        <p id={`${row.id}-motivo-error`} className="text-xs text-destructive">
                          {row.errors.motivo}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="align-top text-right text-sm sm:text-base">
                    <div className="space-y-1">
                      <Input
                        disabled={row.isCommitted}
                        inputMode="decimal"
                        placeholder="Importo"
                        value={row.entrata}
                        onChange={(event) => handleChange(row.id, "entrata", event.target.value)}
                        className={row.errors?.entrata ? "border-destructive" : ""}
                        aria-invalid={!!row.errors?.entrata}
                        aria-describedby={row.errors?.entrata ? `${row.id}-entrata-error` : undefined}
                      />
                      {row.errors?.entrata && (
                        <p id={`${row.id}-entrata-error`} className="text-xs text-destructive">
                          {row.errors.entrata}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="align-top text-right">
                    {row.isCommitted ? (
                      <button
                        type="button"
                        className="rounded-md border px-3 py-1 text-sm text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(row.id)}
                        aria-label="Elimina riga"
                      >
                        🗑
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="rounded-md border px-3 py-1 text-sm text-primary hover:bg-primary/10 disabled:opacity-50 flex items-center gap-2"
                        onClick={() => handleCommit(row.id)}
                        disabled={disableCommit || isLoading}
                        aria-label="Salva riga"
                      >
                        {isLoading ? <LoadingSpinner size="sm" /> : "✔"}
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Totale entrate salvate:
          <span className="ml-2 font-medium text-foreground">{formatCurrency(total)}</span>
        </div>
        <p className="text-xs text-muted-foreground">Compila la riga e premi "Salva" per registrarne una nuova.</p>
      </CardFooter>
    </Card>
  )
}
