"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CabinetAnalytics } from "./cabinet-analytics";
import { SimpleLoanFrequencyAnalytics } from "./simple-loan-frequency-analytics";
import type { AnalyticsFilters } from "@/types/usage-analytics";
import {
  BarChart3,
  Archive,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function SystemAnalyticsDashboard() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
      endDate: new Date().toISOString(),
    },
  });

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    // TODO: Implement export functionality
    console.log(`Exporting analytics as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics del Sistema</h1>
          <p className="text-muted-foreground">
            Análisis completo de uso y gestión de equipos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleExport("csv")}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleExport("excel")}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Tabs for Different Analytics Views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Vista General</span>
            <span className="sm:hidden">General</span>
          </TabsTrigger>
          <TabsTrigger value="cabinet" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            <span className="hidden sm:inline">Gabinete</span>
            <span className="sm:hidden">Gabinete</span>
          </TabsTrigger>
          <TabsTrigger value="loans" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Préstamos</span>
            <span className="sm:hidden">Préstamos</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick Stats Card */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">
                Resumen Rápido
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Período de análisis
                  </span>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Últimos 30 días</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Usa las pestañas arriba para explorar diferentes vistas de
                  analytics:
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Archive className="h-4 w-4 text-blue-600" />
                    <span>
                      <strong>Gabinete:</strong> Estado del inventario y
                      ocupación
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span>
                      <strong>Préstamos:</strong> Frecuencia y patrones de uso
                    </span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Quick Access Card */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">
                Acciones Rápidas
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="mr-2 h-4 w-4" />
                  Ver Estado del Gabinete
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analizar Préstamos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Generar Reporte Completo
                </Button>
              </div>
            </Card>
          </div>

          {/* Combined Quick View */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">
                Vista Rápida: Gabinete
              </h3>
              <CabinetAnalytics />
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">
                Vista Rápida: Préstamos
              </h3>
              <SimpleLoanFrequencyAnalytics />
            </Card>
          </div>
        </TabsContent>

        {/* Cabinet Tab */}
        <TabsContent value="cabinet">
          <CabinetAnalytics />
        </TabsContent>

        {/* Loans Tab */}
        <TabsContent value="loans">
          <SimpleLoanFrequencyAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
