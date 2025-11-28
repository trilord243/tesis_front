"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ComputerSelector } from "./computer-selector";
import { TimeBlockSelector } from "./time-block-selector";
import { RecurrenceSelector } from "./recurrence-selector";
import { ReservationPreview } from "./reservation-preview";
import {
  UserType,
  Software,
  Purpose,
  CreateLabReservationDto,
  RecurrencePattern,
  USER_TYPE_LABELS,
  SOFTWARE_LABELS,
  PURPOSE_LABELS,
} from "@/types/lab-reservation";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  CalendarDays,
} from "lucide-react";

interface LabReservationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

type ReservationMode = "single" | "recurring";

export function LabReservationForm({
  onSuccess,
  onCancel,
}: LabReservationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data - Basic info
  const [userType, setUserType] = useState<UserType | "">("");
  const [selectedSoftware, setSelectedSoftware] = useState<Software[]>([]);
  const [otherSoftware, setOtherSoftware] = useState("");
  const [purpose, setPurpose] = useState<Purpose | "">("");
  const [description, setDescription] = useState("");

  // Form data - Reservation details
  const [selectedComputerNumber, setSelectedComputerNumber] = useState<
    number | undefined
  >(undefined);
  const [selectedTimeBlocks, setSelectedTimeBlocks] = useState<string[]>([]);

  // Form data - Dates/Recurrence
  const [reservationMode, setReservationMode] =
    useState<ReservationMode>("single");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [recurrence, setRecurrence] = useState<RecurrencePattern | null>(null);

  // Existing reservations
  const [existingReservations, setExistingReservations] = useState<string[]>(
    []
  );
  const [loadingReservations, setLoadingReservations] = useState(false);

  const totalSteps = 7;

  // Load user's existing reservations when reaching step 7
  useEffect(() => {
    if (currentStep === 7) {
      loadUserReservations();
    }
  }, [currentStep]);

  const loadUserReservations = async () => {
    setLoadingReservations(true);
    try {
      const response = await fetch("/api/lab-reservations/user");
      if (response.ok) {
        const reservations = await response.json();
        const reservedDates = (
          reservations as Array<{ status: string; reservationDate: string }>
        )
          .filter((r) => r.status === "pending" || r.status === "approved")
          .map((r) => r.reservationDate);
        setExistingReservations(reservedDates);
      }
    } catch (err) {
      console.error("Error al cargar reservas:", err);
    } finally {
      setLoadingReservations(false);
    }
  };

  // Handle software toggle
  const handleSoftwareToggle = (software: Software) => {
    setSelectedSoftware((prev) => {
      if (prev.includes(software)) {
        return prev.filter((s) => s !== software);
      } else {
        return [...prev, software];
      }
    });
  };

  // Handle date removal in preview
  const handleRemoveDate = (dateStr: string) => {
    setSelectedDates((prev) =>
      prev.filter((d) => format(d, "yyyy-MM-dd") !== dateStr)
    );
  };

  // Validate current step
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return userType !== "";
      case 2:
        return (
          selectedSoftware.length > 0 &&
          (!selectedSoftware.includes(Software.OTRO) ||
            otherSoftware.trim().length > 0)
        );
      case 3:
        return purpose !== "";
      case 4:
        return description.trim().length >= 20;
      case 5:
        return selectedComputerNumber !== undefined;
      case 6:
        return selectedTimeBlocks.length > 0;
      case 7:
        if (reservationMode === "single") {
          return selectedDates.length > 0;
        } else {
          return (
            recurrence !== null &&
            recurrence.startDate !== "" &&
            recurrence.daysOfWeek.length > 0
          );
        }
      default:
        return false;
    }
  };

  // Navigation
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

  // Submit form
  const handleSubmit = async () => {
    if (!canProceed() || !selectedComputerNumber) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const reservationData: CreateLabReservationDto = {
        userType: userType as UserType,
        software: selectedSoftware,
        ...(selectedSoftware.includes(Software.OTRO) && otherSoftware
          ? { otherSoftware }
          : {}),
        purpose: purpose as Purpose,
        description,
        computerNumber: selectedComputerNumber,
        timeBlocks: selectedTimeBlocks,
        ...(reservationMode === "single"
          ? { dates: selectedDates.map((d) => format(d, "yyyy-MM-dd")) }
          : { recurrence: recurrence as RecurrencePattern }),
      };

      console.log("Enviando reserva:", reservationData);

      const response = await fetch("/api/lab-reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", { status: response.status, data });

      if (!response.ok) {
        const errorMessage =
          data.message || data.error || `Error ${response.status}`;
        console.error("Error en reserva:", errorMessage, data);
        throw new Error(errorMessage);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error completo:", err);
      setError(
        err instanceof Error ? err.message : "Error al enviar las solicitudes"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    "Tipo de Usuario",
    "Software Requerido",
    "Propósito de Uso",
    "Descripción del Proyecto",
    "Seleccionar Computadora",
    "Bloques Horarios",
    "Fechas de Reserva",
  ];

  const stepDescriptions = [
    "Indica tu tipo de usuario",
    "Selecciona el software que necesitarás usar",
    "¿Para qué usarás las computadoras?",
    "Describe tu proyecto o actividad (mínimo 20 caracteres)",
    "Elige la computadora que mejor se adapte a tus necesidades",
    "Selecciona hasta 3 bloques horarios (máximo 5h 15min por día)",
    "Configura las fechas para tu reserva",
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`flex items-center ${step < totalSteps ? "flex-1" : ""}`}
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
                {step < currentStep ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  step
                )}
              </div>
              {step < totalSteps && (
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
          <CardTitle className="flex items-center gap-2">
            {currentStep === 6 && <Clock className="h-5 w-5 text-blue-600" />}
            {currentStep === 7 && (
              <CalendarDays className="h-5 w-5 text-blue-600" />
            )}
            {stepTitles[currentStep - 1]}
          </CardTitle>
          <CardDescription>{stepDescriptions[currentStep - 1]}</CardDescription>
        </CardHeader>

        <CardContent className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* Step 1: User Type */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <RadioGroup
                  value={userType}
                  onValueChange={(value) => setUserType(value as UserType)}
                >
                  <div className="space-y-3">
                    {Object.values(UserType).map((type) => (
                      <div
                        key={type}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          userType === type
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => setUserType(type)}
                      >
                        <RadioGroupItem value={type} id={type} />
                        <Label
                          htmlFor={type}
                          className="flex-1 cursor-pointer font-medium"
                        >
                          {USER_TYPE_LABELS[type]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </motion.div>
            )}

            {/* Step 2: Software */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid gap-3">
                  {Object.values(Software).map((software) => (
                    <div
                      key={software}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedSoftware.includes(software)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
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
                    <Label htmlFor="otherSoftware">
                      Especifica el software que necesitas
                    </Label>
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
                        {software === Software.OTRO &&
                          otherSoftware &&
                          `: ${otherSoftware}`}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Purpose */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <RadioGroup
                  value={purpose}
                  onValueChange={(value) => setPurpose(value as Purpose)}
                >
                  <div className="space-y-3">
                    {Object.values(Purpose).map((p) => (
                      <div
                        key={p}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          purpose === p
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => setPurpose(p)}
                      >
                        <RadioGroupItem value={p} id={p} />
                        <Label
                          htmlFor={p}
                          className="flex-1 cursor-pointer font-medium"
                        >
                          {PURPOSE_LABELS[p]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </motion.div>
            )}

            {/* Step 4: Description */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
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
                    <span
                      className={
                        description.length >= 20
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {description.length} / 20
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Computer Selection */}
            {currentStep === 5 && userType && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ComputerSelector
                  userType={userType as UserType}
                  {...(selectedComputerNumber !== undefined && {
                    selectedComputerNumber,
                  })}
                  onSelect={setSelectedComputerNumber}
                />
              </motion.div>
            )}

            {/* Step 6: Time Block Selection */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <TimeBlockSelector
                  selectedBlocks={selectedTimeBlocks}
                  onBlocksChange={setSelectedTimeBlocks}
                  maxBlocks={3}
                />
              </motion.div>
            )}

            {/* Step 7: Dates/Recurrence */}
            {currentStep === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {loadingReservations && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando tus reservas existentes...
                  </div>
                )}

                <RecurrenceSelector
                  mode={reservationMode}
                  onModeChange={setReservationMode}
                  selectedDates={selectedDates}
                  onDatesChange={setSelectedDates}
                  recurrence={recurrence}
                  onRecurrenceChange={setRecurrence}
                  disabledDates={existingReservations.map(
                    (d) => new Date(d + "T12:00:00")
                  )}
                />

                {/* Preview */}
                {(selectedDates.length > 0 ||
                  (recurrence &&
                    recurrence.startDate &&
                    recurrence.daysOfWeek.length > 0)) &&
                  selectedComputerNumber && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Vista previa de tu reserva
                      </h4>
                      <ReservationPreview
                        mode={reservationMode}
                        selectedDates={selectedDates}
                        recurrence={recurrence}
                        computerNumber={selectedComputerNumber}
                        timeBlocks={selectedTimeBlocks}
                        onRemoveDate={handleRemoveDate}
                      />
                    </div>
                  )}
              </motion.div>
            )}
          </AnimatePresence>

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
