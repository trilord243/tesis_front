"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
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
  METAVERSE_TIME_BLOCKS,
} from "@/types/metaverse-reservation";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Building2,
  Users,
  User,
  Loader2,
  RefreshCw,
  Target,
} from "lucide-react";
import Link from "next/link";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/calendar.css";

// Configurar localizer con date-fns en español
const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Mapeo de bloques horarios a horas exactas
// Soporta ambos formatos: "block_1" y "07:00-08:45"
const TIME_BLOCK_HOURS: Record<
  string,
  { start: string; end: string; startNum: number; endNum: number }
> = {
  // Formato block_X
  block_1: { start: "07:00", end: "08:45", startNum: 7, endNum: 8.75 },
  block_2: { start: "08:45", end: "10:30", startNum: 8.75, endNum: 10.5 },
  block_3: { start: "10:30", end: "12:15", startNum: 10.5, endNum: 12.25 },
  block_4: { start: "12:15", end: "14:00", startNum: 12.25, endNum: 14 },
  block_5: { start: "14:00", end: "15:45", startNum: 14, endNum: 15.75 },
  block_6: { start: "15:45", end: "17:30", startNum: 15.75, endNum: 17.5 },
  // Formato hora-hora (como viene de la API)
  "07:00-08:45": { start: "07:00", end: "08:45", startNum: 7, endNum: 8.75 },
  "08:45-10:30": { start: "08:45", end: "10:30", startNum: 8.75, endNum: 10.5 },
  "10:30-12:15": { start: "10:30", end: "12:15", startNum: 10.5, endNum: 12.25 },
  "12:15-14:00": { start: "12:15", end: "14:00", startNum: 12.25, endNum: 14 },
  "14:00-15:45": { start: "14:00", end: "15:45", startNum: 14, endNum: 15.75 },
  "15:45-17:30": { start: "15:45", end: "17:30", startNum: 15.75, endNum: 17.5 },
};

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    reservation: MetaverseReservation;
    requesterName: string;
    organization?: string;
    expectedAttendees?: number;
    eventDescription: string;
    purpose: string;
  };
}

