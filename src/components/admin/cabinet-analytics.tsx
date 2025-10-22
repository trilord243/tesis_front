"use client";

import { useEffect, useState } from "react";
import { UsageAnalyticsService } from "@/lib/api/usage-analytics";
import type { CabinetStatus } from "@/types/usage-analytics";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Archive,
  Package,
  TrendingUp,
  Users,
  Wrench,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export function CabinetAnalytics() {
  const [cabinetStatus, setCabinetStatus] = useState<CabinetStatus | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCabinetStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const status = await UsageAnalyticsService.getCabinetStatus();
      setCabinetStatus(status);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar estado del gabinete"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchCabinetStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Cargando estado del gabinete...</span>
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
          onClick={() => void fetchCabinetStatus()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (!cabinetStatus) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">No hay datos disponibles</p>
      </div>
    );
  }

  const occupancyPercentage = cabinetStatus.cabinetOccupancyRate * 100;

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Estado del Gabinete</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchCabinetStatus()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Productos</p>
              <p className="text-3xl font-bold">
                {cabinetStatus.totalProducts}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <Archive className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En Gabinete</p>
              <p className="text-3xl font-bold">
                {cabinetStatus.productsInCabinet}
              </p>
              <p className="text-xs text-muted-foreground">
                {occupancyPercentage.toFixed(1)}% ocupación
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fuera</p>
              <p className="text-3xl font-bold">
                {cabinetStatus.productsOutside}
              </p>
              <p className="text-xs text-muted-foreground">
                {((cabinetStatus.productsOutside / cabinetStatus.totalProducts) * 100).toFixed(1)}% prestado
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En Uso</p>
              <p className="text-3xl font-bold">
                {cabinetStatus.productsInUse}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-3">
              <Wrench className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mantenimiento</p>
              <p className="text-3xl font-bold">
                {cabinetStatus.productsMaintenance}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disponibles</p>
              <p className="text-3xl font-bold">
                {cabinetStatus.productsAvailable}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Occupancy Rate Progress Bar */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Tasa de Ocupación</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Productos en Gabinete</span>
            <span className="font-semibold">
              {cabinetStatus.productsInCabinet} / {cabinetStatus.totalProducts}
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-green-600 transition-all"
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {occupancyPercentage.toFixed(1)}% del inventario en gabinete
          </p>
        </div>
      </Card>

      {/* Products in Cabinet */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Productos en Gabinete ({cabinetStatus.productsInCabinet})
        </h3>
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {cabinetStatus.productsInCabinetList.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay productos en el gabinete
            </p>
          ) : (
            cabinetStatus.productsInCabinetList.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{product.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    S/N: {product.serialNumber} • Código:{" "}
                    {product.codigoActivo}
                  </p>
                  {product.hexValue && (
                    <p className="text-xs text-muted-foreground">
                      RFID: {product.hexValue}
                    </p>
                  )}
                </div>
                <Badge
                  variant={
                    product.estadoUbicacion === "available"
                      ? "default"
                      : "secondary"
                  }
                >
                  {product.estadoUbicacion === "available"
                    ? "Disponible"
                    : product.estadoUbicacion}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Products Outside Cabinet */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Productos Fuera del Gabinete ({cabinetStatus.productsOutside})
        </h3>
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {cabinetStatus.productsOutsideList.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Todos los productos están en el gabinete
            </p>
          ) : (
            cabinetStatus.productsOutsideList.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium">{product.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    S/N: {product.serialNumber} • Código:{" "}
                    {product.codigoActivo}
                  </p>
                  {product.currentUser && (
                    <div className="mt-1 flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {product.currentUser.email}
                        {product.currentUser.name &&
                          ` (${product.currentUser.name})`}
                      </p>
                    </div>
                  )}
                </div>
                <Badge
                  variant={
                    product.estadoUbicacion === "in_use" ? "default" : "outline"
                  }
                >
                  {product.estadoUbicacion === "in_use"
                    ? "En Uso"
                    : product.estadoUbicacion === "maintenance"
                      ? "Mantenimiento"
                      : product.estadoUbicacion}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
