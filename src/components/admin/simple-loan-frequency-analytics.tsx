"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface LensRequest {
  _id: string;
  estado: "aprobado" | "rechazado" | "pendiente";
  createdAt: string;
  userId?: {
    name: string;
    email: string;
  };
  products?: Array<{ _id: string; nombre: string }>;
}

export function SimpleLoanFrequencyAnalytics() {
  const [requests, setRequests] = useState<LensRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Llamar al proxy API de Next.js que maneja la autenticación
      const response = await fetch("/api/admin/lens-requests", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Error al cargar solicitudes: ${response.status}`
        );
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching loan analytics:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar analytics"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Cargando analytics de préstamos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-800">Error: {error}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => void fetchData()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  // Calcular estadísticas
  const totalRequests = requests.length;
  const approved = requests.filter((r) => r.estado === "aprobado").length;
  const rejected = requests.filter((r) => r.estado === "rechazado").length;
  const pending = requests.filter((r) => r.estado === "pendiente").length;

  const approvalRate =
    totalRequests > 0 ? ((approved / totalRequests) * 100).toFixed(1) : "0";
  const rejectionRate =
    totalRequests > 0 ? ((rejected / totalRequests) * 100).toFixed(1) : "0";

  // Productos más solicitados
  const productCounts: Record<string, { name: string; count: number }> = {};
  requests.forEach((req) => {
    req.products?.forEach((product) => {
      if (!productCounts[product._id]) {
        productCounts[product._id] = { name: product.nombre, count: 0 };
      }
      productCounts[product._id].count++;
    });
  });

  const topProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics de Solicitudes</h2>
        <Button variant="outline" size="sm" onClick={() => void fetchData()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Solicitudes
              </p>
              <p className="text-2xl font-bold">{totalRequests}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aprobadas</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{approved}</p>
                <span className="text-sm text-green-600">{approvalRate}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rechazadas</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{rejected}</p>
                <span className="text-sm text-red-600">{rejectionRate}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-3">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold">{pending}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Productos más solicitados */}
      {topProducts.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Productos Más Solicitados
          </h3>
          <div className="space-y-3">
            {topProducts.map(([id, { name, count }], index) => (
              <div
                key={id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="h-6 w-6 justify-center">
                    {index + 1}
                  </Badge>
                  <span className="font-medium">{name}</span>
                </div>
                <Badge>{count} solicitudes</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Estado de solicitudes recientes */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Solicitudes Recientes</h3>
        <div className="space-y-2">
          {requests.slice(0, 5).map((req) => (
            <div
              key={req._id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <p className="font-medium">
                    {req.userId?.name || "Usuario"}
                  </p>
                  <p className="text-muted-foreground">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  req.estado === "aprobado"
                    ? "default"
                    : req.estado === "rechazado"
                      ? "destructive"
                      : "secondary"
                }
              >
                {req.estado}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
