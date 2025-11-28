"use client";

import { useState, useCallback, useMemo } from "react";
import { Calendar, dateFnsLocalizer, View, SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  LabReservation,
  ReservationStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  SOFTWARE_LABELS,
  PURPOSE_LABELS,
  USER_TYPE_LABELS,
  TIME_BLOCKS,
} from "@/types/lab-reservation";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Computer, Clock, User } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Configurar localizer con date-fns en español
const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Definir las 9 computadoras como recursos
const COMPUTERS = [
  { id: 1, title: "PC 1" },
  { id: 2, title: "PC 2" },
  { id: 3, title: "PC 3" },
  { id: 4, title: "PC 4" },
  { id: 5, title: "PC 5" },
  { id: 6, title: "PC 6 (CFD)" },
  { id: 7, title: "PC 7 (CFD)" },
  { id: 8, title: "PC 8 (CFD)" },
  { id: 9, title: "PC 9 (CFD)" },
];

// Convertir bloques horarios a horas
const TIME_BLOCK_HOURS: Record<string, { start: number; end: number }> = {
  "07:00-08:45": { start: 7, end: 8.75 },
  "08:45-10:30": { start: 8.75, end: 10.5 },
  "10:30-12:15": { start: 10.5, end: 12.25 },
  "12:15-14:00": { start: 12.25, end: 14 },
  "14:00-15:45": { start: 14, end: 15.75 },
  "15:45-17:30": { start: 15.75, end: 17.5 },
};

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: number;
  reservation: LabReservation;
}

