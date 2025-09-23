"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, parseCurrencyInput } from "@/lib/financial-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useFinancialStore } from "@/lib/financial-store"

type SpendingRow = {
  id: string
  motivo: string
  spesa: string
  isCommitted: boolean
  errors?: {
    motivo?: string
    spesa?: string
  }
}

type TableKey = "annuali" | "mensili" | "settimanali" | "giornaliere"

const TABLE_META: Array<{ key: TableKey; title: string }> = [
  { key: "annuali", title: "Spese annuali" },
  { key: "mensili", title: "Spese mensili" },
  { key: "settimanali", title: "Spese settimanali" },
  { key: "giornaliere", title: "Spese giornaliere" },
]

export type SpendingTotals = {
  annuali: number
  mensili: number
  settimanali: number
  giornaliere: number
}

export type SpendingTablesProps = {
  rataMensile: number
  onTotalsChange?: (totals: SpendingTotals) => void
}

function validateSpendingRow(row: SpendingRow): SpendingRow {
  const errors: SpendingRow["errors"] = {}

  if (!row.motivo.trim()) {
    errors.motivo = "Il motivo è obbligatorio"
  } else if (row.motivo.length > 100) {
    errors.motivo = "Il motivo non può superare i 100 caratteri"
  }

  if (!row.spesa.trim()) {
    errors.spesa = "L'importo è obbligatorio"
  } else {
    const amount = parseCurrencyInput(row.spesa)
    if (amount <= 0) {
      errors.spesa = "L'importo deve essere maggiore di zero"
    } else if (amount > 1000000) {
      errors.spesa = "L'importo non può superare 1.000.000€"
    }
  }

  return {
    ...row,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  }
}

