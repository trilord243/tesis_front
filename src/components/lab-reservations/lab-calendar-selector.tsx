"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TimeBlock,
  DayOfWeek,
  TimeSlot,
  TIME_BLOCKS,
  VALID_DAYS,
  AvailabilityResponse,
} from "@/types/lab-reservation";
import { AlertCircle, Calendar as CalendarIcon, Clock } from "lucide-react";

interface LabCalendarSelectorProps {
  selectedSlots: TimeSlot[];
  onSlotsChange: (slots: TimeSlot[]) => void;
}

export function LabCalendarSelector({ selectedSlots, onSlotsChange }: LabCalendarSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState<TimeBlock[]>([]);

  // Función para verificar si un día es válido (lunes, martes, miércoles, jueves, viernes)
  const isValidDay = (date: Date): boolean => {
    const dayIndex = date.getDay();
    // 0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado
    return dayIndex === 1 || dayIndex === 2 || dayIndex === 3 || dayIndex === 4 || dayIndex === 5;
  };

  // Función para obtener el nombre del día de la semana
  const getDayOfWeek = (date: Date): DayOfWeek | undefined => {
    const dayIndex = date.getDay();
    const dayMap: Record<number, DayOfWeek> = {
      1: DayOfWeek.LUNES,
      2: DayOfWeek.MARTES,
      3: DayOfWeek.MIERCOLES,
      4: DayOfWeek.JUEVES,
      5: DayOfWeek.VIERNES,
    };
    return dayMap[dayIndex];
  };

  // Función para formatear fecha a YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0] || date.toISOString();
  };

  // Cargar disponibilidad cuando se selecciona una fecha
  useEffect(() => {
    if (selectedDate && isValidDay(selectedDate)) {
      loadAvailability(formatDate(selectedDate));
    } else {
      setAvailability(null);
      setSelectedBlocks([]);
    }
  }, [selectedDate]);

  // Cargar disponibilidad desde el API
  const loadAvailability = async (date: string) => {
    setLoadingAvailability(true);
    try {
      const response = await fetch(`/api/lab-reservations/availability/${date}`);
      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error("Error loading availability:", error);
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Verificar si un bloque está disponible
  const isBlockAvailable = (block: TimeBlock): boolean => {
    // If no availability data, assume available
    if (!availability) return true;
    // Find the block in the availability data
    const blockInfo = availability.blocks.find(b => b.block === block);
    // If block not found or has available computers, it's available
    return !blockInfo || blockInfo.availableComputers.length > 0;
  };

  // Manejar selección de bloque
  const handleBlockToggle = (block: TimeBlock) => {
    if (!isBlockAvailable(block)) return; // No permitir selección si no está disponible

    setSelectedBlocks((prev) => {
      const isSelected = prev.includes(block);
      if (isSelected) {
        return prev.filter((b) => b !== block);
      } else {
        // Verificar que no se excedan 2 bloques
        if (prev.length >= 2) {
          alert("Solo puedes seleccionar máximo 2 bloques por día");
          return prev;
        }
        return [...prev, block];
      }
    });
  };

  // Agregar fecha y bloques seleccionados a la lista
  const handleAddSlot = () => {
    if (!selectedDate || selectedBlocks.length === 0) {
      alert("Debes seleccionar al menos un bloque");
      return;
    }

    const dateStr = formatDate(selectedDate);
    const dayOfWeek = getDayOfWeek(selectedDate);

    if (!dayOfWeek) {
      return; // No es un día válido
    }

    // Verificar si ya existe un slot para esta fecha
    const existingSlotIndex = selectedSlots.findIndex((s) => s.date === dateStr);

    if (existingSlotIndex >= 0) {
      // Actualizar slot existente
      const updatedSlots = [...selectedSlots];
      updatedSlots[existingSlotIndex] = {
        date: dateStr,
        dayOfWeek,
        blocks: [...selectedBlocks],
      };
      onSlotsChange(updatedSlots);
    } else {
      // Agregar nuevo slot
      onSlotsChange([
        ...selectedSlots,
        {
          date: dateStr,
          dayOfWeek,
          blocks: [...selectedBlocks],
        },
      ]);
    }

    // Limpiar selección
    setSelectedDate(undefined);
    setSelectedBlocks([]);
    setAvailability(null);
  };

  // Remover un slot de la lista
  const handleRemoveSlot = (date: string) => {
    onSlotsChange(selectedSlots.filter((s) => s.date !== date));
  };

  return (
    <div className="space-y-6">
      {/* Alerta de días válidos */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Días permitidos:</strong> Solo puedes reservar los días{" "}
          <span className="font-bold">Lunes, Martes, Miércoles, Jueves y Viernes</span>.
          Los fines de semana no están disponibles.
        </AlertDescription>
      </Alert>

      {/* Calendario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Selecciona un Día
          </CardTitle>
          <CardDescription>
            Usa las flechas para navegar entre meses. Los días deshabilitados aparecen en gris.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || !isValidDay(date);
            }}
            className="rounded-md border shadow-sm"
          />
        </CardContent>
      </Card>

      {/* Selección de Bloques */}
      {selectedDate && isValidDay(selectedDate) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Bloques Horarios - {selectedDate.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </CardTitle>
            <CardDescription>
              Selecciona hasta 2 bloques para este día (cada bloque es de 1 hora 45 minutos)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingAvailability ? (
              <div className="text-center py-4 text-muted-foreground">
                Cargando disponibilidad...
              </div>
            ) : (
              <>
                <div className="grid gap-3">
                  {TIME_BLOCKS.map((timeBlock) => {
                    const available = isBlockAvailable(timeBlock.value);
                    const isSelected = selectedBlocks.includes(timeBlock.value);

                    return (
                      <div
                        key={timeBlock.value}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                          !available
                            ? "bg-red-50 border-red-200 opacity-60 cursor-not-allowed"
                            : isSelected
                            ? "bg-blue-50 border-blue-500"
                            : "border-gray-200 hover:border-blue-300 cursor-pointer"
                        }`}
                        onClick={() => available && handleBlockToggle(timeBlock.value)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            disabled={!available}
                            onCheckedChange={() => handleBlockToggle(timeBlock.value)}
                          />
                          <div>
                            <Label className="font-semibold cursor-pointer">
                              {timeBlock.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {timeBlock.startTime} - {timeBlock.endTime}
                            </p>
                          </div>
                        </div>
                        <div>
                          {!available ? (
                            <Badge variant="destructive">No Disponible</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                              Disponible
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedBlocks.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Has seleccionado {selectedBlocks.length} bloque(s).
                      {selectedBlocks.length === 2 && " (Máximo alcanzado)"}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleAddSlot}
                  disabled={selectedBlocks.length === 0}
                  className="w-full"
                >
                  Agregar Día y Bloques
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lista de Slots Seleccionados */}
      {selectedSlots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Tu Reserva</CardTitle>
            <CardDescription>
              {selectedSlots.length} día(s) seleccionado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedSlots.map((slot) => {
                const date = new Date(slot.date + "T12:00:00");
                return (
                  <div
                    key={slot.date}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">
                        {date.toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {slot.blocks.map((block) => {
                          const blockInfo = TIME_BLOCKS.find((tb) => tb.value === block);
                          return (
                            <Badge key={block} variant="secondary">
                              {blockInfo?.label}: {blockInfo?.startTime} - {blockInfo?.endTime}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSlot(slot.date)}
                    >
                      Eliminar
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
