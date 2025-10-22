"use client";

import { useEffect, useState } from "react";
import { UsageAnalyticsService } from "@/lib/api/usage-analytics";
import type {
  LoanFrequencyAnalytics,
  UsagePatterns,
  AnalyticsFilters,
} from "@/types/usage-analytics";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Users,
  Package,
  RefreshCw,
  AlertCircle,
  BarChart3,
} from "lucide-react";

interface LoanFrequencyAnalyticsProps {
  filters?: AnalyticsFilters;
}

export function LoanFrequencyAnalyticsComponent({
  filters,
}: LoanFrequencyAnalyticsProps) {
  const [loanData, setLoanData] = useState<LoanFrequencyAnalytics | null>(
    null
  );
  const [usagePatterns, setUsagePatterns] = useState<UsagePatterns | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [loans, patterns] = await Promise.all([
        UsageAnalyticsService.getLoanFrequencyAnalytics(filters),
        UsageAnalyticsService.getUsagePatterns(filters),
      ]);
      setLoanData(loans);
      setUsagePatterns(patterns);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar analytics de préstamos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, [filters]);

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

  if (!loanData || !usagePatterns) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          No hay datos de préstamos disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics de Préstamos</h2>
        <Button variant="outline" size="sm" onClick={() => void fetchData()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Loan Request Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Solicitudes
              </p>
              <p className="text-3xl font-bold">
                {loanData.totalLoanRequests}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aprobadas</p>
              <p className="text-3xl font-bold">{loanData.approvedRequests}</p>
              <p className="text-xs text-muted-foreground">
                {loanData.approvalRate.toFixed(1)}% tasa de aprobación
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rechazadas</p>
              <p className="text-3xl font-bold">{loanData.rejectedRequests}</p>
              <p className="text-xs text-muted-foreground">
                {loanData.rejectionRate.toFixed(1)}% tasa de rechazo
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-3xl font-bold">{loanData.pendingRequests}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Usage Patterns Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Checkouts</p>
              <p className="text-3xl font-bold">{usagePatterns.totalCheckouts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-3">
              <TrendingDown className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Retornos</p>
              <p className="text-3xl font-bold">{usagePatterns.totalReturns}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-3">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Préstamos Activos</p>
              <p className="text-3xl font-bold">{usagePatterns.activeLoans}</p>
              <p className="text-xs text-muted-foreground">
                {usagePatterns.averageLoanDuration.toFixed(1)}h promedio
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Most Requested Products */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Productos Más Solicitados
        </h3>
        <div className="space-y-3">
          {loanData.mostRequestedProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay datos de solicitudes
            </p>
          ) : (
            loanData.mostRequestedProducts.slice(0, 10).map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.count} solicitudes
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{product.count}</Badge>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Most Used Products */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Productos Más Usados</h3>
        <div className="space-y-3">
          {usagePatterns.mostUsedProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay datos de uso
            </p>
          ) : (
            usagePatterns.mostUsedProducts.slice(0, 10).map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.totalCheckouts} checkouts • {product.totalHours.toFixed(1)}h de uso
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="default">{product.totalCheckouts}</Badge>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {product.totalHours.toFixed(1)}h
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Most Active Users */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Usuarios Más Activos</h3>
        <div className="space-y-3">
          {usagePatterns.mostActiveUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay datos de usuarios
            </p>
          ) : (
            usagePatterns.mostActiveUsers.slice(0, 10).map((user, index) => (
              <div
                key={user.userId}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.userName || user.userEmail}
                    </p>
                    {user.userName && (
                      <p className="text-sm text-muted-foreground">
                        {user.userEmail}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant="secondary">
                  Score: {user.activityScore}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Least Used Products */}
      {usagePatterns.leastUsedProducts.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Productos Menos Utilizados
          </h3>
          <div className="space-y-3">
            {usagePatterns.leastUsedProducts.slice(0, 10).map((product) => (
              <div
                key={product.productId}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    {product.lastUsed && (
                      <p className="text-sm text-muted-foreground">
                        Último uso: {new Date(product.lastUsed).toLocaleDateString("es-ES")}
                        {product.daysSinceLastUse !== undefined &&
                          ` (hace ${product.daysSinceLastUse} días)`}
                      </p>
                    )}
                    {!product.lastUsed && (
                      <p className="text-sm text-muted-foreground">
                        Nunca usado
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant="outline">
                  {product.daysSinceLastUse !== undefined
                    ? `${product.daysSinceLastUse}d`
                    : "Sin uso"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Requests by User */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Solicitudes por Usuario
        </h3>
        <div className="space-y-3">
          {loanData.requestsByUser.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay datos de solicitudes por usuario
            </p>
          ) : (
            loanData.requestsByUser
              .sort((a, b) => b.requestCount - a.requestCount)
              .slice(0, 10)
              .map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {user.userName || user.userEmail}
                      </p>
                      {user.userName && (
                        <p className="text-sm text-muted-foreground">
                          {user.userEmail}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="default">
                      {user.requestCount} total
                    </Badge>
                    <Badge variant="outline" className="bg-green-50">
                      {user.approvedCount} ✓
                    </Badge>
                    {user.rejectedCount > 0 && (
                      <Badge variant="outline" className="bg-red-50">
                        {user.rejectedCount} ✗
                      </Badge>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </Card>

      {/* Peak Request Days */}
      {loanData.peakRequestDays.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Días Pico de Solicitudes
          </h3>
          <div className="flex flex-wrap gap-2">
            {loanData.peakRequestDays.map((day) => (
              <Badge key={day} variant="secondary">
                {new Date(day).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
