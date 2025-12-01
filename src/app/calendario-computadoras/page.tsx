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
  Computer as ComputerType,
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
  User,
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

// Paleta de colores para computadoras (se expande dinámicamente si hay más)
const COLOR_PALETTE = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
  "#14B8A6", "#A855F7", "#0EA5E9", "#22C55E", "#FACC15",
  "#DC2626", "#7C3AED", "#DB2777", "#0891B2", "#65A30D",
];

// Generar color para una computadora
function getComputerColor(computerNumber: number): string {
  const index = (computerNumber - 1) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index] ?? "#6B7280";
}

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
  const [computers, setComputers] = useState<ComputerType[]>([]);
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

  // Cargar computadoras y reservas
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Cargar ambos en paralelo
      const [reservationsRes, computersRes] = await Promise.all([
        fetch("/api/lab-reservations/public"),
        fetch("/api/computers"),
      ]);

      if (reservationsRes.ok) {
        const data = await reservationsRes.json();
        setReservations(Array.isArray(data) ? data : []);
      }

      if (computersRes.ok) {
        const data = await computersRes.json();
        setComputers(Array.isArray(data) ? data : []);
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

  // Obtener lista ordenada de computadoras únicas en reservas o de la configuración
  const computerNumbers = useMemo(() => {
    const fromReservations = new Set(reservations.map((r) => r.computerNumber));
    const fromComputers = new Set(computers.map((c) => c.number));
    const allNumbers = new Set([...fromReservations, ...fromComputers]);
    return Array.from(allNumbers).sort((a, b) => a - b);
  }, [reservations, computers]);

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
    const color = getComputerColor(event.resource.computerNumber);
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
      setSelectedDate(start);
      setShowDayDialog(true);
    },
    []
  );

  // Manejar click en evento
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedDate(event.start);
    setShowDayDialog(true);
  }, []);

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
                    onSelectEvent={handleSelectEvent}
                    selectable
                    popup={false}
                    doShowMoreDrillDown={false}
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
                    onShowMore={(_events, date) => {
                      setSelectedDate(date);
                      setShowDayDialog(true);
                    }}
                  />
                </div>
              )}

              {/* Leyenda de colores */}
              <div className="px-4 py-3 border-t bg-gray-50">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-gray-500 font-medium">Computadoras:</span>
                  {computerNumbers.map((num) => (
                    <div key={num} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: getComputerColor(num) }} />
                      <span className="text-xs text-gray-600">PC{num}</span>
                    </div>
                  ))}
                  {computerNumbers.length === 0 && (
                    <span className="text-xs text-gray-400">Cargando...</span>
                  )}
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    Haz clic en un día o evento para ver detalles
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
          <DialogContent className="w-[calc(100%-2rem)] max-w-[700px] max-h-[85vh] overflow-y-auto">
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
                  ({ computerNumber, reservations: compReservations }) => {
                    const color = getComputerColor(computerNumber);
                    return (
                      <div
                        key={computerNumber}
                        className="border rounded-lg overflow-hidden"
                        style={{ borderLeftWidth: "4px", borderLeftColor: color }}
                      >
                        <div
                          className="px-4 py-2 font-semibold flex items-center gap-2"
                          style={{ backgroundColor: `${color}15` }}
                        >
                          <Monitor className="h-4 w-4" style={{ color }} />
                          <span>Computadora #{computerNumber}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {compReservations.length} reserva{compReservations.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                        <div className="divide-y">
                          {compReservations.map((reservation) => (
                            <div key={reservation._id} className="px-4 py-3 bg-white">
                              {/* Nombre del usuario - Prominente */}
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="font-semibold text-gray-900">
                                  {reservation.userName}
                                </span>
                                <Badge variant="outline" className="text-xs ml-auto">
                                  {USER_TYPE_LABELS[reservation.userType] || reservation.userType}
                                </Badge>
                              </div>
                              {/* Horario */}
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Clock className="h-3 w-3" />
                                <span className="font-medium">
                                  {formatTimeBlocksRange(reservation.timeBlocks)}
                                </span>
                              </div>
                              {/* Bloques horarios */}
                              <div className="flex flex-wrap gap-1">
                                {reservation.timeBlocks.map((block) => {
                                  const blockInfo = TIME_BLOCKS.find((b) => b.value === block);
                                  return (
                                    <Badge key={block} variant="secondary" className="text-xs">
                                      {blockInfo?.label || block}
                                    </Badge>
                                  );
                                })}
                              </div>
                              {/* Descripción si existe */}
                              {reservation.description && (
                                <p className="mt-2 text-sm text-gray-500 italic">
                                  {reservation.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}

                {getReservationsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No hay reservas para este día</p>
                    <p className="text-sm mt-1">Este día está completamente disponible</p>
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