export default function PublicCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [reservations, setReservations] = useState<MetaverseReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayDialog, setShowDayDialog] = useState(false);

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

  // Convertir reservaciones a eventos del calendario
  const events: CalendarEvent[] = useMemo(() => {
    const calendarEvents: CalendarEvent[] = [];

    reservations.forEach((reservation) => {
      const blocks = reservation.timeBlocks || [];
      if (blocks.length === 0) return;

      // Crear un evento por cada bloque para mejor visualización
      blocks.forEach((block) => {
        const timeInfo = TIME_BLOCK_HOURS[block];
        if (!timeInfo) return;

        // Parsear la fecha correctamente
        const [year, month, day] = reservation.reservationDate
          .split("-")
          .map(Number);
        const reservationDate = new Date(year!, month! - 1, day);

        const startHour = Math.floor(timeInfo.startNum);
        const startMinutes = Math.round((timeInfo.startNum - startHour) * 60);
        const endHour = Math.floor(timeInfo.endNum);
        const endMinutes = Math.round((timeInfo.endNum - endHour) * 60);

        const start = new Date(reservationDate);
        start.setHours(startHour, startMinutes, 0, 0);

        const end = new Date(reservationDate);
        end.setHours(endHour, endMinutes, 0, 0);

        calendarEvents.push({
          id: `${reservation._id}-${block}`,
          title: reservation.eventTitle,
          start,
          end,
          resource: {
            reservation,
            requesterName: reservation.requesterName,
            ...(reservation.organization !== undefined && { organization: reservation.organization }),
            ...(reservation.expectedAttendees !== undefined && { expectedAttendees: reservation.expectedAttendees }),
            eventDescription: reservation.eventDescription,
            purpose: reservation.purpose,
          },
        });
      });
    });

    return calendarEvents;
  }, [reservations]);

  // Estilo de eventos - diseño estilo Google Calendar
  const eventStyleGetter = useCallback(() => {
    return {
      style: {
        background: "#e8f0fe",
        borderLeft: "4px solid #1859A9",
        borderRadius: "4px",
        color: "#1859A9",
        fontSize: "13px",
        fontWeight: "500",
        padding: "4px 8px",
        margin: "3px 4px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap" as const,
        cursor: "pointer",
        transition: "background 0.15s ease",
      },
    };
  }, []);

  // Obtener reservas para una fecha específica
  const getReservationsForDate = useCallback(
    (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return reservations.filter((r) => r.reservationDate === dateStr);
    },
    [reservations]
  );

  // Manejar click en slot (día)
  const handleSelectSlot = useCallback(
    ({ start }: { start: Date }) => {
      setSelectedDate(start);
      setShowDayDialog(true);
    },
    []
  );

  // Manejar click en evento
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    // Si hay múltiples eventos en el día, mostrar modal del día
    const dateStr = format(event.start, "yyyy-MM-dd");
    const dayReservations = reservations.filter((r) => r.reservationDate === dateStr);
    if (dayReservations.length > 1) {
      setSelectedDate(event.start);
      setShowDayDialog(true);
    } else {
      setSelectedEvent(event);
      setShowEventDialog(true);
    }
  }, [reservations]);

  // Navegación del calendario
  const handleNavigate = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  const goToToday = () => handleNavigate(new Date());
  const goToPrevious = () => {
    if (currentView === "month") {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      handleNavigate(newDate);
    } else {
      const days = currentView === "day" ? -1 : -7;
      handleNavigate(addDays(currentDate, days));
    }
  };
  const goToNext = () => {
    if (currentView === "month") {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      handleNavigate(newDate);
    } else {
      const days = currentView === "day" ? 1 : 7;
      handleNavigate(addDays(currentDate, days));
    }
  };

  // Componente de evento personalizado - Diseño estilo Google Calendar
  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div className="h-full w-full flex items-center overflow-hidden cursor-pointer">
      <span className="truncate text-[13px] font-medium leading-tight">{event.title}</span>
    </div>
  );

  // Formatear rango de bloques
  const formatTimeBlocksRange = (blocks: readonly string[]): string => {
    if (blocks.length === 0) return "";
    const sortedBlocks = [...blocks].sort();
    const first = sortedBlocks[0];
    const last = sortedBlocks[sortedBlocks.length - 1];
    const firstInfo = first ? TIME_BLOCK_HOURS[first] : null;
    const lastInfo = last ? TIME_BLOCK_HOURS[last] : null;
    if (!firstInfo || !lastInfo) return "";
    return `${firstInfo.start} - ${lastInfo.end}`;
  };

  // Obtener label de bloque - soporta ambos formatos
  const getBlockLabel = (blockValue: string): string => {
    // Si ya tiene formato hora-hora, devolverlo directamente
    if (blockValue.includes("-") && blockValue.includes(":")) {
      const blockNum = Object.keys(TIME_BLOCK_HOURS).indexOf(blockValue) - 5; // Offset por los block_X
      return `Bloque ${blockNum > 0 ? blockNum : ""} (${blockValue})`;
    }
    const block = METAVERSE_TIME_BLOCKS.find((b) => b.value === blockValue);
    return block
      ? `${block.label} (${block.startTime} - ${block.endTime})`
      : blockValue;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header simple */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Botón volver + Título */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:inline">Volver</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 hidden sm:block" />
              <h1 className="text-base sm:text-xl font-bold" style={{ color: "#1859A9" }}>
                <span className="hidden sm:inline">Calendario de Eventos</span>
                <span className="sm:hidden">Eventos</span>
              </h1>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Navegación */}
              <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100 rounded-lg p-0.5 sm:p-1">
                <Button variant="ghost" size="sm" onClick={goToPrevious} className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={goToToday} className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm">
                  Hoy
                </Button>
                <Button variant="ghost" size="sm" onClick={goToNext} className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Toggle de vista - móvil: dropdown simplificado */}
              <div className="flex sm:hidden gap-0.5 bg-gray-100 rounded-lg p-0.5">
                <Button
                  variant={currentView === "month" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("month")}
                  className="h-7 px-2 text-xs"
                  style={currentView === "month" ? { backgroundColor: "#1859A9", color: "white" } : {}}
                >
                  M
                </Button>
                <Button
                  variant={currentView === "week" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("week")}
                  className="h-7 px-2 text-xs"
                  style={currentView === "week" ? { backgroundColor: "#1859A9", color: "white" } : {}}
                >
                  S
                </Button>
                <Button
                  variant={currentView === "day" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("day")}
                  className="h-7 px-2 text-xs"
                  style={currentView === "day" ? { backgroundColor: "#1859A9", color: "white" } : {}}
                >
                  D
                </Button>
              </div>

              {/* Toggle de vista - desktop */}
              <div className="hidden sm:flex gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={currentView === "month" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("month")}
                  className="h-8 px-4 text-sm"
                  style={
                    currentView === "month"
                      ? { backgroundColor: "#1859A9", color: "white" }
                      : {}
                  }
                >
                  Mes
                </Button>
                <Button
                  variant={currentView === "week" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("week")}
                  className="h-8 px-4 text-sm"
                  style={
                    currentView === "week"
                      ? { backgroundColor: "#1859A9", color: "white" }
                      : {}
                  }
                >
                  Semana
                </Button>
                <Button
                  variant={currentView === "day" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("day")}
                  className="h-8 px-4 text-sm"
                  style={
                    currentView === "day"
                      ? { backgroundColor: "#1859A9", color: "white" }
                      : {}
                  }
                >
                  Día
                </Button>
              </div>

              {/* Actualizar */}
              <Button onClick={loadData} variant="ghost" size="sm" disabled={loading} className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Subtítulo con mes */}
      <div className="bg-white border-b px-2 sm:px-4 lg:px-8 py-2 sm:py-3">
        <p className="text-center text-base sm:text-lg font-semibold text-gray-700 capitalize">
          {format(currentDate, "MMMM yyyy", { locale: es })}
        </p>
      </div>

      {/* Calendario */}
      <div className="px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
        <Card className="shadow-sm border-0">
          <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-16 sm:py-32">
                  <Loader2
                    className="h-8 w-8 sm:h-12 sm:w-12 animate-spin"
                    style={{ color: "#FF8200" }}
                  />
                </div>
              ) : (
                <div
                  style={{ height: "calc(100vh - 200px)", minHeight: "400px" }}
                  className="public-calendar text-xs sm:text-sm"
                >
                  <Calendar
                    localizer={localizer}
                    events={events}
                    view={currentView}
                    onView={setCurrentView}
                    views={["month", "week", "day"]}
                    date={currentDate}
                    onNavigate={handleNavigate}
                    step={15}
                    timeslots={4}
                    min={new Date(2025, 0, 1, 7, 0, 0)}
                    max={new Date(2025, 0, 1, 18, 0, 0)}
                    eventPropGetter={eventStyleGetter}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    selectable
                    popup={false}
                    doShowMoreDrillDown={false}
                    toolbar={false}
                    components={{
                      event: EventComponent,
                    }}
                    onShowMore={(_events, date) => {
                      setSelectedDate(date);
                      setShowDayDialog(true);
                    }}
                    formats={{
                      dayHeaderFormat: (date: Date) =>
                        format(date, "EEEE d", { locale: es }),
                      weekdayFormat: (date: Date) =>
                        format(date, "EEEE", { locale: es }),
                      monthHeaderFormat: (date: Date) =>
                        format(date, "MMMM yyyy", { locale: es }),
                      dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
                        `${format(start, "d MMMM", { locale: es })} - ${format(end, "d MMMM yyyy", { locale: es })}`,
                      timeGutterFormat: (date: Date) => format(date, "HH:mm"),
                      eventTimeRangeFormat: ({
                        start,
                        end,
                      }: {
                        start: Date;
                        end: Date;
                      }) => `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`,
                    }}
                    messages={{
                      today: "Hoy",
                      previous: "Anterior",
                      next: "Siguiente",
                      month: "Mes",
                      week: "Semana",
                      work_week: "Semana laboral",
                      day: "Día",
                      agenda: "Agenda",
                      date: "Fecha",
                      time: "Hora",
                      event: "Evento",
                      allDay: "Todo el día",
                      noEventsInRange: "No hay eventos programados",
                      showMore: (total: number) => `+ ${total} más`,
                    }}
                  />
                </div>
              )}

            {/* Leyenda simple */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-t bg-gray-50 gap-1 sm:gap-0">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-4 rounded"
                  style={{
                    backgroundColor: "#e8f0fe",
                    borderLeft: "3px solid #1859A9"
                  }}
                />
                <span className="text-xs text-gray-500">Evento reservado</span>
              </div>
              <span className="text-xs text-gray-400">
                {reservations.length} evento{reservations.length !== 1 ? "s" : ""}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de detalle de evento individual */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedEvent?.title}</DialogTitle>
            <DialogDescription>Detalles del evento</DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              {/* Badge de confirmado */}
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  Confirmado
                </Badge>
              </div>

              {/* Información del organizador */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 text-sm">
                  Organizador
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {selectedEvent.resource.requesterName}
                    </span>
                  </div>
                  {selectedEvent.resource.organization && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span>{selectedEvent.resource.organization}</span>
                    </div>
                  )}
                  {selectedEvent.resource.expectedAttendees && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>
                        {selectedEvent.resource.expectedAttendees} asistentes esperados
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fecha y hora */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {format(
                      new Date(
                        selectedEvent.resource.reservation.reservationDate + "T12:00:00"
                      ),
                      "EEEE, d 'de' MMMM yyyy",
                      { locale: es }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>
                    {formatTimeBlocksRange(selectedEvent.resource.reservation.timeBlocks)}
                  </span>
                </div>
              </div>

              {/* Bloques horarios */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm">
                  Bloques reservados
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.resource.reservation.timeBlocks.map((block) => (
                    <Badge key={block} variant="outline" className="text-xs">
                      {getBlockLabel(block)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Propósito */}
              {selectedEvent.resource.purpose && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Propósito
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedEvent.resource.purpose}
                  </p>
                </div>
              )}

              {/* Descripción */}
              {selectedEvent.resource.eventDescription && (
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Descripción del evento
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedEvent.resource.eventDescription}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de detalle del día - muestra todos los eventos del día */}
      <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" style={{ color: "#1859A9" }} />
              {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM yyyy", { locale: es })}
            </DialogTitle>
            <DialogDescription>
              Eventos programados para este día
            </DialogDescription>
          </DialogHeader>

          {selectedDate && (
            <div className="space-y-4 mt-4">
              {getReservationsForDate(selectedDate).map((reservation) => (
                <div
                  key={reservation._id}
                  className="border rounded-lg overflow-hidden"
                  style={{ borderLeftWidth: "4px", borderLeftColor: "#1859A9" }}
                >
                  <div
                    className="px-4 py-3 font-semibold flex items-center gap-2"
                    style={{ backgroundColor: "#1859A915" }}
                  >
                    <Building2 className="h-4 w-4" style={{ color: "#1859A9" }} />
                    <span className="flex-1">{reservation.eventTitle}</span>
                    <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                      Confirmado
                    </Badge>
                  </div>
                  <div className="px-4 py-3 bg-white space-y-3">
                    {/* Organizador */}
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{reservation.requesterName}</span>
                      {reservation.organization && (
                        <span className="text-gray-500">- {reservation.organization}</span>
                      )}
                    </div>

                    {/* Horario */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">
                        {formatTimeBlocksRange(reservation.timeBlocks)}
                      </span>
                    </div>

                    {/* Bloques */}
                    <div className="flex flex-wrap gap-1">
                      {reservation.timeBlocks.map((block) => (
                        <Badge key={block} variant="secondary" className="text-xs">
                          {getBlockLabel(block)}
                        </Badge>
                      ))}
                    </div>

                    {/* Asistentes */}
                    {reservation.expectedAttendees && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{reservation.expectedAttendees} asistentes esperados</span>
                      </div>
                    )}

                    {/* Propósito */}
                    {reservation.purpose && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <Target className="h-4 w-4 mt-0.5" />
                        <span>{reservation.purpose}</span>
                      </div>
                    )}

                    {/* Descripción */}
                    {reservation.eventDescription && (
                      <p className="text-sm text-gray-500 italic border-t pt-2 mt-2">
                        {reservation.eventDescription}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {getReservationsForDate(selectedDate).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No hay eventos para este día</p>
                  <p className="text-sm mt-1">Este día está disponible</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
