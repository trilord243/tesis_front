"use client";

import { useState, useEffect } from "react";
import { BarChart3, PieChart, Users, Calendar, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ProductHistoryStats,
  EventType,
  EventSeverity
} from "@/types/product-history";
import { Product } from "@/types/product";
import productHistoryService from "@/lib/api/product-history";

interface ProductHistoryStatsProps {
  product: Product;
}

export function ProductHistoryStatsComponent({ product }: ProductHistoryStatsProps) {
  const [stats, setStats] = useState<ProductHistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productHistoryService.getProductHistoryStats(product._id);
        setStats(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [product._id]);

  // Traducir tipos de evento
  const translateEventType = (eventType: EventType): string => {
    const translations: Record<EventType, string> = {
      [EventType.CREATED]: "Creación",
      [EventType.UPDATED]: "Actualizaciones",
      [EventType.DELETED]: "Eliminaciones",
      [EventType.LOCATION_CHANGED]: "Movimientos",
      [EventType.ZONE_ASSIGNED]: "Zona asignada",
      [EventType.ZONE_RETURNED]: "Zona devuelta",
      [EventType.CABINET_IN]: "Entrada gabinete",
      [EventType.CABINET_OUT]: "Salida gabinete",
      [EventType.RESERVED]: "Reservas",
      [EventType.RESERVATION_CANCELLED]: "Reservas canceladas",
      [EventType.CHECKED_OUT]: "Check-outs",
      [EventType.CHECKED_IN]: "Check-ins",
      [EventType.LOAN_REQUESTED]: "Préstamos solicitados",
      [EventType.LOAN_APPROVED]: "Préstamos aprobados",
      [EventType.LOAN_REJECTED]: "Préstamos rechazados",
      [EventType.LOAN_RETURNED]: "Préstamos devueltos",
      [EventType.MAINTENANCE_STARTED]: "Inicio mantenim.",
      [EventType.MAINTENANCE_COMPLETED]: "Fin mantenim.",
      [EventType.REPAIR_REQUESTED]: "Reparación solicitada",
      [EventType.REPAIR_COMPLETED]: "Reparación completada",
      [EventType.STATUS_CHANGED]: "Cambios estado",
      [EventType.MADE_AVAILABLE]: "Disponible",
      [EventType.MADE_UNAVAILABLE]: "No disponible",
      [EventType.RFID_TAG_ASSIGNED]: "RFID asignado",
      [EventType.RFID_TAG_CHANGED]: "RFID cambiado",
      [EventType.RFID_DETECTED]: "RFID detectado",
      [EventType.RFID_LOST]: "RFID perdido",
      [EventType.UNAUTHORIZED_MOVEMENT]: "Movimiento no autorizado",
      [EventType.SECURITY_ALERT]: "Alertas seguridad",
      [EventType.AUTHORIZATION_EXPIRED]: "Autorización expirada",
      [EventType.USER_ASSIGNED]: "Usuario asignado",
      [EventType.USER_UNASSIGNED]: "Usuario no asignado",
      [EventType.OWNER_CHANGED]: "Propietario cambiado",
      [EventType.SYSTEM_SCAN]: "Escaneo sistema",
      [EventType.INVENTORY_CHECK]: "Chequeo inventario",
      [EventType.DATA_SYNC]: "Sincronización datos",
      [EventType.NOTE_ADDED]: "Nota agregada",
      [EventType.CUSTOM_EVENT]: "Evento personalizado",
    };
    return translations[eventType] || eventType;
  };

  // Obtener color por severidad
  const getSeverityColor = (severity: EventSeverity) => {
    switch (severity) {
      case EventSeverity.SUCCESS:
        return "bg-green-500";
      case EventSeverity.WARNING:
        return "bg-yellow-500";
      case EventSeverity.ERROR:
        return "bg-red-500";
      case EventSeverity.CRITICAL:
        return "bg-red-700";
      default:
        return "bg-blue-500";
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error al cargar las estadísticas</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxEventCount = Math.max(...stats.eventsByType.map(e => e.count), 1);
  // const maxSeverityCount = Math.max(...stats.eventsBySeverity.map(e => e.count), 1);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Total de eventos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEvents}</div>
          <p className="text-xs text-muted-foreground">
            Eventos registrados desde la creación
          </p>
        </CardContent>
      </Card>

      {/* Usuarios activos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers.length}</div>
          <p className="text-xs text-muted-foreground">
            Usuarios que han interactuado
          </p>
        </CardContent>
      </Card>

      {/* Último evento */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Última Actividad</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats.lastEvent ? (
            <div>
              <div className="text-sm font-medium">{translateEventType(stats.lastEvent.eventType)}</div>
              <p className="text-xs text-muted-foreground">
                {formatDate(stats.lastEvent.timestamp)}
              </p>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Sin actividad</div>
          )}
        </CardContent>
      </Card>

      {/* Eventos por tipo */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Eventos por Tipo
          </CardTitle>
          <CardDescription>
            Distribución de tipos de eventos registrados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.eventsByType.map((eventType) => (
            <div key={eventType.type} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {translateEventType(eventType.type)}
                </span>
                <div className="flex items-center gap-2">
                  <span>{eventType.count}</span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round((eventType.count / stats.totalEvents) * 100)}%
                  </Badge>
                </div>
              </div>
              <Progress
                value={(eventType.count / maxEventCount) * 100}
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Eventos por severidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Severidad
          </CardTitle>
          <CardDescription>
            Distribución por nivel de importancia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.eventsBySeverity.map((severity) => (
            <div key={severity.severity} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${getSeverityColor(severity.severity)}`}
                />
                <span className="text-sm font-medium capitalize">
                  {severity.severity.toLowerCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{severity.count}</span>
                <Badge variant="outline" className="text-xs">
                  {Math.round((severity.count / stats.totalEvents) * 100)}%
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Usuarios más activos */}
      {stats.activeUsers.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Usuarios Más Activos
            </CardTitle>
            <CardDescription>
              Usuarios con mayor actividad en este producto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.activeUsers
                .sort((a, b) => b.eventCount - a.eventCount)
                .slice(0, 5)
                .map((user) => (
                  <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
  <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {user.userName || 'Usuario sin nombre'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.userId}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{user.eventCount}</div>
                      <div className="text-xs text-gray-500">eventos</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información temporal */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Línea de Tiempo
          </CardTitle>
          <CardDescription>
            Información temporal del historial del producto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Primer Evento</h4>
              {stats.firstEvent ? (
                <div className="space-y-1">
                  <p className="font-semibold">{translateEventType(stats.firstEvent.eventType)}</p>
                  <p className="text-sm text-gray-600">{stats.firstEvent.description}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(stats.firstEvent.timestamp)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Sin eventos registrados</p>
              )}
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Último Evento</h4>
              {stats.lastEvent ? (
                <div className="space-y-1">
                  <p className="font-semibold">{translateEventType(stats.lastEvent.eventType)}</p>
                  <p className="text-sm text-gray-600">{stats.lastEvent.description}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(stats.lastEvent.timestamp)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Sin eventos registrados</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}