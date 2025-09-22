"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

type SpendingRow = {
  id: string;
  motivo: string;
  spesa: string;
  isCommitted: boolean;
};

type TableKey = "annuali" | "mensili" | "settimanali" | "giornaliere";

const TABLE_META: Array<{ key: TableKey; title: string }> = [
  { key: "annuali", title: "Spese annuali" },
  { key: "mensili", title: "Spese mensili" },
  { key: "settimanali", title: "Spese settimanali" },
  { key: "giornaliere", title: "Spese giornaliere" },
];

export type SpendingTotals = {
  annuali: number;
  mensili: number;
  settimanali: number;
  giornaliere: number;
};

export type SpendingTablesProps = {
  rataMensile: number;
  onTotalsChange?: (totals: SpendingTotals) => void;
};

function parseCurrencyInput(value: string): number {
  if (!value) {
    return 0;
  }

  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function SpendingTables({
  rataMensile,
  onTotalsChange,
}: SpendingTablesProps) {
  const idCounterRef = useRef(0);

  const createEmptyRow = useCallback((): SpendingRow => {
    idCounterRef.current += 1;
    return {
      id: `sp-${idCounterRef.current}`,
      motivo: "",
      spesa: "",
      isCommitted: false,
    };
  }, []);

  const [rowsByKey, setRowsByKey] = useState<Record<TableKey, SpendingRow[]>>(
    () => {
      idCounterRef.current = 0;
      return {
        annuali: [createEmptyRow()],
        mensili: [createEmptyRow()],
        settimanali: [createEmptyRow()],
        giornaliere: [createEmptyRow()],
      };
    }
  );

  const formattedRata = useMemo(
    () => formatCurrency(rataMensile || 0),
    [rataMensile]
  );

  const totals = useMemo<SpendingTotals>(() => {
    const sumCommitted = (rows: SpendingRow[] | undefined) =>
      (rows ?? []).reduce((sum, row) => {
        if (!row.isCommitted) {
          return sum;
        }
        return sum + parseCurrencyInput(row.spesa);
      }, 0);

    return {
      annuali: sumCommitted(rowsByKey.annuali),
      mensili: rataMensile + sumCommitted(rowsByKey.mensili),
      settimanali: sumCommitted(rowsByKey.settimanali),
      giornaliere: sumCommitted(rowsByKey.giornaliere),
    };
  }, [rataMensile, rowsByKey]);

  useEffect(() => {
    onTotalsChange?.(totals);
  }, [onTotalsChange, totals]);

  const handleChange = (
    tableKey: TableKey,
    rowId: string,
    field: keyof Omit<SpendingRow, "id" | "isCommitted">,
    value: string
  ) => {
    setRowsByKey((current) => {
      const rows = current[tableKey] ?? [];

      return {
        ...current,
        [tableKey]: rows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                [field]:
                  field === "spesa" ? value.replace(/[^0-9.,-]/g, "") : value,
              }
            : row
        ),
      };
    });
  };

  const appendDraftRow = (tableKey: TableKey, rows: SpendingRow[]) => {
    const hasDraft = rows.some((row) => !row.isCommitted);
    return hasDraft ? rows : [...rows, createEmptyRow()];
  };

  const handleCommitRow = (tableKey: TableKey, rowId: string) => {
    setRowsByKey((current) => {
      const rows = current[tableKey] ?? [];
      const updated = rows.map((row) =>
        row.id === rowId ? { ...row, isCommitted: true } : row
      );

      return {
        ...current,
        [tableKey]: appendDraftRow(tableKey, updated),
      };
    });
  };

  const handleDeleteRow = (tableKey: TableKey, rowId: string) => {
    setRowsByKey((current) => {
      const rows = current[tableKey] ?? [];
      const filtered = rows.filter((row) => row.id !== rowId);
      const nextRows = filtered.length ? filtered : [createEmptyRow()];

      return {
        ...current,
        [tableKey]: appendDraftRow(tableKey, nextRows),
      };
    });
  };

  const renderRow = (tableKey: TableKey, row: SpendingRow) => {
    const isActionDisabled = !row.motivo.trim() || !row.spesa.trim();

    return (
      <TableRow key={row.id}>
        <TableCell className="align-top text-sm sm:text-base">
          <Input
            disabled={row.isCommitted}
            placeholder="Motivo"
            value={row.motivo}
            onChange={(event) =>
              handleChange(tableKey, row.id, "motivo", event.target.value)
            }
          />
        </TableCell>
        <TableCell className="align-top text-right text-sm sm:text-base">
          <Input
            disabled={row.isCommitted}
            inputMode="decimal"
            placeholder="Spesa"
            value={row.spesa}
            onChange={(event) =>
              handleChange(tableKey, row.id, "spesa", event.target.value)
            }
          />
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
              className="rounded-md border px-3 py-1 text-sm text-primary hover:bg-primary/10 disabled:opacity-50"
              onClick={() => handleCommitRow(tableKey, row.id)}
              disabled={isActionDisabled}
              aria-label="Salva riga"
            >
              ✔
            </button>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {TABLE_META.map(({ key, title }) => {
        const rows = rowsByKey[key] ?? [];
        const isMonthly = key === "mensili";

        const rawTotal =
          key === "mensili"
            ? totals.mensili
            : key === "annuali"
            ? totals.annuali
            : key === "settimanali"
            ? totals.settimanali
            : totals.giornaliere;

        const displayTotal = rawTotal > 0 ? -rawTotal : rawTotal;
        const badgeClass =
          displayTotal < 0
            ? "ml-auto rounded-md bg-rose-100 px-2 py-0.5 text-rose-700"
            : "ml-auto rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-700";

        return (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              {isMonthly ? (
                <p className="text-sm text-muted-foreground">
                  La prima riga mostra la rata del mutuo e non è modificabile.
                </p>
              ) : null}
              <CardAction className={badgeClass}>
                {formatCurrency(displayTotal)}
              </CardAction>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm sm:text-base">
                      Motivo
                    </TableHead>
                    <TableHead className="text-right text-sm sm:text-base">
                      Spesa
                    </TableHead>
                    <TableHead className="text-right text-sm sm:text-base">
                      Azione
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isMonthly ? (
                    <TableRow>
                      <TableCell className="text-sm sm:text-base">
                        Rata mutuo
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm sm:text-base">
                        {formattedRata}
                      </TableCell>
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
        );
      })}
    </div>
  );
}
