"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Card,
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

type IncomeRow = {
  id: string;
  motivo: string;
  entrata: string;
  isCommitted: boolean;
};

export type MonthlyIncomeTableProps = {
  onTotalChange?: (total: number) => void;
};

function parseCurrencyInput(value: string): number {
  if (!value) {
    return 0;
  }

  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function MonthlyIncomeTable({ onTotalChange }: MonthlyIncomeTableProps) {
  const idCounterRef = useRef(0);

  const createEmptyRow = useCallback((): IncomeRow => {
    idCounterRef.current += 1;
    return {
      id: `inc-${idCounterRef.current}`,
      motivo: "",
      entrata: "",
      isCommitted: false,
    };
  }, []);

  const [rows, setRows] = useState<IncomeRow[]>(() => {
    idCounterRef.current = 0;
    return [createEmptyRow()];
  });

  const total = useMemo(
    () =>
      rows.reduce((sum, row) => {
        if (!row.isCommitted) {
          return sum;
        }
        return sum + parseCurrencyInput(row.entrata);
      }, 0),
    [rows]
  );

  useEffect(() => {
    onTotalChange?.(total);
  }, [onTotalChange, total]);

  const handleChange = (
    rowId: string,
    field: keyof Omit<IncomeRow, "id" | "isCommitted">,
    value: string
  ) => {
    setRows((current) =>
      current.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]:
                field === "entrata" ? value.replace(/[^0-9.,-]/g, "") : value,
            }
          : row
      )
    );
  };

  const appendDraftRow = (nextRows: IncomeRow[]) =>
    nextRows.some((row) => !row.isCommitted)
      ? nextRows
      : [...nextRows, createEmptyRow()];

  const handleCommit = (rowId: string) => {
    setRows((current) =>
      appendDraftRow(
        current.map((row) =>
          row.id === rowId ? { ...row, isCommitted: true } : row
        )
      )
    );
  };

  const handleDelete = (rowId: string) => {
    setRows((current) => {
      const filtered = current.filter((row) => row.id !== rowId);
      const next = filtered.length ? filtered : [createEmptyRow()];
      return appendDraftRow(next);
    });
  };

  const totalIsPositive = total >= 0;

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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm sm:text-base">Motivo</TableHead>
              <TableHead className="text-right text-sm sm:text-base">
                Importo
              </TableHead>
              <TableHead className="text-right text-sm sm:text-base">
                Azione
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const disableCommit = !row.motivo.trim() || !row.entrata.trim();

              return (
                <TableRow key={row.id}>
                  <TableCell className="align-top text-sm sm:text-base">
                    <Input
                      disabled={row.isCommitted}
                      placeholder="Motivo"
                      value={row.motivo}
                      onChange={(event) =>
                        handleChange(row.id, "motivo", event.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell className="align-top text-right text-sm sm:text-base">
                    <Input
                      disabled={row.isCommitted}
                      inputMode="decimal"
                      placeholder="Importo"
                      value={row.entrata}
                      onChange={(event) =>
                        handleChange(row.id, "entrata", event.target.value)
                      }
                    />
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
                        className="rounded-md border px-3 py-1 text-sm text-primary hover:bg-primary/10 disabled:opacity-50"
                        onClick={() => handleCommit(row.id)}
                        disabled={disableCommit}
                        aria-label="Salva riga"
                      >
                        ✔
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Totale entrate salvate:
          <span className="ml-2 font-medium text-foreground">
            {formatCurrency(total)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Compila la riga e premi "Salva" per registrarne una nuova.
        </p>
      </CardFooter>
    </Card>
  );
}
