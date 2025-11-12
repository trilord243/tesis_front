"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ComputerSelector } from "./computer-selector";
import {
  UserType,
  Software,
  Purpose,
  CreateLabReservationDto,
  USER_TYPE_LABELS,
  SOFTWARE_LABELS,
  PURPOSE_LABELS,
} from "@/types/lab-reservation";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, CalendarDays } from "lucide-react";

interface LabReservationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function LabReservationForm({ onSuccess, onCancel }: LabReservationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [userType, setUserType] = useState<UserType | "">("");
  const [selectedSoftware, setSelectedSoftware] = useState<Software[]>([]);
  const [otherSoftware, setOtherSoftware] = useState("");
  const [purpose, setPurpose] = useState<Purpose | "">("");
  const [description, setDescription] = useState("");
  const [selectedComputerNumber, setSelectedComputerNumber] = useState<number | undefined>(undefined);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [calendarKey, setCalendarKey] = useState(0);
  const [existingReservations, setExistingReservations] = useState<string[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  const totalSteps = 6;

  // Cargar reservas existentes del usuario cuando llegue al paso 6
  useEffect(() => {
    if (currentStep === 6) {
      loadUserReservations();
    }
  }, [currentStep]);

  const loadUserReservations = async () => {
    setLoadingReservations(true);
    try {
      const response = await fetch('/api/lab-reservations/user');
      if (response.ok) {
        const reservations = await response.json();
        // Obtener solo las fechas de reservas pendientes o aprobadas
        const reservedDates = (reservations as Array<{ status: string; reservationDate: string }>)
          .filter((r) => r.status === 'pending' || r.status === 'approved')
          .map((r) => r.reservationDate);
        setExistingReservations(reservedDates);
      }
    } catch (err) {
      console.error('Error al cargar reservas:', err);
    } finally {
      setLoadingReservations(false);
    }
  };

  // Force calendar re-render when dates change and validate
  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) {
      setSelectedDates([]);
      setCalendarKey(prev => prev + 1);
      return;
    }

    // Verificar si alguna fecha ya está reservada
    const dateStrings = dates.map(d => d.toISOString().split('T')[0]);
    const alreadyReserved = dateStrings.filter(d => existingReservations.includes(d));

    if (alreadyReserved.length > 0) {
      const formattedDates = alreadyReserved.map(d => {
        const date = new Date(d + 'T12:00:00');
        return date.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }).join(', ');

      setError(`Ya tienes una reserva para: ${formattedDates}. Por favor selecciona otra fecha.`);

      // Remover las fechas ya reservadas de la selección
      const validDates = dates.filter(d => {
        const dateStr = d.toISOString().split('T')[0];
        return !existingReservations.includes(dateStr);
      });

      setSelectedDates(validDates);
    } else {
      setSelectedDates(dates);
      setError(null);
    }

    setCalendarKey(prev => prev + 1);
  };

  // Manejar selección de software
  const handleSoftwareToggle = (software: Software) => {
    setSelectedSoftware((prev) => {
      if (prev.includes(software)) {
        return prev.filter((s) => s !== software);
      } else {
        return [...prev, software];
      }
    });
  };

  // Validar paso actual
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return userType !== "";
      case 2:
        return selectedSoftware.length > 0 &&
               (!selectedSoftware.includes(Software.OTRO) || otherSoftware.trim().length > 0);
      case 3:
        return purpose !== "";
      case 4:
        return description.trim().length >= 20;
      case 5:
        return selectedComputerNumber !== undefined;
      case 6:
        return selectedDates.length > 0;
      default:
        return false;
    }
  };

  // Navegar entre pasos
  const goToNextStep = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (!canProceed() || !selectedComputerNumber || selectedDates.length === 0) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create a reservation for each selected date
      const reservationPromises = selectedDates.map(async (date) => {
        const reservationDate = date.toISOString().split('T')[0];

        const reservationData: CreateLabReservationDto = {
          userType: userType as UserType,
          software: selectedSoftware,
          ...(selectedSoftware.includes(Software.OTRO) && otherSoftware ? { otherSoftware } : {}),
          purpose: purpose as Purpose,
          description,
          computerNumber: selectedComputerNumber,
          reservationDate,
        };

        console.log('Enviando reserva:', reservationData);

        const response = await fetch("/api/lab-reservations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationData),
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', { status: response.status, data });

        if (!response.ok) {
          const errorMessage = data.message || data.error || `Error ${response.status}`;
          console.error('Error en reserva:', errorMessage, data);
          throw new Error(errorMessage);
        }

        return data;
      });

      // Wait for all reservations to be created
      await Promise.all(reservationPromises);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError(err instanceof Error ? err.message : "Error al enviar las solicitudes");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`flex items-center ${step < 6 ? "flex-1" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step < currentStep
                    ? "bg-green-500 text-white"
                    : step === currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step < currentStep ? <CheckCircle2 className="h-5 w-5" /> : step}
              </div>
              {step < 6 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    step < currentStep ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Paso {currentStep} de {totalSteps}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "Tipo de Usuario"}
            {currentStep === 2 && "Software Requerido"}
            {currentStep === 3 && "Propósito de Uso"}
            {currentStep === 4 && "Descripción del Proyecto"}
            {currentStep === 5 && "Seleccionar Computadora"}
            {currentStep === 6 && "Seleccionar Fecha"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Indica tu tipo de usuario"}
            {currentStep === 2 && "Selecciona el software que necesitarás usar"}
            {currentStep === 3 && "¿Para qué usarás las computadoras?"}
            {currentStep === 4 && "Describe tu proyecto o actividad (mínimo 20 caracteres)"}
            {currentStep === 5 && "Elige la computadora que mejor se adapte a tus necesidades"}
            {currentStep === 6 && "Selecciona el día que deseas reservar"}
          </CardDescription>
        </CardHeader>

        <CardContent className="min-h-[400px]">
          {/* Step 1: User Type */}
          {currentStep === 1 && (
            <RadioGroup value={userType} onValueChange={(value) => setUserType(value as UserType)}>
              <div className="space-y-3">
                {Object.values(UserType).map((type) => (
                  <div
                    key={type}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      userType === type ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setUserType(type)}
                  >
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="flex-1 cursor-pointer font-medium">
                      {USER_TYPE_LABELS[type]}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {/* Step 2: Software */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid gap-3">
                {Object.values(Software).map((software) => (
                  <div
                    key={software}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedSoftware.includes(software) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => handleSoftwareToggle(software)}
                  >
                    <Checkbox
                      checked={selectedSoftware.includes(software)}
                      onCheckedChange={() => handleSoftwareToggle(software)}
                    />
                    <Label className="flex-1 cursor-pointer font-medium">
                      {SOFTWARE_LABELS[software]}
                    </Label>
                  </div>
                ))}
              </div>

              {selectedSoftware.includes(Software.OTRO) && (
                <div className="space-y-2">
                  <Label htmlFor="otherSoftware">Especifica el software que necesitas</Label>
                  <Input
                    id="otherSoftware"
                    value={otherSoftware}
                    onChange={(e) => setOtherSoftware(e.target.value)}
                    placeholder="Ej: MATLAB, AutoCAD, etc."
                  />
                </div>
              )}

              {selectedSoftware.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-blue-50 rounded-lg">
                  <span className="font-medium">Seleccionados:</span>
                  {selectedSoftware.map((software) => (
                    <Badge key={software} variant="secondary">
                      {SOFTWARE_LABELS[software]}
                      {software === Software.OTRO && otherSoftware && `: ${otherSoftware}`}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Purpose */}
          {currentStep === 3 && (
            <RadioGroup value={purpose} onValueChange={(value) => setPurpose(value as Purpose)}>
              <div className="space-y-3">
                {Object.values(Purpose).map((p) => (
                  <div
                    key={p}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      purpose === p ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setPurpose(p)}
                  >
                    <RadioGroupItem value={p} id={p} />
                    <Label htmlFor={p} className="flex-1 cursor-pointer font-medium">
                      {PURPOSE_LABELS[p]}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {/* Step 4: Description */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">
                  Descripción detallada de tu proyecto o actividad
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe para qué necesitas usar las computadoras del laboratorio. Incluye detalles sobre tu proyecto, investigación o trabajo..."
                  rows={8}
                  className="resize-none"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Mínimo 20 caracteres
                  </span>
                  <span className={description.length >= 20 ? "text-green-600" : "text-red-600"}>
                    {description.length} / 20
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Computer Selection */}
          {currentStep === 5 && userType && (
            <ComputerSelector
              userType={userType as UserType}
              selectedComputerNumber={selectedComputerNumber}
              onSelect={setSelectedComputerNumber}
            />
          )}

          {/* Step 6: Date Selection */}
          {currentStep === 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-lg">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-6 w-6 text-blue-600 mt-1" />
                  <AlertDescription className="text-blue-900">
                    <div className="space-y-2">
                      <p className="font-bold text-lg">Selecciona uno o más días para tu reserva</p>
                      <p className="text-sm">Haz clic en los días deseados. Puedes seleccionar múltiples fechas para tu reserva.</p>
                      {loadingReservations && (
                        <p className="text-sm text-blue-600 flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Cargando tus reservas existentes...
                        </p>
                      )}
                      {!loadingReservations && existingReservations.length > 0 && (
                        <p className="text-sm text-orange-600 font-semibold">
                          ⚠️ Tienes {existingReservations.length} fecha(s) ya reservada(s). Estas fechas aparecen deshabilitadas en el calendario.
                        </p>
                      )}
                      {selectedComputerNumber && (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-2 mt-3 pt-3 border-t border-blue-300"
                        >
                          <span className="text-blue-700 font-semibold">Computadora seleccionada:</span>
                          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                            #{selectedComputerNumber}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </AlertDescription>
                </div>
              </Alert>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative w-full flex justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-2xl blur-xl" />
                <div className="relative flex justify-center p-8 md:p-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl border-2 border-blue-300 shadow-2xl w-full max-w-4xl">
                  <div className="lab-reservation-calendar w-full flex justify-center">
                    <div className="inline-block">
                    <Calendar
                      key={calendarKey}
                      mode="multiple"
                      selected={selectedDates}
                      onSelect={handleDateSelect}
                      disabled={(date) => {
                        // Deshabilitar fechas pasadas
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (date < today) return true;

                        // Deshabilitar días que no son Lunes (1), Martes (2), Miércoles (3), Jueves (4), Viernes (5)
                        const dayOfWeek = date.getDay(); // 0=Domingo, 1=Lunes, 2=Martes, etc.
                        const validDays = [1, 2, 3, 4, 5]; // Lunes, Martes, Miércoles, Jueves, Viernes
                        if (!validDays.includes(dayOfWeek)) return true;

                        // Deshabilitar fechas que el usuario ya tiene reservadas
                        const dateStr = date.toISOString().split('T')[0];
                        return existingReservations.includes(dateStr);
                      }}
                      className="rounded-xl border-0 w-full"
                      classNames={{
                        months: "w-full",
                        month: "w-full space-y-6",
                        caption: "flex justify-center pt-2 relative items-center mb-6",
                        caption_label: "text-2xl font-bold text-gray-800",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-12 w-12 bg-white hover:bg-blue-100 rounded-lg shadow-md p-0 opacity-80 hover:opacity-100 transition-all duration-200 border border-gray-300",
                        nav_button_previous: "absolute left-2",
                        nav_button_next: "absolute right-2",
                        table: "w-full border-separate",
                        head_row: "",
                        head_cell: "text-gray-700 font-bold text-base uppercase text-center p-3",
                        row: "",
                        cell: "text-center p-0",
                        day: "h-16 w-16 p-0 font-semibold text-lg hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-blue-300 cursor-pointer",
                        day_selected: "",
                        day_today: "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-900 font-bold border-2 border-orange-400",
                        day_outside: "text-gray-400 opacity-30",
                        day_disabled: "text-gray-300 opacity-20 cursor-not-allowed hover:bg-transparent hover:scale-100 hover:border-transparent line-through",
                        day_range_middle: "",
                        day_range_start: "",
                        day_range_end: "",
                        day_hidden: "invisible",
                      }}
                    />
                    </div>
                    <style jsx global>{`
                      /* Remove all table borders */
                      .lab-reservation-calendar table,
                      .lab-reservation-calendar thead,
                      .lab-reservation-calendar tbody,
                      .lab-reservation-calendar tr,
                      .lab-reservation-calendar th,
                      .lab-reservation-calendar td {
                        border: none !important;
                      }

                      /* Table styling */
                      .lab-reservation-calendar table {
                        border-spacing: 10px !important;
                        border-collapse: separate !important;
                      }

                      /* Center content in cells */
                      .lab-reservation-calendar td,
                      .lab-reservation-calendar th {
                        text-align: center !important;
                        vertical-align: middle !important;
                        padding: 0 !important;
                      }

                      /* Day buttons */
                      .lab-reservation-calendar button[name="day"] {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        margin: 0 auto !important;
                        position: relative !important;
                      }

                      /* Make entire button area clickable with pseudo-element */
                      .lab-reservation-calendar button[name="day"]::after {
                        content: '';
                        position: absolute;
                        top: -8px;
                        left: -8px;
                        right: -8px;
                        bottom: -8px;
                        cursor: pointer;
                      }

                      /* Remove any range selection styling that causes expansion */
                      .lab-reservation-calendar .rdp-day_range_start::before,
                      .lab-reservation-calendar .rdp-day_range_end::before,
                      .lab-reservation-calendar .rdp-day_range_middle::before,
                      .lab-reservation-calendar [aria-selected]::before,
                      .lab-reservation-calendar [aria-selected]::after {
                        display: none !important;
                      }

                      /* Selected dates - GREEN */
                      .lab-reservation-calendar button[name="day"][aria-selected="true"],
                      .lab-reservation-calendar button[aria-selected="true"],
                      .lab-reservation-calendar .rdp-day_selected,
                      .lab-reservation-calendar [aria-selected="true"],
                      .lab-reservation-calendar .rdp-button[aria-selected="true"] {
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
                        color: white !important;
                        font-weight: 700 !important;
                        box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.4), 0 4px 6px -2px rgba(16, 185, 129, 0.3) !important;
                        border: 3px solid #34d399 !important;
                        transform: scale(1.05) !important;
                        border-radius: 8px !important;
                      }

                      /* Hover state for selected dates */
                      .lab-reservation-calendar button[name="day"][aria-selected="true"]:hover,
                      .lab-reservation-calendar button[aria-selected="true"]:hover,
                      .lab-reservation-calendar .rdp-day_selected:hover,
                      .lab-reservation-calendar [aria-selected="true"]:hover {
                        background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
                        transform: scale(1.08) !important;
                      }
                    `}</style>
                  </div>
                </div>
              </motion.div>

              <AnimatePresence>
                {selectedDates.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl border-2 border-green-400 shadow-xl">
                      <div className="space-y-4">
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="flex items-center justify-between"
                        >
                          <h4 className="text-xl font-bold text-green-900 flex items-center gap-2">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                            {selectedDates.length} {selectedDates.length === 1 ? 'Fecha Seleccionada' : 'Fechas Seleccionadas'}
                          </h4>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedDates([])}
                            className="text-sm text-red-600 hover:text-red-800 font-semibold underline px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Limpiar todas
                          </motion.button>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <AnimatePresence>
                            {selectedDates
                              .sort((a, b) => a.getTime() - b.getTime())
                              .map((date, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, delay: index * 0.05 }}
                                  whileHover={{ scale: 1.03, y: -2 }}
                                  className="flex items-center justify-between bg-white p-4 rounded-xl border-2 border-green-500 shadow-md hover:shadow-lg transition-shadow"
                                >
                                  <span className="text-green-900 font-semibold flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-green-600" />
                                    {date.toLocaleDateString("es-ES", {
                                      weekday: "short",
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                  <motion.button
                                    whileHover={{ scale: 1.2, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setSelectedDates(selectedDates.filter((_, i) => i !== index))}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full w-7 h-7 flex items-center justify-center font-bold text-xl transition-colors"
                                  >
                                    ×
                                  </motion.button>
                                </motion.div>
                              ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={isSubmitting}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {onCancel && (
              <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                Cancelar
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button
                onClick={goToNextStep}
                disabled={!canProceed() || isSubmitting}
              >
                Siguiente
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Solicitud"
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
