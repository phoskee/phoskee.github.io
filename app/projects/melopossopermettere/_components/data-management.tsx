"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useFinancialStore } from "@/lib/financial-store"
import { downloadFile, generateCSVFromData } from "@/lib/financial-utils"
import { Download, Upload, FileText, Database, Trash2 } from "lucide-react"

export function DataManagement() {
  const { exportData, importData, resetData, lastSaved, incomeRows, spendingRows, loanParams } = useFinancialStore()
  const [importText, setImportText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleExportJSON = () => {
    try {
      const data = exportData()
      const filename = `budget-data-${new Date().toISOString().split("T")[0]}.json`
      downloadFile(data, filename, "application/json")
      setMessage({ type: "success", text: "Dati esportati con successo!" })
    } catch (error) {
      console.error("[v0] Export error:", error)
      setMessage({ type: "error", text: "Errore durante l'esportazione" })
    }
  }

  const handleExportCSV = () => {
    try {
      // Combine all data for CSV export
      const allIncomeData = incomeRows
        .filter((row) => row.isCommitted)
        .map((row) => ({
          tipo: "Entrata",
          categoria: "Mensile",
          motivo: row.motivo,
          importo: row.entrata,
        }))

      const allSpendingData = Object.entries(spendingRows).flatMap(([category, rows]) =>
        rows
          .filter((row) => row.isCommitted)
          .map((row) => ({
            tipo: "Spesa",
            categoria: category.charAt(0).toUpperCase() + category.slice(1),
            motivo: row.motivo,
            importo: row.spesa,
          })),
      )

      const loanData = [
        {
          tipo: "Mutuo",
          categoria: "Parametri",
          motivo: "Importo richiesto",
          importo: loanParams.principal.toString(),
        },
        {
          tipo: "Mutuo",
          categoria: "Parametri",
          motivo: "Tasso interesse (%)",
          importo: loanParams.annualRate.toString(),
        },
        {
          tipo: "Mutuo",
          categoria: "Parametri",
          motivo: "Durata (anni)",
          importo: loanParams.years.toString(),
        },
      ]

      const csvData = [...allIncomeData, ...allSpendingData, ...loanData]
      const csvContent = generateCSVFromData(csvData)
      const filename = `budget-data-${new Date().toISOString().split("T")[0]}.csv`
      downloadFile(csvContent, filename, "text/csv")
      setMessage({ type: "success", text: "Dati CSV esportati con successo!" })
    } catch (error) {
      console.error("[v0] CSV export error:", error)
      setMessage({ type: "error", text: "Errore durante l'esportazione CSV" })
    }
  }

  const handleImport = async () => {
    if (!importText.trim()) {
      setMessage({ type: "error", text: "Inserisci i dati da importare" })
      return
    }

    setIsLoading(true)
    try {
      const success = importData(importText)
      if (success) {
        setMessage({ type: "success", text: "Dati importati con successo!" })
        setImportText("")
      } else {
        setMessage({ type: "error", text: "Formato dati non valido" })
      }
    } catch (error) {
      console.error("[v0] Import error:", error)
      setMessage({ type: "error", text: "Errore durante l'importazione" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (window.confirm("Sei sicuro di voler cancellare tutti i dati? Questa azione non può essere annullata.")) {
      resetData()
      setMessage({ type: "success", text: "Dati cancellati con successo" })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportText(content)
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Esporta Dati
          </CardTitle>
          <CardDescription>Scarica i tuoi dati finanziari in diversi formati</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExportJSON} variant="outline" className="flex items-center gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              Esporta JSON
            </Button>
            <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Database className="h-4 w-4" />
              Esporta CSV
            </Button>
          </div>
          {lastSaved && (
            <p className="text-sm text-muted-foreground">Ultimo salvataggio: {lastSaved.toLocaleString("it-IT")}</p>
          )}
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importa Dati
          </CardTitle>
          <CardDescription>Carica dati precedentemente esportati</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Carica file</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".json,.txt"
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="import-text">Oppure incolla i dati JSON</Label>
            <Textarea
              id="import-text"
              placeholder="Incolla qui i dati JSON esportati..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <Button onClick={handleImport} disabled={!importText.trim() || isLoading} className="flex items-center gap-2">
            {isLoading ? <LoadingSpinner size="sm" /> : <Upload className="h-4 w-4" />}
            Importa Dati
          </Button>
        </CardContent>
      </Card>

      {/* Reset Section */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Cancella Tutti i Dati
          </CardTitle>
          <CardDescription>Rimuovi tutti i dati salvati e ricomincia da capo</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleReset} variant="destructive" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Cancella Tutto
          </Button>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
