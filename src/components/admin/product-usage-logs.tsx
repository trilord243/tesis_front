"use client";

import { useEffect, useState } from "react";
import { UsageAnalyticsService } from "@/lib/api/usage-analytics";
import type { ProductUsageStatistics } from "@/types/usage-analytics";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  User,
  Calendar,
  TrendingUp,
  Activity,
  Timer,
} from "lucide-react";

interface ProductUsageLogsProps {
  productId: string;
  productName?: string;
}

export function ProductUsageLogs({
  productId,
  productName,
}: ProductUsageLogsProps) {
  const [usageStats, setUsageStats] = useState<ProductUsageStatistics | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsageStats() {
      try {
        setIsLoading(true);
        setError(null);
        const stats = await UsageAnalyticsService.getProductUsageStats(
          productId
        );
        setUsageStats(stats);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar estadísticas"
        );
      } finally {
        setIsLoading(false);
      }
    }

    void fetchUsageStats();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-5 w-5 animate-spin" />
          <span>Cargando logs de uso...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">Error: {error}</p>
      </div>
    );
  }

  if (!usageStats) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          No hay datos de uso disponibles
        </p>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Uso Total</p>
              <p className="text-2xl font-bold">
                {usageStats.totalUsageHours.toFixed(1)}h
              </p>
              <p className="text-xs text-muted-foreground">
                {usageStats.totalUsageDays.toFixed(1)} días
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sesiones</p>
              <p className="text-2xl font-bold">{usageStats.sessionCount}</p>
              <p className="text-xs text-muted-foreground">préstamos totales</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2">
              <Timer className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duración Promedio</p>
              <p className="text-2xl font-bold">
                {formatDuration(usageStats.averageSessionDuration)}
              </p>
              <p className="text-xs text-muted-foreground">por sesión</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado Actual</p>
              <Badge
                variant={
                  usageStats.currentlyCheckedOut ? "default" : "secondary"
                }
              >
                {usageStats.currentlyCheckedOut ? "En uso" : "Disponible"}
              </Badge>
              {usageStats.currentlyCheckedOut && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {usageStats.lastCheckoutUser?.email}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Usage by User */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Uso por Usuario</h3>
        <div className="space-y-3">
          {usageStats.usageByUser.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay datos de uso por usuario
            </p>
          ) : (
            usageStats.usageByUser
              .sort((a, b) => b.totalMinutes - a.totalMinutes)
              .map((userUsage) => (
                <div
                  key={userUsage.userId}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {userUsage.userName || userUsage.userEmail}
                      </p>
                      {userUsage.userName && (
                        <p className="text-sm text-muted-foreground">
                          {userUsage.userEmail}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatDuration(userUsage.totalMinutes)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userUsage.sessionCount} sesiones
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      </Card>

      {/* Usage History Timeline */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Historial de Uso</h3>
        <div className="space-y-4">
          {usageStats.usageHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay historial de uso disponible
            </p>
          ) : (
            usageStats.usageHistory
              .sort(
                (a, b) =>
                  new Date(b.checkoutTime).getTime() -
                  new Date(a.checkoutTime).getTime()
              )
              .map((session, index) => (
                <div key={index}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-full bg-blue-100 p-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            {session.userName || session.userEmail}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {session.userEmail}
                          </p>
                        </div>
                        <div className="text-right">
                          {session.durationMinutes !== undefined && (
                            <Badge variant="outline">
                              {formatDuration(session.durationMinutes)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p>
                          <span className="font-medium">Checkout:</span>{" "}
                          {formatDate(session.checkoutTime)}
                        </p>
                        {session.returnTime && (
                          <p>
                            <span className="font-medium">Retorno:</span>{" "}
                            {formatDate(session.returnTime)}
                          </p>
                        )}
                        {!session.returnTime && (
                          <Badge variant="default" className="mt-1">
                            En uso actualmente
                          </Badge>
                        )}
                        {session.notes && (
                          <p className="italic">
                            <span className="font-medium">Notas:</span>{" "}
                            {session.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < usageStats.usageHistory.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))
          )}
        </div>
      </Card>

      {/* Longest and Shortest Sessions */}
      {(usageStats.longestSession || usageStats.shortestSession) && (
        <div className="grid gap-4 md:grid-cols-2">
          {usageStats.longestSession && (
            <Card className="p-4">
              <h4 className="mb-3 font-semibold text-green-700">
                Sesión más larga
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Usuario:</span>{" "}
                  {usageStats.longestSession.userEmail}
                </p>
                <p>
                  <span className="font-medium">Duración:</span>{" "}
                  {usageStats.longestSession.durationMinutes &&
                    formatDuration(usageStats.longestSession.durationMinutes)}
                </p>
                <p className="text-muted-foreground">
                  {formatDate(usageStats.longestSession.checkoutTime)}
                </p>
              </div>
            </Card>
          )}

          {usageStats.shortestSession && (
            <Card className="p-4">
              <h4 className="mb-3 font-semibold text-blue-700">
                Sesión más corta
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Usuario:</span>{" "}
                  {usageStats.shortestSession.userEmail}
                </p>
                <p>
                  <span className="font-medium">Duración:</span>{" "}
                  {usageStats.shortestSession.durationMinutes &&
                    formatDuration(usageStats.shortestSession.durationMinutes)}
                </p>
                <p className="text-muted-foreground">
                  {formatDate(usageStats.shortestSession.checkoutTime)}
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
