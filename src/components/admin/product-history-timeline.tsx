"use client";

import { useState, useEffect, useCallback } from "react";
import { History, Clock, User, MapPin, Settings, Package, AlertTriangle, CheckCircle, XCircle, Info, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};
import {
  ProductHistoryEvent,
  EventType,
  EventSeverity,
  ProductHistoryFilters
} from "@/types/product-history";
import { Product } from "@/types/product";
import productHistoryService from "@/lib/api/product-history";

interface ProductHistoryTimelineProps {
  product: Product;
}

export function ProductHistoryTimeline({ product }: ProductHistoryTimelineProps) {
  const [events, setEvents] = useState<ProductHistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductHistoryFilters>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Cargar eventos del historial
  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filterData: ProductHistoryFilters = {
        ...filters,
        ...(dateRange?.from && { startDate: dateRange.from.toISOString() }),
        ...(dateRange?.to && { endDate: dateRange.to.toISOString() }),
      };

      const response = await productHistoryService.getProductHistory(product._id, filterData);
      setEvents(response.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  }, [product._id, filters, dateRange]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Obtener icono según tipo de evento
  const getEventIcon = (eventType: EventType, severity: EventSeverity) => {
    const iconClasses = "h-4 w-4";

    switch (eventType) {
      case EventType.CREATED:
        return <Package className={`${iconClasses} text-blue-500`} />;
      case EventType.LOCATION_CHANGED:
        return <MapPin className={`${iconClasses} text-purple-500`} />;
      case EventType.CHECKED_OUT:
      case EventType.CHECKED_IN:
        return <User className={`${iconClasses} text-green-500`} />;
      case EventType.MAINTENANCE_STARTED:
      case EventType.MAINTENANCE_COMPLETED:
        return <Settings className={`${iconClasses} text-orange-500`} />;
      case EventType.SECURITY_ALERT:
        return <AlertTriangle className={`${iconClasses} text-red-500`} />;
      case EventType.RFID_DETECTED:
        return <Zap className={`${iconClasses} text-yellow-500`} />;
      default:
        if (severity === EventSeverity.SUCCESS) {
          return <CheckCircle className={`${iconClasses} text-green-500`} />;
        } else if (severity === EventSeverity.ERROR || severity === EventSeverity.CRITICAL) {
          return <XCircle className={`${iconClasses} text-red-500`} />;
        } else if (severity === EventSeverity.WARNING) {
          return <AlertTriangle className={`${iconClasses} text-yellow-500`} />;
        }
        return <Info className={`${iconClasses} text-gray-500`} />;
    }
  };

  // Obtener color según severidad
  const getSeverityColor = (severity: EventSeverity) => {
    switch (severity) {
      case EventSeverity.SUCCESS:
        return "bg-green-100 text-green-800 border-green-200";
      case EventSeverity.WARNING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case EventSeverity.ERROR:
        return "bg-red-100 text-red-800 border-red-200";
      case EventSeverity.CRITICAL:
        return "bg-red-200 text-red-900 border-red-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
      return "Hace un momento";
    } else if (minutes < 60) {
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (days < 7) {
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Traducir tipos de evento
  const translateEventType = (eventType: EventType): string => {
    const translations: Record<EventType, string> = {
      [EventType.CREATED]: "Creado",
      [EventType.UPDATED]: "Actualizado",
      [EventType.DELETED]: "Eliminado",
      [EventType.LOCATION_CHANGED]: "Ubicación cambiada",
      [EventType.ZONE_ASSIGNED]: "Zona asignada",
      [EventType.ZONE_RETURNED]: "Zona devuelta",
      [EventType.CABINET_IN]: "Entrada a gabinete",
      [EventType.CABINET_OUT]: "Salida de gabinete",
      [EventType.RESERVED]: "Reservado",
      [EventType.RESERVATION_CANCELLED]: "Reserva cancelada",
      [EventType.CHECKED_OUT]: "Retirado",
      [EventType.CHECKED_IN]: "Devuelto",
      [EventType.LOAN_REQUESTED]: "Préstamo solicitado",
      [EventType.LOAN_APPROVED]: "Préstamo aprobado",
      [EventType.LOAN_REJECTED]: "Préstamo rechazado",
      [EventType.LOAN_RETURNED]: "Préstamo devuelto",
      [EventType.MAINTENANCE_STARTED]: "Mantenimiento iniciado",
      [EventType.MAINTENANCE_COMPLETED]: "Mantenimiento completado",
      [EventType.REPAIR_REQUESTED]: "Reparación solicitada",
      [EventType.REPAIR_COMPLETED]: "Reparación completada",
      [EventType.STATUS_CHANGED]: "Estado cambiado",
      [EventType.MADE_AVAILABLE]: "Hecho disponible",
      [EventType.MADE_UNAVAILABLE]: "Hecho no disponible",
      [EventType.RFID_TAG_ASSIGNED]: "RFID asignado",
      [EventType.RFID_TAG_CHANGED]: "RFID cambiado",
      [EventType.RFID_DETECTED]: "RFID detectado",
      [EventType.RFID_LOST]: "RFID perdido",
      [EventType.UNAUTHORIZED_MOVEMENT]: "Movimiento no autorizado",
      [EventType.SECURITY_ALERT]: "Alerta de seguridad",
      [EventType.AUTHORIZATION_EXPIRED]: "Autorización expirada",
      [EventType.USER_ASSIGNED]: "Usuario asignado",
      [EventType.USER_UNASSIGNED]: "Usuario no asignado",
      [EventType.OWNER_CHANGED]: "Propietario cambiado",
      [EventType.SYSTEM_SCAN]: "Escaneo del sistema",
      [EventType.INVENTORY_CHECK]: "Chequeo de inventario",
      [EventType.DATA_SYNC]: "Sincronización de datos",
      [EventType.NOTE_ADDED]: "Nota agregada",
      [EventType.CUSTOM_EVENT]: "Evento personalizado",
    };
    return translations[eventType] || eventType;
  };

  const handleEventTypeFilter = (value: string) => {
    if (value === "all") {
      const newFilters = { ...filters };
      delete newFilters.eventTypes;
      setFilters(newFilters);
    } else {
      setFilters(prev => ({ ...prev, eventTypes: [value as EventType] }));
    }
  };

  const handleSeverityFilter = (value: string) => {
    if (value === "all") {
      const newFilters = { ...filters };
      delete newFilters.severity;
      setFilters(newFilters);
    } else {
      setFilters(prev => ({ ...prev, severity: [value as EventSeverity] }));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial del Producto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-gray-500">Cargando historial...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial del Producto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-600 mb-2">Error al cargar el historial</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchHistory} variant="outline">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historial del Producto
        </CardTitle>
        <CardDescription>
          Línea de tiempo completa de todas las actividades del producto
        </CardDescription>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 pt-4 border-t">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Tipo de Evento</label>
            <Select onValueChange={handleEventTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value={EventType.CREATED}>Creación</SelectItem>
                <SelectItem value={EventType.LOCATION_CHANGED}>Movimientos</SelectItem>
                <SelectItem value={EventType.CHECKED_OUT}>Check-outs</SelectItem>
                <SelectItem value={EventType.MAINTENANCE_STARTED}>Mantenimiento</SelectItem>
                <SelectItem value={EventType.SECURITY_ALERT}>Alertas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Severidad</label>
            <Select onValueChange={handleSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value={EventSeverity.SUCCESS}>Éxito</SelectItem>
                <SelectItem value={EventSeverity.INFO}>Información</SelectItem>
                <SelectItem value={EventSeverity.WARNING}>Advertencia</SelectItem>
                <SelectItem value={EventSeverity.ERROR}>Error</SelectItem>
                <SelectItem value={EventSeverity.CRITICAL}>Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Rango de Fechas</label>
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay eventos en el historial</p>
              <p className="text-sm text-gray-400 mt-1">
                Los eventos aparecerán aquí cuando ocurran actividades en el producto
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={event._id} className="flex gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200">
                      {getEventIcon(event.eventType, event.severity)}
                    </div>
                    {index < events.length - 1 && (
                      <div className="w-px h-16 bg-gray-200 mt-2" />
                    )}
                  </div>

                  {/* Event content */}
                  <div className="flex-1 pb-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">
                            {translateEventType(event.eventType)}
                          </h4>
                          <Badge
                            variant="outline"
                            className={getSeverityColor(event.severity)}
                          >
                            {event.severity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatDate(event.timestamp)}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 mb-3">{event.description}</p>

                      {/* Metadata */}
                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <h5 className="font-medium text-sm text-gray-700 mb-2">Detalles:</h5>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {event.metadata.previousLocation && event.metadata.newLocation && (
                              <div className="col-span-2">
                                <span className="text-gray-500">Movimiento:</span>
                                <span className="ml-1">
                                  {event.metadata.previousLocation} → {event.metadata.newLocation}
                                </span>
                              </div>
                            )}
                            {event.metadata.changes && (
                              <div className="col-span-2">
                                <span className="text-gray-500">Cambios:</span>
                                <ul className="ml-4 mt-1">
                                  {event.metadata.changes.map((change: { field: string; oldValue: unknown; newValue: unknown }, i: number) => (
                                    <li key={i} className="text-xs">
                                      <strong>{change.field}:</strong> {String(change.oldValue)} → {String(change.newValue)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {event.metadata.maintenanceType && (
                              <div>
                                <span className="text-gray-500">Tipo:</span>
                                <span className="ml-1">{event.metadata.maintenanceType}</span>
                              </div>
                            )}
                            {event.metadata.technician && (
                              <div>
                                <span className="text-gray-500">Técnico:</span>
                                <span className="ml-1">{event.metadata.technician}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* User info */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          {event.userName ? (
                            <>
                              <User className="h-3 w-3" />
                              <span>{event.userName}</span>
                              {event.userEmail && (
                                <span className="text-xs">({event.userEmail})</span>
                              )}
                            </>
                          ) : event.isSystemGenerated ? (
                            <>
                              <Settings className="h-3 w-3" />
                              <span>Sistema automático</span>
                            </>
                          ) : null}
                        </div>
                        {event.source && (
                          <Badge variant="secondary" className="text-xs">
                            {event.source}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}