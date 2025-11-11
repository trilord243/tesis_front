"use client";

import { useState } from "react";
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
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

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

  const totalSteps = 6;

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

        const response = await fetch("/api/lab-reservations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.message || "Error al crear la reserva");
        }

        return data;
      });

      // Wait for all reservations to be created
      await Promise.all(reservationPromises);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
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
            <div className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-900">
                  <div className="space-y-2">
                    <p className="font-semibold">Selecciona uno o más días para tu reserva</p>
                    <p className="text-sm">Puedes seleccionar múltiples fechas haciendo clic en los días deseados.</p>
                    {selectedComputerNumber && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-blue-300">
                        <span className="text-blue-700 font-semibold">Computadora:</span>
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          #{selectedComputerNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>

              <div className="flex justify-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200 shadow-lg">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates || [])}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-xl border-0 scale-110"
                  classNames={{
                    months: "space-y-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-lg font-bold",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-12 font-normal text-sm",
                    row: "flex w-full mt-2",
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-100 rounded-md transition-colors",
                    day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white",
                    day_today: "bg-orange-100 text-orange-900 font-bold",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                />
              </div>

              {selectedDates.length > 0 && (
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-md">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-green-900">
                        {selectedDates.length} {selectedDates.length === 1 ? 'Fecha Seleccionada' : 'Fechas Seleccionadas'}
                      </h4>
                      <button
                        onClick={() => setSelectedDates([])}
                        className="text-sm text-red-600 hover:text-red-800 underline"
                      >
                        Limpiar todas
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedDates
                        .sort((a, b) => a.getTime() - b.getTime())
                        .map((date, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border-2 border-green-400 shadow-sm"
                          >
                            <span className="text-green-900 font-medium">
                              {date.toLocaleDateString("es-ES", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <button
                              onClick={() => setSelectedDates(selectedDates.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700 font-bold text-lg"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
