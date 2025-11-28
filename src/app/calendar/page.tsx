"use client";

import { useEffect, useState, useCallback } from "react";
import { format, addDays, startOfMonth, endOfMonth, isSameDay, isWeekend } from "date-fns";
import { es } from "date-fns/locale";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MetaverseReservation,
  METAVERSE_STATUS_COLORS,
  formatMetaverseTimeBlocksRange,
} from "@/types/metaverse-reservation";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Building2,
  Users,
  Info,
  Loader2,
  Globe,
  RefreshCw,
} from "lucide-react";

export default function PublicCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reservations, setReservations] = useState<MetaverseReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<MetaverseReservation | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

  // Cargar reservas aprobadas
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/metaverse-reservations/approved");
      if (response.ok) {
        const data = await response.json();
        setReservations(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Generar días del calendario
  const generateCalendarDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days: Date[] = [];

    const startDay = start.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push(addDays(start, -(startDay - i)));
    }

    for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
      days.push(new Date(d));
    }

    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push(addDays(end, i));
      }
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const getReservationForDate = (date: Date): MetaverseReservation | undefined => {
    const dateStr = format(date, "yyyy-MM-dd");
    return reservations.find((r) => r.reservationDate === dateStr);
  };

  const handleDayClick = (date: Date) => {
    const reservation = getReservationForDate(date);
    if (reservation) {
      setSelectedEvent(reservation);
      setShowEventDialog(true);
    }
  };

  return (
    <>
      <Navbar isAuthenticated={false} showAuthButtons={true} isAdmin={false} />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#FF820020", color: "#FF8200" }}
                  >
                    <Globe className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "#1859A9" }}>
                      Calendario del Metaverso
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Centro Mundo X - Eventos programados en el laboratorio
                    </p>
                  </div>
                </div>
                <Button onClick={loadData} variant="outline" disabled={loading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Actualizar
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-blue-800 font-medium">Calendario de eventos del laboratorio</p>
              <p className="text-blue-700 text-sm mt-1">
                Aquí puedes ver los eventos aprobados en el Laboratorio de Metaverso.
                Los días con eventos programados aparecen en naranja. Haz clic en un día con evento para ver los detalles.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendario */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Calendario de Eventos
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold min-w-[150px] text-center">
                        {format(currentMonth, "MMMM yyyy", { locale: es })}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <>
                      {/* Encabezados días */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                          <div
                            key={day}
                            className="text-center text-sm font-medium text-gray-500 py-2"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Días del calendario */}
                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date, index) => {
                          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                          const isToday = isSameDay(date, new Date());
                          const reservation = getReservationForDate(date);
                          const weekend = isWeekend(date);

                          return (
                            <button
                              key={index}
                              onClick={() => handleDayClick(date)}
                              disabled={!isCurrentMonth || !reservation}
                              className={`
                                p-2 h-20 text-sm rounded-lg border transition-all
                                ${!isCurrentMonth ? "bg-gray-50 text-gray-300" : ""}
                                ${isToday ? "ring-2 ring-blue-500" : ""}
                                ${reservation && isCurrentMonth ? "bg-orange-100 border-orange-300 hover:bg-orange-200 cursor-pointer" : ""}
                                ${!reservation && isCurrentMonth ? "bg-white" : ""}
                                ${weekend && isCurrentMonth && !reservation ? "bg-gray-50" : ""}
                              `}
                            >
                              <div className="flex flex-col h-full">
                                <span className={`font-medium ${isToday ? "text-blue-600" : ""}`}>
                                  {format(date, "d")}
                                </span>
                                {reservation && isCurrentMonth && (
                                  <div className="mt-1 text-xs text-orange-700 truncate font-medium">
                                    {reservation.eventTitle}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Leyenda */}
                      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300" />
                          <span className="text-sm">Evento programado</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-white border border-gray-200" />
                          <span className="text-sm">Sin eventos</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Panel lateral - Próximos eventos */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Próximos Eventos</CardTitle>
                  <CardDescription>Eventos aprobados en el laboratorio</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : reservations.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No hay eventos programados
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {reservations.slice(0, 5).map((event) => (
                        <div
                          key={event._id}
                          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowEventDialog(true);
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm truncate">
                              {event.eventTitle}
                            </span>
                            <Badge className={METAVERSE_STATUS_COLORS[event.status]}>
                              Confirmado
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(event.reservationDate + "T12:00:00"), "d MMM yyyy", {
                              locale: es,
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3" />
                            {formatMetaverseTimeBlocksRange(event.timeBlocks)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* CTA para reservar */}
              <Card className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Globe className="h-10 w-10 mx-auto text-blue-600 mb-3" />
                    <h3 className="font-semibold text-lg text-blue-900 mb-2">
                      ¿Quieres reservar el laboratorio?
                    </h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Inicia sesión para solicitar una reserva del laboratorio de metaverso.
                    </p>
                    <a
                      href="/auth/login"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90"
                      style={{ backgroundColor: "#FF8200" }}
                    >
                      Iniciar Sesión
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Modal de detalle de evento */}
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedEvent?.eventTitle}</DialogTitle>
              <DialogDescription>Detalles del evento</DialogDescription>
            </DialogHeader>

            {selectedEvent && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={METAVERSE_STATUS_COLORS[selectedEvent.status]}>
                    Confirmado
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {format(
                        new Date(selectedEvent.reservationDate + "T12:00:00"),
                        "EEEE, d 'de' MMMM yyyy",
                        { locale: es }
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{formatMetaverseTimeBlocksRange(selectedEvent.timeBlocks)}</span>
                  </div>

                  {selectedEvent.organization && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span>{selectedEvent.organization}</span>
                    </div>
                  )}

                  {selectedEvent.expectedAttendees && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{selectedEvent.expectedAttendees} asistentes esperados</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t">
                  <h4 className="font-semibold mb-2">Descripción</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.eventDescription}</p>
                </div>

                {selectedEvent.purpose && (
                  <div className="pt-3 border-t">
                    <h4 className="font-semibold mb-2">Propósito</h4>
                    <p className="text-sm text-gray-600">{selectedEvent.purpose}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
