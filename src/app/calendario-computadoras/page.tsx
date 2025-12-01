"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Navbar } from "@/components/layout/navbar";
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
  LabReservation,
  TIME_BLOCKS,
  USER_TYPE_LABELS,
} from "@/types/lab-reservation";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Computer,
  Loader2,
  RefreshCw,
  Monitor,
  ArrowLeft,
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

// Mapeo de bloques horarios
const TIME_BLOCK_HOURS: Record<
  string,
  { start: string; end: string; startNum: number; endNum: number }
> = {
  "07:00-08:45": { start: "07:00", end: "08:45", startNum: 7, endNum: 8.75 },
  "08:45-10:30": { start: "08:45", end: "10:30", startNum: 8.75, endNum: 10.5 },
  "10:30-12:15": { start: "10:30", end: "12:15", startNum: 10.5, endNum: 12.25 },
  "12:15-14:00": { start: "12:15", end: "14:00", startNum: 12.25, endNum: 14 },
  "14:00-15:45": { start: "14:00", end: "15:45", startNum: 14, endNum: 15.75 },
  "15:45-17:30": { start: "15:45", end: "17:30", startNum: 15.75, endNum: 17.5 },
};

// Colores para cada computadora
const COMPUTER_COLORS: Record<number, string> = {
  1: "#3B82F6",
  2: "#10B981",
  3: "#F59E0B",
  4: "#EF4444",
  5: "#8B5CF6",
  6: "#EC4899",
  7: "#06B6D4",
  8: "#84CC16",
  9: "#F97316",
  10: "#6366F1",
  11: "#14B8A6",
  12: "#A855F7",
};

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    reservation: LabReservation;
    computerNumber: number;
    userName: string;
  };
}

