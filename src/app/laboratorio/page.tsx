"use client";

import { useEffect, useState, useCallback } from "react";
import { format, addDays, startOfMonth, endOfMonth, isSameDay, isWeekend, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MetaverseReservation,
  METAVERSE_TIME_BLOCKS,
  METAVERSE_DAY_OPTIONS,
  METAVERSE_WEEKS_OPTIONS,
  METAVERSE_STATUS_COLORS,
  formatMetaverseTimeBlocksRange,
} from "@/types/metaverse-reservation";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Mail,
  Phone,
  Building2,
  Users,
  FileText,
  Target,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
  RefreshCw,
} from "lucide-react";

export default function LaboratorioPage() {
  // Estado del calendario
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [reservations, setReservations] = useState<MetaverseReservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Interface para el estado del formulario
  interface FormState {
    requesterName: string;
    requesterEmail: string;
    requesterPhone: string;
    organization: string;
    eventTitle: string;
    eventDescription: string;
    purpose: string;
    expectedAttendees: number | undefined;
    timeBlocks: string[];
    isRecurring: boolean;
    recurrenceWeeks: number;
    recurrenceDays: number[];
    reservationDate?: string;
  }

  // Estado del formulario
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    requesterName: "",
    requesterEmail: "",
    requesterPhone: "",
    organization: "",
    eventTitle: "",
    eventDescription: "",
    purpose: "",
    expectedAttendees: undefined,
    timeBlocks: [],
    isRecurring: false,
    recurrenceWeeks: 1,
    recurrenceDays: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Estado del evento seleccionado
  const [selectedEvent, setSelectedEvent] = useState<MetaverseReservation | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

  // Cargar disponibilidad y reservas
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = format(startOfMonth(currentMonth), "yyyy-MM-dd");
      const endDate = format(endOfMonth(addDays(currentMonth, 31)), "yyyy-MM-dd");

      // Cargar disponibilidad
      const availRes = await fetch(
        `/api/metaverse-reservations/availability?startDate=${startDate}&endDate=${endDate}`
      );
      if (availRes.ok) {
        const availData = await availRes.json();
        setAvailability(availData);
      }

      // Cargar reservas aprobadas
      const resRes = await fetch("/api/metaverse-reservations/approved");
      if (resRes.ok) {
        const resData = await resRes.json();
        setReservations(Array.isArray(resData) ? resData : []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Generar días del calendario
  const generateCalendarDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days: Date[] = [];

    // Añadir días vacíos al inicio
    const startDay = start.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push(addDays(start, -(startDay - i)));
    }

    // Añadir días del mes
    for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
      days.push(new Date(d));
    }

    // Completar la última semana
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push(addDays(end, i));
      }
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Obtener reserva de un día
  const getReservationForDate = (date: Date): MetaverseReservation | undefined => {
    const dateStr = format(date, "yyyy-MM-dd");
    return reservations.find((r) => r.reservationDate === dateStr);
  };

  // Verificar si un día está disponible
  const isDateAvailable = (date: Date): boolean => {
    const dateStr = format(date, "yyyy-MM-dd");
    const today = startOfDay(new Date());

    if (isBefore(date, today)) return false;
    if (isWeekend(date)) return false;

    return availability[dateStr] !== false;
  };

  // Manejar click en día
  const handleDayClick = (date: Date) => {
    const reservation = getReservationForDate(date);

    if (reservation) {
      setSelectedEvent(reservation);
      setShowEventDialog(true);
    } else if (isDateAvailable(date)) {
      setSelectedDate(date);
      setFormData((prev) => ({
        ...prev,
        reservationDate: format(date, "yyyy-MM-dd"),
      }));
      setShowForm(true);
    }
  };

  // Manejar cambio de bloques horarios
  const handleBlockToggle = (block: string) => {
    setFormData((prev) => {
      const currentBlocks = prev.timeBlocks || [];
      const newBlocks = currentBlocks.includes(block)
        ? currentBlocks.filter((b) => b !== block)
        : [...currentBlocks, block];
      return { ...prev, timeBlocks: newBlocks };
    });
  };

  // Manejar cambio de días de recurrencia
  const handleRecurrenceDayToggle = (day: number) => {
    setFormData((prev) => {
      const currentDays = prev.recurrenceDays || [];
      const newDays = currentDays.includes(day)
        ? currentDays.filter((d) => d !== day)
        : [...currentDays, day];
      return { ...prev, recurrenceDays: newDays };
    });
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/metaverse-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          reservationDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : formData.reservationDate,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al crear la reserva");
      }

      setSubmitSuccess(true);
      setShowForm(false);
      loadData();

      // Reset form
      setFormData({
        requesterName: "",
        requesterEmail: "",
        requesterPhone: "",
        organization: "",
        eventTitle: "",
        eventDescription: "",
        purpose: "",
        expectedAttendees: undefined,
        timeBlocks: [],
        isRecurring: false,
        recurrenceWeeks: 1,
        recurrenceDays: [],
      });
      setSelectedDate(null);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Error al crear la reserva");
    } finally {
      setSubmitting(false);
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
                      Laboratorio de Metaverso
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Centro Mundo X - Reserva el laboratorio para eventos y experiencias inmersivas
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
          {/* Success Alert */}
          {submitSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Solicitud enviada correctamente.</strong> Tu reserva está pendiente de aprobación.
                Te notificaremos por email cuando sea revisada.
              </AlertDescription>
            </Alert>
          )}

          {/* Info Alert */}
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Cómo reservar:</strong> Selecciona un día disponible (verde) en el calendario
              para solicitar una reserva del laboratorio. Los días con eventos aprobados aparecen en naranja.
              Solo se permite una reserva por día.
            </AlertDescription>
          </Alert>

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
                      const available = isDateAvailable(date);
                      const isPast = isBefore(date, startOfDay(new Date()));
                      const weekend = isWeekend(date);

                      return (
                        <button
                          key={index}
                          onClick={() => handleDayClick(date)}
                          disabled={!isCurrentMonth || isPast || weekend}
                          className={`
                            p-2 h-20 text-sm rounded-lg border transition-all
                            ${!isCurrentMonth ? "bg-gray-50 text-gray-300" : ""}
                            ${isToday ? "ring-2 ring-blue-500" : ""}
                            ${reservation && isCurrentMonth ? "bg-orange-100 border-orange-300 hover:bg-orange-200" : ""}
                            ${!reservation && available && isCurrentMonth && !isPast ? "bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer" : ""}
                            ${(isPast || weekend) && isCurrentMonth ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
                            ${!reservation && !available && isCurrentMonth && !isPast && !weekend ? "bg-red-50 border-red-200" : ""}
                          `}
                        >
                          <div className="flex flex-col h-full">
                            <span className={`font-medium ${isToday ? "text-blue-600" : ""}`}>
                              {format(date, "d")}
                            </span>
                            {reservation && isCurrentMonth && (
                              <div className="mt-1 text-xs text-orange-700 truncate">
                                {reservation.eventTitle}
                              </div>
                            )}
                            {!reservation && available && isCurrentMonth && !isPast && !weekend && (
                              <div className="mt-1 text-xs text-green-600">Disponible</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Leyenda */}
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
                      <span className="text-sm">Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300" />
                      <span className="text-sm">Evento programado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300" />
                      <span className="text-sm">No disponible</span>
                    </div>
                  </div>
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
                              Aprobado
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

              {/* Info del laboratorio */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Información del Laboratorio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">Horarios Disponibles</h4>
                    <ul className="text-gray-600 space-y-1">
                      {METAVERSE_TIME_BLOCKS.map((block) => (
                        <li key={block.value}>
                          {block.label}: {block.startTime} - {block.endTime}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Días de Operación</h4>
                    <p className="text-gray-600">Lunes a Viernes</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Capacidad</h4>
                    <p className="text-gray-600">9 estaciones de trabajo + área de metaverso</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Modal de formulario de reserva */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Solicitar Reserva del Laboratorio</DialogTitle>
              <DialogDescription>
                {selectedDate && (
                  <span>
                    Fecha seleccionada:{" "}
                    <strong>
                      {format(selectedDate, "EEEE, d 'de' MMMM yyyy", { locale: es })}
                    </strong>
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información del solicitante */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Información del Solicitante</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requesterName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nombre completo *
                    </Label>
                    <Input
                      id="requesterName"
                      value={formData.requesterName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, requesterName: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requesterEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="requesterEmail"
                      type="email"
                      value={formData.requesterEmail}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, requesterEmail: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requesterPhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Teléfono
                    </Label>
                    <Input
                      id="requesterPhone"
                      value={formData.requesterPhone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, requesterPhone: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Organización
                    </Label>
                    <Input
                      id="organization"
                      placeholder="Universidad, empresa, etc."
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, organization: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Información del evento */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Información del Evento</h3>

                <div className="space-y-2">
                  <Label htmlFor="eventTitle" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Título del evento *
                  </Label>
                  <Input
                    id="eventTitle"
                    placeholder="Ej: Taller de Realidad Virtual"
                    value={formData.eventTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, eventTitle: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDescription">Descripción del evento *</Label>
                  <Textarea
                    id="eventDescription"
                    placeholder="Describe brevemente las actividades que se realizarán..."
                    value={formData.eventDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, eventDescription: e.target.value }))
                    }
                    required
                    rows={3}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purpose" className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Propósito/Razón *
                    </Label>
                    <Input
                      id="purpose"
                      placeholder="Ej: Educación, investigación, demostración"
                      value={formData.purpose}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, purpose: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedAttendees" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Asistentes esperados
                    </Label>
                    <Input
                      id="expectedAttendees"
                      type="number"
                      min="1"
                      placeholder="Número de personas"
                      value={formData.expectedAttendees || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          expectedAttendees: e.target.value ? parseInt(e.target.value) : undefined,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Bloques horarios */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Horario</h3>

                <div className="space-y-2">
                  <Label>Selecciona los bloques horarios *</Label>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {METAVERSE_TIME_BLOCKS.map((block) => (
                      <div
                        key={block.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.timeBlocks?.includes(block.value)
                            ? "bg-blue-100 border-blue-500"
                            : "bg-white hover:bg-gray-50"
                        }`}
                        onClick={() => handleBlockToggle(block.value)}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={formData.timeBlocks?.includes(block.value)}
                            onCheckedChange={() => handleBlockToggle(block.value)}
                          />
                          <div>
                            <div className="font-medium text-sm">{block.label}</div>
                            <div className="text-xs text-gray-500">
                              {block.startTime} - {block.endTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recurrencia */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Recurrencia (Opcional)</h3>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isRecurring: checked as boolean }))
                    }
                  />
                  <Label htmlFor="isRecurring">
                    Reserva recurrente (repetir semanalmente)
                  </Label>
                </div>

                {formData.isRecurring && (
                  <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                    <div className="space-y-2">
                      <Label>Duración</Label>
                      <Select
                        value={String(formData.recurrenceWeeks)}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, recurrenceWeeks: parseInt(value) }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {METAVERSE_WEEKS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={String(option.value)}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Días de la semana</Label>
                      <div className="flex flex-wrap gap-2">
                        {METAVERSE_DAY_OPTIONS.map((day) => (
                          <div
                            key={day.value}
                            className={`px-3 py-2 border rounded-lg cursor-pointer transition-all ${
                              formData.recurrenceDays?.includes(day.value)
                                ? "bg-blue-100 border-blue-500"
                                : "bg-white hover:bg-gray-50"
                            }`}
                            onClick={() => handleRecurrenceDayToggle(day.value)}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={formData.recurrenceDays?.includes(day.value)}
                                onCheckedChange={() => handleRecurrenceDayToggle(day.value)}
                              />
                              <span className="text-sm">{day.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {submitError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              {/* Botones */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || (formData.timeBlocks?.length || 0) === 0}
                  style={{ backgroundColor: "#FF8200" }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Solicitud"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de detalle de evento */}
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent?.eventTitle}</DialogTitle>
              <DialogDescription>Detalles del evento</DialogDescription>
            </DialogHeader>

            {selectedEvent && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={METAVERSE_STATUS_COLORS[selectedEvent.status]}>
                    Aprobado
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

                <div className="pt-3 border-t">
                  <h4 className="font-semibold mb-2">Propósito</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.purpose}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