export function SpendingTables({ rataMensile, onTotalsChange }: SpendingTablesProps) {
  const idCounterRef = useRef(0)
  const [isLoading, setIsLoading] = useState(false)

  const { spendingRows, setSpendingRows } = useFinancialStore()

  const createEmptyRow = useCallback((): SpendingRow => {
    idCounterRef.current += 1
    return {
      id: `sp-${idCounterRef.current}`,
      motivo: "",
      spesa: "",
      isCommitted: false,
    }
  }, [])

  const [rowsByKey, setRowsByKey] = useState<Record<TableKey, SpendingRow[]>>(() => {
    const hasData = Object.values(spendingRows).some((rows) => rows.length > 0)
    if (hasData) {
      return spendingRows as Record<TableKey, SpendingRow[]>
    }

    idCounterRef.current = 0
    return {
      annuali: [createEmptyRow()],
      mensili: [createEmptyRow()],
      settimanali: [createEmptyRow()],
      giornaliere: [createEmptyRow()],
    }
  })

  useEffect(() => {
    Object.entries(rowsByKey).forEach(([key, rows]) => {
      setSpendingRows(key as TableKey, rows)
    })
  }, [rowsByKey, setSpendingRows])

  const formattedRata = useMemo(() => formatCurrency(rataMensile || 0), [rataMensile])

  const totals = useMemo<SpendingTotals>(() => {
    const sumCommitted = (rows: SpendingRow[] | undefined) =>
      (rows ?? []).reduce((sum, row) => {
        if (!row.isCommitted) {
          return sum
        }
        return sum + parseCurrencyInput(row.spesa)
      }, 0)

    return {
      annuali: sumCommitted(rowsByKey.annuali),
      mensili: rataMensile + sumCommitted(rowsByKey.mensili),
      settimanali: sumCommitted(rowsByKey.settimanali),
      giornaliere: sumCommitted(rowsByKey.giornaliere),
    }
  }, [rataMensile, rowsByKey])

  useEffect(() => {
    onTotalsChange?.(totals)
  }, [onTotalsChange, totals])

  const handleChange = (
    tableKey: TableKey,
    rowId: string,
    field: keyof Omit<SpendingRow, "id" | "isCommitted" | "errors">,
    value: string,
  ) => {
    setRowsByKey((current) => {
      const rows = current[tableKey] ?? []

      return {
        ...current,
        [tableKey]: rows.map((row) => {
          if (row.id !== rowId) return row

          const updatedRow = {
            ...row,
            [field]: field === "spesa" ? value.replace(/[^0-9.,-]/g, "") : value,
          }

          // Validate the updated row
          return validateSpendingRow(updatedRow)
        }),
      }
    })
  }

  const appendDraftRow = (tableKey: TableKey, rows: SpendingRow[]) => {
    const hasDraft = rows.some((row) => !row.isCommitted)
    return hasDraft ? rows : [...rows, createEmptyRow()]
  }

  const handleCommitRow = async (tableKey: TableKey, rowId: string) => {
    setIsLoading(true)
    try {
      // Simulate async validation
      await new Promise((resolve) => setTimeout(resolve, 200))

      setRowsByKey((current) => {
        const rows = current[tableKey] ?? []
        const rowToCommit = rows.find((row) => row.id === rowId)

        if (!rowToCommit || rowToCommit.errors) {
          return current // Don't commit if there are validation errors
        }

        const updated = rows.map((row) => (row.id === rowId ? { ...row, isCommitted: true, errors: undefined } : row))

        return {
          ...current,
          [tableKey]: appendDraftRow(tableKey, updated),
        }
      })
    } catch (error) {
      console.error("[v0] Error committing row:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRow = (tableKey: TableKey, rowId: string) => {
    setRowsByKey((current) => {
      const rows = current[tableKey] ?? []
      const filtered = rows.filter((row) => row.id !== rowId)
      const nextRows = filtered.length ? filtered : [createEmptyRow()]

      return {
        ...current,
        [tableKey]: appendDraftRow(tableKey, nextRows),
      }
    })
  }

  const renderRow = (tableKey: TableKey, row: SpendingRow) => {
    const hasErrors = row.errors && Object.keys(row.errors).length > 0
    const isActionDisabled = !row.motivo.trim() || !row.spesa.trim() || hasErrors

    return (
      <TableRow key={row.id} className={hasErrors ? "bg-destructive/5" : ""}>
        <TableCell className="align-top text-sm sm:text-base">
          <div className="space-y-1">
            <Input
              disabled={row.isCommitted}
              placeholder="Motivo"
              value={row.motivo}
              onChange={(event) => handleChange(tableKey, row.id, "motivo", event.target.value)}
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
              placeholder="Spesa"
              value={row.spesa}
              onChange={(event) => handleChange(tableKey, row.id, "spesa", event.target.value)}
              className={row.errors?.spesa ? "border-destructive" : ""}
              aria-invalid={!!row.errors?.spesa}
              aria-describedby={row.errors?.spesa ? `${row.id}-spesa-error` : undefined}
            />
            {row.errors?.spesa && (
              <p id={`${row.id}-spesa-error`} className="text-xs text-destructive">
                {row.errors.spesa}
              </p>
            )}
          </div>
        </TableCell>
        <TableCell className="align-top text-right">
          {row.isCommitted ? (
            <button
              type="button"
              className="rounded-md border px-3 py-1 text-sm text-destructive hover:bg-destructive/10"
              onClick={() => handleDeleteRow(tableKey, row.id)}
              aria-label="Elimina riga"
            >
              🗑
            </button>
          ) : (
            <button
              type="button"
              className="rounded-md border px-3 py-1 text-sm text-primary hover:bg-primary/10 disabled:opacity-50 flex items-center gap-2"
              onClick={() => handleCommitRow(tableKey, row.id)}
              disabled={isActionDisabled || isLoading}
              aria-label="Salva riga"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "✔"}
            </button>
          )}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {TABLE_META.map(({ key, title }) => {
        const rows = rowsByKey[key] ?? []
        const isMonthly = key === "mensili"

        const rawTotal =
          key === "mensili"
            ? totals.mensili
            : key === "annuali"
              ? totals.annuali
              : key === "settimanali"
                ? totals.settimanali
                : totals.giornaliere

        const displayTotal = rawTotal > 0 ? -rawTotal : rawTotal
        const badgeClass =
          displayTotal < 0
            ? "ml-auto rounded-md bg-rose-100 px-2 py-0.5 text-rose-700"
            : "ml-auto rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-700"

        const hasValidationErrors = rows.some((row) => row.errors && Object.keys(row.errors).length > 0)

        return (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              {isMonthly ? (
                <p className="text-sm text-muted-foreground">
                  La prima riga mostra la rata del mutuo e non è modificabile.
                </p>
              ) : null}
              {hasValidationErrors && (
                <Alert variant="destructive">
                  <AlertDescription>Alcuni campi contengono errori. Correggili prima di salvare.</AlertDescription>
                </Alert>
              )}
              <CardAction className={badgeClass}>{formatCurrency(displayTotal)}</CardAction>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm sm:text-base">Motivo</TableHead>
                    <TableHead className="text-right text-sm sm:text-base">Spesa</TableHead>
                    <TableHead className="text-right text-sm sm:text-base">Azione</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isMonthly ? (
                    <TableRow>
                      <TableCell className="text-sm sm:text-base">Rata mutuo</TableCell>
                      <TableCell className="text-right font-mono text-sm sm:text-base">{formattedRata}</TableCell>
                      <TableCell />
                    </TableRow>
                  ) : null}
                  {rows.map((row) => renderRow(key, row))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-end text-xs text-muted-foreground">
              Compila la riga e premi "Salva" per aggiungerne una nuova.
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
