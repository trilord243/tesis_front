"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Repeat, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  DAY_OPTIONS,
  WEEKS_OPTIONS,
  RecurrencePattern,
} from "@/types/lab-reservation";

type ReservationMode = "single" | "recurring";

interface RecurrenceSelectorProps {
  mode: ReservationMode;
  onModeChange: (mode: ReservationMode) => void;
  // Para modo single
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  // Para modo recurring
  recurrence: RecurrencePattern | null;
  onRecurrenceChange: (recurrence: RecurrencePattern | null) => void;
  // Restricciones
  disabledDates?: Date[];
}

export function RecurrenceSelector({
  mode,
  onModeChange,
  selectedDates,
  onDatesChange,
  recurrence,
  onRecurrenceChange,
  disabledDates = [],
}: RecurrenceSelectorProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    recurrence?.startDate ? new Date(recurrence.startDate) : undefined
  );

  const handleModeChange = (newMode: ReservationMode) => {
    onModeChange(newMode);
    if (newMode === "single") {
      onRecurrenceChange(null);
    } else {
      onDatesChange([]);
    }
  };

  const handleDayToggle = (day: number) => {
    if (!recurrence) {
      onRecurrenceChange({
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
        daysOfWeek: [day],
        numberOfWeeks: 1,
      });
      return;
    }

    const currentDays = recurrence.daysOfWeek as number[];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort((a, b) => a - b);

    onRecurrenceChange({
      ...recurrence,
      daysOfWeek: newDays,
    });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      onRecurrenceChange({
        startDate: format(date, "yyyy-MM-dd"),
        daysOfWeek: recurrence?.daysOfWeek ?? [],
        numberOfWeeks: recurrence?.numberOfWeeks ?? 1,
      });
    }
  };

  const handleWeeksChange = (weeks: string) => {
    if (!recurrence) return;
    onRecurrenceChange({
      ...recurrence,
      numberOfWeeks: parseInt(weeks),
    });
  };

  const handleDateSelect = (dates: Date[] | undefined) => {
    onDatesChange(dates ?? []);
  };

  // Función para verificar si una fecha está deshabilitada
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Solo días de semana (Lun-Vie)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return true;

    // Verificar fechas deshabilitadas externamente
    return disabledDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleModeChange("single")}
          className={cn(
            "flex-1 gap-2",
            mode === "single" && "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          )}
        >
          <CalendarDays className="h-4 w-4" />
          Fechas Específicas
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleModeChange("recurring")}
          className={cn(
            "flex-1 gap-2",
            mode === "recurring" && "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          )}
        >
          <Repeat className="h-4 w-4" />
          Patrón Semanal
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "single" ? (
          <motion.div
            key="single"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <p className="text-sm text-gray-600">
              Selecciona una o más fechas específicas para tu reserva.
            </p>

            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-xl border shadow-sm">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                  locale={es}
                  className="rounded-md"
                />
              </div>
            </div>

            {selectedDates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-green-50 rounded-xl border border-green-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">
                    {selectedDates.length} fecha(s) seleccionada(s)
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onDatesChange([])}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Limpiar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDates
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((date, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {format(date, "EEE d MMM", { locale: es })}
                      </span>
                    ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="recurring"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <p className="text-sm text-gray-600">
              Configura un patrón semanal para reservar automáticamente los
              mismos días cada semana.
            </p>

            {/* Start Date */}
            <div className="space-y-2">
              <Label>Fecha de inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate
                      ? format(startDate, "PPP", { locale: es })
                      : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateChange}
                    disabled={isDateDisabled}
                    locale={es}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Days of Week */}
            <div className="space-y-2">
              <Label>Días de la semana</Label>
              <div className="flex gap-2 flex-wrap">
                {DAY_OPTIONS.map((day) => {
                  const isSelected = recurrence?.daysOfWeek.includes(day.value);
                  return (
                    <Button
                      key={day.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDayToggle(day.value)}
                      className={cn(
                        "min-w-[70px]",
                        isSelected && "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      )}
                    >
                      {day.shortLabel}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Number of Weeks */}
            <div className="space-y-2">
              <Label>Duración</Label>
              <Select
                value={recurrence?.numberOfWeeks.toString() ?? "1"}
                onValueChange={handleWeeksChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona duración" />
                </SelectTrigger>
                <SelectContent>
                  {WEEKS_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            {recurrence &&
              recurrence.startDate &&
              recurrence.daysOfWeek.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Repeat className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">
                      Resumen del patrón
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Reservar cada{" "}
                    <span className="font-semibold">
                      {recurrence.daysOfWeek
                        .map((d) => DAY_OPTIONS.find((o) => o.value === d)?.label)
                        .join(", ")}
                    </span>{" "}
                    durante{" "}
                    <span className="font-semibold">
                      {recurrence.numberOfWeeks} semana
                      {recurrence.numberOfWeeks > 1 ? "s" : ""}
                    </span>{" "}
                    a partir del{" "}
                    <span className="font-semibold">
                      {format(new Date(recurrence.startDate), "d 'de' MMMM", {
                        locale: es,
                      })}
                    </span>
                  </p>
                </motion.div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
