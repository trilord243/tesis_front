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
import { RecurrencePattern, UserType } from "@/types/lab-reservation";
import type { UserTypeConfig, SoftwareConfig, PurposeConfig } from "@/types/lab-config";
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

  // Configuraciones dinámicas del admin
  const [userTypes, setUserTypes] = useState<UserTypeConfig[]>([]);
  const [softwareOptions, setSoftwareOptions] = useState<SoftwareConfig[]>([]);
  const [purposeOptions, setPurposeOptions] = useState<PurposeConfig[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Form data - Basic info
  const [userType, setUserType] = useState<string>("");
  const [otherUserType, setOtherUserType] = useState("");
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>([]);
  const [otherSoftware, setOtherSoftware] = useState("");
  const [purpose, setPurpose] = useState<string>("");
  const [otherPurpose, setOtherPurpose] = useState("");
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

  // Load dynamic configuration from admin panel on mount
  useEffect(() => {
    const loadConfig = async () => {
      setLoadingConfig(true);
      try {
        const response = await fetch("/api/lab-config/public");
        if (response.ok) {
          const data = await response.json();
          // Filtrar solo los activos y ordenar
          setUserTypes(
            (data.userTypes || [])
              .filter((ut: UserTypeConfig) => ut.isActive)
              .sort((a: UserTypeConfig, b: UserTypeConfig) => a.order - b.order)
          );
          setSoftwareOptions(
            (data.software || [])
              .filter((s: SoftwareConfig) => s.isActive)
              .sort((a: SoftwareConfig, b: SoftwareConfig) => a.order - b.order)
          );
          setPurposeOptions(
            (data.purposes || [])
              .filter((p: PurposeConfig) => p.isActive)
              .sort((a: PurposeConfig, b: PurposeConfig) => a.order - b.order)
          );
        } else {
          console.error("Error loading lab config:", await response.text());
        }
      } catch (err) {
        console.error("Error loading lab config:", err);
      } finally {
        setLoadingConfig(false);
      }
    };
    loadConfig();
  }, []);

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
        // Solo bloquear fechas donde el usuario ya tiene reserva APROBADA
        // Las pendientes NO bloquean porque pueden ser rechazadas
        const reservedDates = (
          reservations as Array<{ status: string; reservationDate: string }>
        )
          .filter((r) => r.status === "approved")
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
  const handleSoftwareToggle = (softwareKey: string) => {
    setSelectedSoftware((prev) => {
      if (prev.includes(softwareKey)) {
        return prev.filter((s) => s !== softwareKey);
      } else {
        return [...prev, softwareKey];
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
        // Si selecciona "otro", debe escribir el tipo de usuario
        return userType !== "" && (userType !== "otro" || otherUserType.trim().length > 0);
      case 2:
        return (
          selectedSoftware.length > 0 &&
          (!selectedSoftware.includes("otro") ||
            otherSoftware.trim().length > 0)
        );
      case 3:
        // Si selecciona "otro", debe escribir el propósito
        return purpose !== "" && (purpose !== "otro" || otherPurpose.trim().length > 0);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reservationData: any = {
        userType: userType === "otro" ? otherUserType : userType,
        software: selectedSoftware,
        ...(selectedSoftware.includes("otro") && otherSoftware
          ? { otherSoftware }
          : {}),
        purpose: purpose === "otro" ? otherPurpose : purpose,
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
                {loadingConfig ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Cargando opciones...</span>
                  </div>
                ) : userTypes.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No hay tipos de usuario configurados. Contacte al administrador.
                  </div>
                ) : (
                  <>
                    <RadioGroup
                      value={userType}
                      onValueChange={(val) => setUserType(val)}
                    >
                      <div className="space-y-3">
                        {userTypes.map((type) => (
                          <div
                            key={type.value}
                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                              userType === type.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                            onClick={() => setUserType(type.value)}
                          >
                            <RadioGroupItem value={type.value} id={type.value} />
                            <Label
                              htmlFor={type.value}
                              className="flex-1 cursor-pointer font-medium"
                            >
                              {type.label}
                            </Label>
                          </div>
                        ))}
                        {/* Opción Otro */}
                        <div
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            userType === "otro"
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => setUserType("otro")}
                        >
                          <RadioGroupItem value="otro" id="userType-otro" />
                          <Label
                            htmlFor="userType-otro"
                            className="flex-1 cursor-pointer font-medium"
                          >
                            Otro
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    {userType === "otro" && (
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="otherUserType">
                          Especifica tu tipo de usuario
                        </Label>
                        <Input
                          id="otherUserType"
                          value={otherUserType}
                          onChange={(e) => setOtherUserType(e.target.value)}
                          placeholder="Ej: Investigador visitante, Tesista externo, etc."
                        />
                      </div>
                    )}
                  </>
                )}
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
                {loadingConfig ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Cargando opciones...</span>
                  </div>
                ) : softwareOptions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No hay software configurado. Contacte al administrador.
                  </div>
                ) : (
                  <>
                    <div className="grid gap-3">
                      {softwareOptions.map((software) => (
                        <div
                          key={software.value}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            selectedSoftware.includes(software.value)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => handleSoftwareToggle(software.value)}
                        >
                          <Checkbox
                            checked={selectedSoftware.includes(software.value)}
                            onCheckedChange={() => handleSoftwareToggle(software.value)}
                          />
                          <Label className="flex-1 cursor-pointer font-medium">
                            {software.label}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {selectedSoftware.includes("otro") && (
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
                        {selectedSoftware.map((softwareVal) => {
                          const sw = softwareOptions.find((s) => s.value === softwareVal);
                          return (
                            <Badge key={softwareVal} variant="secondary">
                              {sw?.label || softwareVal}
                              {softwareVal === "otro" && otherSoftware && `: ${otherSoftware}`}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </>
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
                {loadingConfig ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Cargando opciones...</span>
                  </div>
                ) : purposeOptions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No hay propósitos configurados. Contacte al administrador.
                  </div>
                ) : (
                  <>
                    <RadioGroup
                      value={purpose}
                      onValueChange={(val) => setPurpose(val)}
                    >
                      <div className="space-y-3">
                        {purposeOptions.map((p) => (
                          <div
                            key={p.value}
                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                              purpose === p.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                            onClick={() => setPurpose(p.value)}
                          >
                            <RadioGroupItem value={p.value} id={p.value} />
                            <Label
                              htmlFor={p.value}
                              className="flex-1 cursor-pointer font-medium"
                            >
                              {p.label}
                            </Label>
                          </div>
                        ))}
                        {/* Opción Otro */}
                        <div
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            purpose === "otro"
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => setPurpose("otro")}
                        >
                          <RadioGroupItem value="otro" id="purpose-otro" />
                          <Label
                            htmlFor="purpose-otro"
                            className="flex-1 cursor-pointer font-medium"
                          >
                            Otro
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    {purpose === "otro" && (
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="otherPurpose">
                          Especifica el propósito de tu reserva
                        </Label>
                        <Input
                          id="otherPurpose"
                          value={otherPurpose}
                          onChange={(e) => setOtherPurpose(e.target.value)}
                          placeholder="Ej: Proyecto de investigación, Práctica personal, etc."
                        />
                      </div>
                    )}
                  </>
                )}
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
