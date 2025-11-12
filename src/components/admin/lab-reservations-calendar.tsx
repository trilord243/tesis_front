"use client";

import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LabReservation, ReservationStatus, USER_TYPE_LABELS } from "@/types/lab-reservation";
import { Computer, User, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

interface LabReservationsCalendarProps {
  reservations: LabReservation[];
}

interface ReservationEvent extends Event {
  resource: {
    reservation: LabReservation;
  };
}

// Custom Toolbar Component with arrow navigation
interface CustomToolbarProps {
  label: string;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

function CustomToolbar({ label, onNavigate }: CustomToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
      {/* Month/Year with Arrow Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate("PREV")}
          className="h-10 w-10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <h2 className="text-2xl font-bold capitalize" style={{ color: "#1859A9" }}>
          {label}
        </h2>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate("NEXT")}
          className="h-10 w-10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Today Button */}
      <Button
        variant="outline"
        onClick={() => onNavigate("TODAY")}
        style={{ borderColor: "#1859A9", color: "#1859A9" }}
        className="hover:bg-[#1859A920]"
      >
        Hoy
      </Button>
    </div>
  );
}

export function LabReservationsCalendar({ reservations }: LabReservationsCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<LabReservation | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Estado para el modal de múltiples reservas del mismo día
  const [dayEventsModalOpen, setDayEventsModalOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<ReservationEvent[]>([]);
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);

  // Filtrar solo reservas aprobadas
  const approvedReservations = useMemo(
    () => reservations.filter((r) => r.status === ReservationStatus.APPROVED),
    [reservations]
  );

  // Convertir reservas a eventos del calendario
  const events: ReservationEvent[] = useMemo(() => {
    return approvedReservations.map((reservation) => {
      const date = new Date(reservation.reservationDate + "T12:00:00");
      return {
        title: `${reservation.userName} - PC #${reservation.computerNumber}`,
        start: date,
        end: date,
        allDay: true,
        resource: {
          reservation,
        },
      };
    });
  }, [approvedReservations]);

  // Agrupar reservas por fecha para mostrar estadísticas
  const reservationsByDate = useMemo(() => {
    const grouped = new Map<string, LabReservation[]>();
    approvedReservations.forEach((reservation) => {
      const dateKey = reservation.reservationDate;
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)?.push(reservation);
    });
    return grouped;
  }, [approvedReservations]);

  // Estilo personalizado para los eventos
  const eventStyleGetter = (event: ReservationEvent) => {
    const computerNumber = event.resource.reservation.computerNumber;
    // Colores diferentes para diferentes computadoras
    const colors = [
      "#1859A9", // Azul principal
      "#FF8200", // Naranja principal
      "#003087", // Azul secundario
      "#F68629", // Naranja secundario
      "#10b981", // Verde
      "#8b5cf6", // Púrpura
      "#ec4899", // Rosa
      "#f59e0b", // Ámbar
      "#06b6d4", // Cyan
    ];
    const backgroundColor = colors[(computerNumber - 1) % colors.length];

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.9,
        color: "white",
        border: "none",
        display: "block",
        fontSize: "0.85rem",
        padding: "4px 8px",
      },
    };
  };

  const handleSelectEvent = (event: ReservationEvent) => {
    setSelectedEvent(event.resource.reservation);
  };

  // Función para manejar cuando se hace clic en "Ver más" en un día con muchos eventos
  const handleShowMore = (events: ReservationEvent[], date: Date) => {
    setSelectedDayEvents(events);
    setSelectedDayDate(date);
    setDayEventsModalOpen(true);
  };

  // Función para manejar cuando se hace clic en una fecha específica
  const handleSelectSlot = (slotInfo: { start: Date; end: Date; slots: Date[] }) => {
    const clickedDate = slotInfo.start;

    // Filtrar eventos que coincidan con la fecha seleccionada
    const eventsForDay = events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === clickedDate.getFullYear() &&
        eventDate.getMonth() === clickedDate.getMonth() &&
        eventDate.getDate() === clickedDate.getDate()
      );
    });

    // Solo abrir el modal si hay eventos ese día
    if (eventsForDay.length > 0) {
      setSelectedDayEvents(eventsForDay);
      setSelectedDayDate(clickedDate);
      setDayEventsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-4 pt-6">
            <CardDescription className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-4 w-4" />
              Total de Reservas Aprobadas
            </CardDescription>
            <CardTitle className="text-3xl" style={{ color: "#1859A9" }}>
              {approvedReservations.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-4 pt-6">
            <CardDescription className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4" />
              Usuarios Únicos
            </CardDescription>
            <CardTitle className="text-3xl" style={{ color: "#FF8200" }}>
              {new Set(approvedReservations.map((r) => r.userId)).size}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-4 pt-6">
            <CardDescription className="flex items-center gap-2 mb-2">
              <Computer className="h-4 w-4" />
              Computadoras Reservadas
            </CardDescription>
            <CardTitle className="text-3xl" style={{ color: "#003087" }}>
              {new Set(approvedReservations.map((r) => r.computerNumber)).size}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Leyenda de colores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leyenda de Computadoras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Array.from(new Set(approvedReservations.map((r) => r.computerNumber)))
              .sort((a, b) => a - b)
              .map((computerNumber) => {
                const colors = [
                  "#1859A9",
                  "#FF8200",
                  "#003087",
                  "#F68629",
                  "#10b981",
                  "#8b5cf6",
                  "#ec4899",
                  "#f59e0b",
                  "#06b6d4",
                ];
                const color = colors[(computerNumber - 1) % colors.length];
                return (
                  <Badge
                    key={computerNumber}
                    variant="outline"
                    className="flex items-center gap-1 px-3 py-1"
                    style={{
                      backgroundColor: `${color}20`,
                      borderColor: color,
                      color: color,
                    }}
                  >
                    <Computer className="h-3 w-3" />
                    Computadora #{computerNumber}
                  </Badge>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Calendario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendario de Reservas Aprobadas
          </CardTitle>
          <CardDescription>
            Vista mensual de todas las reservas aprobadas. Haz clic en cualquier fecha para ver todas las reservas de ese día.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] bg-white p-4 rounded-lg">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
              style={{ height: "100%" }}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              onShowMore={handleShowMore}
              onSelectSlot={handleSelectSlot}
              selectable
              popup
              components={{
                toolbar: CustomToolbar,
              }}
              messages={{
                next: "Siguiente",
                previous: "Anterior",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                agenda: "Agenda",
                date: "Fecha",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "No hay reservas en este rango de fechas",
                showMore: (total) => `+ Ver más (${total})`,
              }}
              culture="es"
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal de reservas múltiples del mismo día */}
      <Dialog open={dayEventsModalOpen} onOpenChange={setDayEventsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: "#1859A9" }}>
              <CalendarIcon className="h-5 w-5" />
              Reservas del{" "}
              {selectedDayDate?.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </DialogTitle>
            <DialogDescription>
              Total de {selectedDayEvents.length} {selectedDayEvents.length === 1 ? "reserva" : "reservas"} aprobadas para este día
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {selectedDayEvents.map((event, index) => {
              const reservation = event.resource.reservation;
              const colors = [
                "#1859A9", "#FF8200", "#003087", "#F68629",
                "#10b981", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4",
              ];
              const color = colors[(reservation.computerNumber - 1) % colors.length];

              return (
                <Card
                  key={reservation._id || index}
                  className="hover:shadow-md transition-shadow"
                  style={{ borderLeft: `4px solid ${color}` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                            style={{
                              backgroundColor: `${color}20`,
                              borderColor: color,
                              color: color,
                            }}
                          >
                            <Computer className="h-3 w-3" />
                            Computadora #{reservation.computerNumber}
                          </Badge>
                          <Badge variant="secondary">
                            {USER_TYPE_LABELS[reservation.userType]}
                          </Badge>
                        </div>

                        <div>
                          <p className="font-semibold text-base">{reservation.userName}</p>
                          <p className="text-sm text-muted-foreground">{reservation.userEmail}</p>
                        </div>

                        {reservation.description && (
                          <p className="text-sm text-muted-foreground">
                            {reservation.description}
                          </p>
                        )}

                        {reservation.approvedBy && (
                          <p className="text-xs text-muted-foreground">
                            Aprobada por: {reservation.approvedBy}
                          </p>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(reservation);
                          setDayEventsModalOpen(false);
                        }}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Detalle del evento seleccionado */}
      {selectedEvent && (
        <Card className="border-2" style={{ borderColor: "#1859A9" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Detalles de la Reserva Seleccionada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Usuario:</span>
                <p className="font-semibold text-lg">{selectedEvent.userName}</p>
                <p className="text-sm text-muted-foreground">{selectedEvent.userEmail}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Tipo de Usuario:</span>
                <Badge className="mt-1">{USER_TYPE_LABELS[selectedEvent.userType]}</Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Fecha de Reserva:</span>
                <p className="font-medium">
                  {new Date(selectedEvent.reservationDate + "T12:00:00").toLocaleDateString(
                    "es-ES",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Computadora:</span>
                <Badge variant="outline" className="flex items-center gap-1 w-fit mt-1">
                  <Computer className="h-3 w-3" />
                  Computadora #{selectedEvent.computerNumber}
                </Badge>
              </div>
              {selectedEvent.approvedBy && (
                <div>
                  <span className="text-sm text-muted-foreground">Aprobada por:</span>
                  <p className="font-medium">{selectedEvent.approvedBy}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(selectedEvent.approvedAt!).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
              <div className="md:col-span-2">
                <span className="text-sm text-muted-foreground">Descripción:</span>
                <p className="text-sm mt-1">{selectedEvent.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de días con múltiples reservas */}
      {Array.from(reservationsByDate.entries())
        .filter(([, reservations]) => reservations.length > 1)
        .length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-yellow-700">
              ⚠️ Días con Múltiples Reservas
            </CardTitle>
            <CardDescription>
              Estos días tienen más de una computadora reservada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(reservationsByDate.entries())
                .filter(([, reservations]) => reservations.length > 1)
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .map(([date, reservations]) => (
                  <div key={date} className="p-4 border rounded-lg bg-yellow-50">
                    <p className="font-semibold mb-2">
                      {new Date(date + "T12:00:00").toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <div className="flex flex-col gap-2">
                      {reservations.map((reservation) => (
                        <div
                          key={reservation._id}
                          className="flex items-center justify-between p-2 bg-white rounded"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Computer className="h-3 w-3" />
                              PC #{reservation.computerNumber}
                            </Badge>
                            <span className="text-sm font-medium">{reservation.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {reservation.userEmail}
                            </span>
                          </div>
                          <Badge>{USER_TYPE_LABELS[reservation.userType]}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