interface LabResourceCalendarProps {
  reservations: LabReservation[];
  onSelectSlot?: (slotInfo: { start: Date; end: Date; resourceId: number }) => void;
  onSelectReservation?: (reservation: LabReservation) => void;
  isAdmin?: boolean;
  showOnlyApproved?: boolean;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

export function LabResourceCalendar({
  reservations,
  onSelectSlot,
  onSelectReservation,
  isAdmin = false,
  showOnlyApproved = false,
  selectedDate,
  onDateChange,
}: LabResourceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [currentView, setCurrentView] = useState<View>("day");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Convertir reservaciones a eventos del calendario
  const events: CalendarEvent[] = useMemo(() => {
    const filteredReservations = showOnlyApproved
      ? reservations.filter((r) => r.status === ReservationStatus.APPROVED)
      : reservations;

    const calendarEvents: CalendarEvent[] = [];

    filteredReservations.forEach((reservation) => {
      // Cada reserva puede tener múltiples bloques horarios
      const blocks = reservation.timeBlocks || [];

      blocks.forEach((block) => {
        const timeInfo = TIME_BLOCK_HOURS[block];
        if (!timeInfo) return;

        const reservationDate = new Date(reservation.reservationDate + "T00:00:00");
        const startHour = Math.floor(timeInfo.start);
        const startMinutes = (timeInfo.start - startHour) * 60;
        const endHour = Math.floor(timeInfo.end);
        const endMinutes = (timeInfo.end - endHour) * 60;

        const start = new Date(reservationDate);
        start.setHours(startHour, startMinutes, 0, 0);

        const end = new Date(reservationDate);
        end.setHours(endHour, endMinutes, 0, 0);

        calendarEvents.push({
          id: `${reservation._id}-${block}`,
          title: isAdmin ? `${reservation.userName}` : reservation.purpose,
          start,
          end,
          resourceId: reservation.computerNumber,
          reservation,
        });
      });
    });

    return calendarEvents;
  }, [reservations, showOnlyApproved, isAdmin]);

  // Estilo de eventos según estado
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const status = event.reservation.status;
    let backgroundColor = "#3b82f6"; // blue default
    let borderColor = "#2563eb";

    switch (status) {
      case ReservationStatus.PENDING:
        backgroundColor = "#fbbf24";
        borderColor = "#f59e0b";
        break;
      case ReservationStatus.APPROVED:
        backgroundColor = "#22c55e";
        borderColor = "#16a34a";
        break;
      case ReservationStatus.REJECTED:
        backgroundColor = "#ef4444";
        borderColor = "#dc2626";
        break;
      case ReservationStatus.CANCELLED:
        backgroundColor = "#9ca3af";
        borderColor = "#6b7280";
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: "4px",
        color: "white",
        fontSize: "12px",
        padding: "2px 4px",
      },
    };
  }, []);

  // Manejar click en evento
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setDetailDialogOpen(true);
    if (onSelectReservation) {
      onSelectReservation(event.reservation);
    }
  }, [onSelectReservation]);

  // Manejar selección de slot vacío
  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    if (onSelectSlot && slotInfo.resourceId) {
      onSelectSlot({
        start: slotInfo.start,
        end: slotInfo.end,
        resourceId: slotInfo.resourceId as number,
      });
    }
  }, [onSelectSlot]);

  // Navegación del calendario
  const handleNavigate = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  }, [onDateChange]);

  const goToToday = () => handleNavigate(new Date());
  const goToPrevious = () => {
    const newDate = currentView === "day"
      ? addDays(currentDate, -1)
      : addDays(currentDate, -7);
    handleNavigate(newDate);
  };
  const goToNext = () => {
    const newDate = currentView === "day"
      ? addDays(currentDate, 1)
      : addDays(currentDate, 7);
    handleNavigate(newDate);
  };

  // Componente de toolbar personalizado
  const CustomToolbar = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={goToPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={goToToday}>
          Hoy
        </Button>
        <Button variant="outline" size="sm" onClick={goToNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <h2 className="text-lg font-semibold text-gray-900">
        {format(currentDate, "EEEE, d 'de' MMMM yyyy", { locale: es })}
      </h2>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentView("day")}
          className={currentView === "day" ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : ""}
        >
          Día
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentView("work_week")}
          className={currentView === "work_week" ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : ""}
        >
          Semana
        </Button>
      </div>
    </div>
  );

  // Leyenda de estados
  const StatusLegend = () => (
    <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-700">Estados:</span>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-yellow-400" />
        <span className="text-xs">Pendiente</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-green-500" />
        <span className="text-xs">Aprobada</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-red-500" />
        <span className="text-xs">Rechazada</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-gray-400" />
        <span className="text-xs">Cancelada</span>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          Calendario de Reservas - Laboratorio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CustomToolbar />
        {isAdmin && <StatusLegend />}

        <div style={{ height: 600 }}>
          <Calendar
            localizer={localizer}
            events={events}
            resources={COMPUTERS}
            resourceIdAccessor="id"
            resourceTitleAccessor="title"
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={handleNavigate}
            step={15}
            timeslots={7}
            min={new Date(2025, 0, 1, 7, 0, 0)}
            max={new Date(2025, 0, 1, 17, 30, 0)}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable={!!onSelectSlot}
            toolbar={false}
            formats={{
              timeGutterFormat: (date: Date) => format(date, "HH:mm"),
              eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
                `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`,
            }}
            messages={{
              today: "Hoy",
              previous: "Anterior",
              next: "Siguiente",
              month: "Mes",
              week: "Semana",
              day: "Día",
              agenda: "Agenda",
              noEventsInRange: "No hay reservas en este rango",
            }}
          />
        </div>

        {/* Dialog de detalles */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalles de la Reserva</DialogTitle>
              <DialogDescription>
                Información de la reserva seleccionada
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={STATUS_COLORS[selectedEvent.reservation.status]}>
                    {STATUS_LABELS[selectedEvent.reservation.status]}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Computer className="h-3 w-3" />
                    PC {selectedEvent.reservation.computerNumber}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{selectedEvent.reservation.userName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(selectedEvent.reservation.reservationDate + "T12:00:00"), "EEEE, d 'de' MMMM", { locale: es })}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="text-sm">
                    <span className="text-gray-500">Tipo de Usuario: </span>
                    <span className="font-medium">{USER_TYPE_LABELS[selectedEvent.reservation.userType]}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Propósito: </span>
                    <span className="font-medium">{PURPOSE_LABELS[selectedEvent.reservation.purpose]}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Software: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedEvent.reservation.software.map((sw) => (
                        <Badge key={sw} variant="secondary" className="text-xs">
                          {SOFTWARE_LABELS[sw]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-sm pt-2 border-t">
                  <span className="text-gray-500">Bloques horarios: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedEvent.reservation.timeBlocks?.map((block) => {
                      const blockInfo = TIME_BLOCKS.find((b) => b.value === block);
                      return (
                        <Badge key={block} variant="outline" className="text-xs">
                          {blockInfo ? `${blockInfo.startTime} - ${blockInfo.endTime}` : block}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {selectedEvent.reservation.description && (
                  <div className="text-sm pt-2 border-t">
                    <span className="text-gray-500">Descripción: </span>
                    <p className="mt-1 text-gray-700">{selectedEvent.reservation.description}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
