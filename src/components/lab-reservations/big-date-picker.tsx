"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  isWeekend,
  isBefore,
  startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  X,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BigDatePickerProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  disabledDates?: Date[];
  minDate?: Date;
  allowWeekends?: boolean;
}

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function BigDatePicker({
  selectedDates,
  onDatesChange,
  disabledDates = [],
  minDate,
  allowWeekends = false,
}: BigDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generar días del mes actual con padding para la cuadrícula
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Calcular días de padding al inicio (lunes = 0, domingo = 6)
    let startPadding = getDay(monthStart) - 1;
    if (startPadding < 0) startPadding = 6; // Domingo

    // Agregar días vacíos al inicio
    const paddedDays: (Date | null)[] = Array(startPadding).fill(null);
    paddedDays.push(...days);

    // Completar la última semana si es necesario
    while (paddedDays.length % 7 !== 0) {
      paddedDays.push(null);
    }

    return paddedDays;
  }, [currentMonth]);

  // Verificar si una fecha está deshabilitada
  const isDateDisabled = (date: Date): boolean => {
    const today = startOfDay(new Date());
    const dateToCheck = startOfDay(date);

    // Fecha pasada
    if (isBefore(dateToCheck, minDate ? startOfDay(minDate) : today)) {
      return true;
    }

    // Fines de semana (si no están permitidos)
    if (!allowWeekends && isWeekend(date)) {
      return true;
    }

    // Fechas deshabilitadas externamente
    return disabledDates.some((d) => isSameDay(d, date));
  };

  // Verificar si una fecha está seleccionada
  const isDateSelected = (date: Date): boolean => {
    return selectedDates.some((d) => isSameDay(d, date));
  };

  // Manejar clic en una fecha
  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (isDateSelected(date)) {
      onDatesChange(selectedDates.filter((d) => !isSameDay(d, date)));
    } else {
      onDatesChange([...selectedDates, date].sort((a, b) => a.getTime() - b.getTime()));
    }
  };

  // Quitar una fecha específica
  const removeDate = (date: Date) => {
    onDatesChange(selectedDates.filter((d) => !isSameDay(d, date)));
  };

  // Navegar entre meses
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="space-y-6">
      {/* Calendario - Ancho completo */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md overflow-hidden">
        {/* Header del calendario con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousMonth}
              className="text-white hover:bg-white/20 h-10 w-10 p-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <h3 className="text-xl font-bold text-white capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </h3>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextMonth}
              className="text-white hover:bg-white/20 h-10 w-10 p-0"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={cn(
                "py-4 text-center text-base font-semibold",
                index >= 5 ? "text-gray-400" : "text-gray-700"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Cuadrícula de días */}
        <div className="grid grid-cols-7 p-4 gap-2">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const isCurrentMonth = isSameMonth(date, currentMonth);
            const isToday = isSameDay(date, new Date());
            const isDisabled = isDateDisabled(date);
            const isSelected = isDateSelected(date);

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => handleDateClick(date)}
                disabled={isDisabled}
                className={cn(
                  "aspect-square rounded-xl text-base font-medium transition-all flex items-center justify-center",
                  !isCurrentMonth && "text-gray-300",
                  isCurrentMonth && !isDisabled && !isSelected && "text-gray-900 hover:bg-blue-50 hover:text-blue-700",
                  isDisabled && "text-gray-300 cursor-not-allowed bg-gray-50",
                  isToday && !isSelected && "bg-blue-100 text-blue-700 font-bold ring-2 ring-blue-300",
                  isSelected && "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                )}
              >
                {format(date, "d")}
              </button>
            );
          })}
        </div>

        {/* Leyenda dentro del calendario */}
        <div className="px-6 py-4 border-t bg-gray-50 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-100 ring-2 ring-blue-300" />
            <span>Hoy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-600" />
            <span>Seleccionado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gray-200" />
            <span>No disponible</span>
          </div>
        </div>
      </div>

      {/* Fechas seleccionadas - Mejorado */}
      {selectedDates.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CalendarDays className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <span className="font-bold text-green-800 text-base">
                  {selectedDates.length} fecha{selectedDates.length !== 1 ? "s" : ""} seleccionada{selectedDates.length !== 1 ? "s" : ""}
                </span>
                <p className="text-xs text-green-600">Haz clic en una fecha para quitarla</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onDatesChange([])}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
            >
              Limpiar todo
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedDates.map((date) => (
              <Badge
                key={date.toISOString()}
                variant="secondary"
                className="bg-white text-green-800 hover:bg-green-100 px-3 py-2 text-sm font-medium flex items-center gap-2 shadow-sm border border-green-200"
              >
                {format(date, "EEE d 'de' MMM", { locale: es })}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDate(date);
                  }}
                  className="hover:bg-red-100 rounded-full p-1 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-red-500" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
