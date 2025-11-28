"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Monitor,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RecurrencePattern,
  TIME_BLOCKS,
  formatTimeBlocksRange,
  calculateTotalDuration,
} from "@/types/lab-reservation";

interface GeneratedDate {
  date: string; // YYYY-MM-DD
  dayName: string;
  formattedDate: string;
}

interface ReservationPreviewProps {
  // Modo
  mode: "single" | "recurring";
  // Fechas específicas (modo single)
  selectedDates?: Date[];
  // Patrón recurrente (modo recurring)
  recurrence?: RecurrencePattern | null;
  // Datos de la reserva
  computerNumber: number;
  timeBlocks: string[];
  // Callbacks
  onRemoveDate?: (dateStr: string) => void;
}

export function ReservationPreview({
  mode,
  selectedDates = [],
  recurrence,
  computerNumber,
  timeBlocks,
  onRemoveDate,
}: ReservationPreviewProps) {
  // Generar las fechas basadas en el modo
  const generatedDates = useMemo((): GeneratedDate[] => {
    if (mode === "single") {
      return selectedDates
        .sort((a, b) => a.getTime() - b.getTime())
        .map((date) => ({
          date: format(date, "yyyy-MM-dd"),
          dayName: format(date, "EEEE", { locale: es }),
          formattedDate: format(date, "d 'de' MMMM yyyy", { locale: es }),
        }));
    }

    // Modo recurring - expandir el patrón
    if (!recurrence || !recurrence.startDate || recurrence.daysOfWeek.length === 0) {
      return [];
    }

    const dates: GeneratedDate[] = [];
    const start = new Date(recurrence.startDate);
    const weekStart = startOfWeek(start, { weekStartsOn: 1 }); // Lunes

    for (let week = 0; week < recurrence.numberOfWeeks; week++) {
      const currentWeekStart = addWeeks(weekStart, week);

      for (const dayOfWeek of recurrence.daysOfWeek) {
        // dayOfWeek: 1=Lunes, 5=Viernes
        const date = addDays(currentWeekStart, dayOfWeek - 1);

        // Solo incluir si la fecha es >= fecha de inicio
        if (date >= start) {
          dates.push({
            date: format(date, "yyyy-MM-dd"),
            dayName: format(date, "EEEE", { locale: es }),
            formattedDate: format(date, "d 'de' MMMM yyyy", { locale: es }),
          });
        }
      }
    }

    return dates.sort((a, b) => a.date.localeCompare(b.date));
  }, [mode, selectedDates, recurrence]);

  const timeBlocksLabel = formatTimeBlocksRange(timeBlocks);
  const totalDuration = calculateTotalDuration(timeBlocks);
  const totalReservations = generatedDates.length;

  if (generatedDates.length === 0) {
    return (
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          No hay fechas seleccionadas. Por favor selecciona al menos una fecha
          para tu reserva.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Summary */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="space-y-1">
          <h4 className="font-semibold text-blue-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Se crearán {totalReservations} reserva
            {totalReservations > 1 ? "s" : ""}
          </h4>
          <div className="flex items-center gap-4 text-sm text-blue-700">
            <span className="flex items-center gap-1">
              <Monitor className="h-4 w-4" />
              PC #{computerNumber}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {timeBlocksLabel} ({totalDuration})
            </span>
          </div>
        </div>
      </div>

      {/* Selected Time Blocks */}
      <div className="flex flex-wrap gap-2">
        {timeBlocks.sort().map((block) => {
          const blockInfo = TIME_BLOCKS.find((b) => b.value === block);
          return (
            <span
              key={block}
              className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1"
            >
              <Clock className="h-3 w-3" />
              {blockInfo ? `${blockInfo.startTime} - ${blockInfo.endTime}` : block}
            </span>
          );
        })}
      </div>

      {/* Dates List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        <AnimatePresence>
          {generatedDates.map((dateInfo, index) => (
            <motion.div
              key={dateInfo.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.03 }}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                "bg-white hover:bg-gray-50 transition-colors"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {dateInfo.date.split("-")[2]}
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {dateInfo.dayName}
                  </p>
                  <p className="text-sm text-gray-500">{dateInfo.formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 hidden sm:block">
                  {timeBlocksLabel}
                </span>
                {onRemoveDate && mode === "single" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveDate(dateInfo.date)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Total Summary */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total de tiempo reservado:</span>
          <span className="font-bold text-blue-600">
            {totalReservations} día{totalReservations > 1 ? "s" : ""} ×{" "}
            {totalDuration} = {calculateTotalMinutes(timeBlocks, totalReservations)}
          </span>
        </div>
      </div>

      {mode === "recurring" && recurrence && (
        <Alert className="bg-blue-50 border-blue-200">
          <Calendar className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Nota:</strong> Todas las reservas del patrón recurrente
            compartirán el mismo grupo. El administrador podrá aprobarlas
            individualmente o todas juntas.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function calculateTotalMinutes(blocks: string[], days: number): string {
  const minutesPerBlock = 105; // 1h 45min
  const totalMinutes = blocks.length * minutesPerBlock * days;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours >= 24) {
    const fullDays = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0 && minutes === 0) {
      return `${fullDays}d`;
    }
    return `${fullDays}d ${remainingHours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}min`;
}