export default function CalendarioComputadorasPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [reservations, setReservations] = useState<LabReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ role: string; name: string; lastName: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayDialog, setShowDayDialog] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/user");
        if (!response.ok) {
          router.push("/auth/login");
          return;
        }
        const userData = await response.json();
        setUser(userData);
      } catch {
        router.push("/auth/login");
      }
    };
    checkAuth();
  }, [router]);

  // Cargar reservas aprobadas
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/lab-reservations?status=approved");
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
    if (user) {
      loadData();
    }
  }, [loadData, user]);

  // Convertir reservaciones a eventos del calendario
  const events: CalendarEvent[] = useMemo(() => {
    const calendarEvents: CalendarEvent[] = [];

    reservations.forEach((reservation) => {
      const blocks = reservation.timeBlocks || [];
      if (blocks.length === 0) return;

      blocks.forEach((block) => {
        const timeInfo = TIME_BLOCK_HOURS[block];
        if (!timeInfo) return;

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
          title: `PC${reservation.computerNumber}`,
          start,
          end,
          resource: {
            reservation,
            computerNumber: reservation.computerNumber,
            userName: reservation.userName,
          },
        });
      });
    });

    return calendarEvents;
  }, [reservations]);

  // Obtener reservas para una fecha específica
  const getReservationsForDate = useCallback(
    (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return reservations.filter((r) => r.reservationDate === dateStr);
    },
    [reservations]
  );

  // Estilo de eventos por computadora
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const color = COMPUTER_COLORS[event.resource.computerNumber] || "#6B7280";
    return {
      style: {
        backgroundColor: color,
        borderColor: color,
        borderRadius: "4px",
        color: "white",
        fontSize: "12px",
        padding: "2px 6px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
      },
    };
  }, []);

  // Manejar click en slot (día)
  const handleSelectSlot = useCallback(
    ({ start }: { start: Date }) => {
      const dayReservations = getReservationsForDate(start);
      if (dayReservations.length > 0) {
        setSelectedDate(start);
        setShowDayDialog(true);
      }
    },
    [getReservationsForDate]
  );

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

  // Componente de evento personalizado
  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div className="h-full w-full flex items-center cursor-pointer overflow-hidden">
      <Monitor className="h-3 w-3 mr-1 flex-shrink-0" />
      <span className="font-medium text-xs truncate">{event.title}</span>
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

  // Agrupar reservas por computadora
  const groupReservationsByComputer = (dayReservations: LabReservation[]) => {
    const grouped: Record<number, LabReservation[]> = {};
    dayReservations.forEach((r) => {
      if (!grouped[r.computerNumber]) {
        grouped[r.computerNumber] = [];
      }
      grouped[r.computerNumber]!.push(r);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([computer, reservations]) => ({
        computerNumber: Number(computer),
        reservations,
      }));
  };

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const backLink = isAdmin ? "/admin/dashboard" : "/dashboard";

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#1859A9" }} />
      </div>
    );
  }

  return (
    <>
      <Navbar
        isAuthenticated={true}
        showAuthButtons={false}
        isAdmin={isAdmin}
        isSuperAdmin={user?.role === "superadmin"}
      />
      <div className="min-h-screen bg-gray-100 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link
                  href={backLink}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="text-sm font-medium">Volver</span>
                </Link>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center gap-2">
                  <Computer className="h-5 w-5" style={{ color: "#1859A9" }} />
                  <h1 className="text-xl font-bold" style={{ color: "#1859A9" }}>
                    Calendario de Computadoras
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Navegación */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <Button variant="ghost" size="sm" onClick={goToPrevious} className="h-8 w-8 p-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={goToToday} className="h-8 px-3 text-sm">
                    Hoy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={goToNext} className="h-8 w-8 p-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Toggle de vista */}
                <div className="hidden sm:flex gap-1 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={currentView === "month" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentView("month")}
                    className="h-8 px-4 text-sm"
                    style={currentView === "month" ? { backgroundColor: "#1859A9", color: "white" } : {}}
                  >
                    Mes
                  </Button>
                  <Button
                    variant={currentView === "week" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentView("week")}
                    className="h-8 px-4 text-sm"
                    style={currentView === "week" ? { backgroundColor: "#1859A9", color: "white" } : {}}
                  >
                    Semana
                  </Button>
                  <Button
                    variant={currentView === "day" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentView("day")}
                    className="h-8 px-4 text-sm"
                    style={currentView === "day" ? { backgroundColor: "#1859A9", color: "white" } : {}}
                  >
                    Día
                  </Button>
                </div>

                <Button onClick={loadData} variant="ghost" size="sm" disabled={loading} className="h-8 w-8 p-0">
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Subtítulo con mes */}
        <div className="bg-white border-b px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-center text-lg font-semibold text-gray-700 capitalize">
            {format(currentDate, "MMMM yyyy", { locale: es })}
          </p>
        </div>

        {/* Calendario */}
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Card className="shadow-sm border-0">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <Loader2 className="h-12 w-12 animate-spin" style={{ color: "#FF8200" }} />
                </div>
              ) : (
                <div style={{ height: "calc(100vh - 320px)", minHeight: "550px" }} className="public-calendar">
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
                    selectable
                    toolbar={false}
                    components={{
                      event: EventComponent,
                    }}
                    formats={{
                      dayHeaderFormat: (date: Date) => format(date, "EEEE d", { locale: es }),
                      weekdayFormat: (date: Date) => format(date, "EEEE", { locale: es }),
                      monthHeaderFormat: (date: Date) => format(date, "MMMM yyyy", { locale: es }),
                      dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
                        `${format(start, "d MMMM", { locale: es })} - ${format(end, "d MMMM yyyy", { locale: es })}`,
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
                      noEventsInRange: "No hay reservas",
                      showMore: (total: number) => `+ ${total} más`,
                    }}
                  />
                </div>
              )}

              {/* Leyenda de colores */}
              <div className="px-4 py-3 border-t bg-gray-50">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-gray-500 font-medium">Computadoras:</span>
                  {Object.entries(COMPUTER_COLORS).slice(0, 10).map(([num, color]) => (
                    <div key={num} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                      <span className="text-xs text-gray-600">PC{num}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    Haz clic en un día para ver detalles
                  </span>
                  <span className="text-xs text-gray-400">
                    {reservations.length} reserva{reservations.length !== 1 ? "s" : ""} aprobada
                    {reservations.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal de detalle del día */}
        <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" style={{ color: "#1859A9" }} />
                {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM yyyy", { locale: es })}
              </DialogTitle>
              <DialogDescription>
                Reservas de computadoras para este día
              </DialogDescription>
            </DialogHeader>

            {selectedDate && (
              <div className="space-y-4 mt-4">
                {groupReservationsByComputer(getReservationsForDate(selectedDate)).map(
                  ({ computerNumber, reservations: compReservations }) => (
                    <div
                      key={computerNumber}
                      className="border rounded-lg overflow-hidden"
                      style={{ borderLeftWidth: "4px", borderLeftColor: COMPUTER_COLORS[computerNumber] || "#6B7280" }}
                    >
                      <div
                        className="px-4 py-2 font-semibold flex items-center gap-2"
                        style={{ backgroundColor: `${COMPUTER_COLORS[computerNumber]}15` }}
                      >
                        <Monitor className="h-4 w-4" style={{ color: COMPUTER_COLORS[computerNumber] }} />
                        <span>Computadora #{computerNumber}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {compReservations.length} reserva{compReservations.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <div className="divide-y">
                        {compReservations.map((reservation) => (
                          <div key={reservation._id} className="px-4 py-3 bg-white">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="h-3 w-3" />
                                  <span className="font-medium">
                                    {formatTimeBlocksRange(reservation.timeBlocks)}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {USER_TYPE_LABELS[reservation.userType] || reservation.userType}
                              </Badge>
                            </div>
                            {/* Bloques */}
                            <div className="mt-2 flex flex-wrap gap-1">
                              {reservation.timeBlocks.map((block) => {
                                const blockInfo = TIME_BLOCKS.find((b) => b.value === block);
                                return (
                                  <Badge key={block} variant="secondary" className="text-xs">
                                    {blockInfo?.label || block}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {getReservationsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay reservas para este día
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
