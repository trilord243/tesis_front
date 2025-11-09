"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LabReservationForm } from "@/components/lab-reservations/lab-reservation-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Computer, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReservarLabPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    // Redirigir al historial después de 3 segundos
    setTimeout(() => {
      router.push("/dashboard/mis-reservas-lab");
    }, 3000);
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  if (showSuccess) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-green-900">
              ¡Solicitud Enviada Exitosamente!
            </CardTitle>
            <CardDescription className="text-green-700">
              Tu solicitud de reserva de computadoras ha sido recibida
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert className="bg-white border-green-300">
              <AlertTitle className="text-green-900">¿Qué sigue?</AlertTitle>
              <AlertDescription className="text-green-700">
                <div className="mt-2 space-y-2 text-left">
                  <p>1. Un administrador revisará tu solicitud</p>
                  <p>2. Recibirás una notificación cuando sea aprobada o rechazada</p>
                  <p>3. Podrás ver el estado de tu reserva en "Mis Reservas"</p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-2 pt-4">
              <Button onClick={() => router.push("/dashboard/mis-reservas-lab")} className="w-full">
                Ver Mis Reservas
              </Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full">
                Volver al Dashboard
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Redirigiendo automáticamente en 3 segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Computer className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Reservar Computadoras del Laboratorio</h1>
            <p className="text-muted-foreground">
              Solicita acceso a las computadoras de alto rendimiento
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Información Importante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-blue-800">
          <p>• <strong>Días disponibles:</strong> Lunes, Martes, Jueves y Viernes</p>
          <p>• <strong>Horario:</strong> 6 bloques de 1 hora 45 minutos (7:00 AM - 5:30 PM)</p>
          <p>• <strong>Límite:</strong> Máximo 2 bloques por día</p>
          <p>• <strong>Proceso:</strong> Tu solicitud será revisada por un administrador</p>
          <p>• <strong>Disponibilidad:</strong> Solo se pueden reservar bloques que no estén ya aprobados para otros usuarios</p>
        </CardContent>
      </Card>

      {/* Form */}
      <LabReservationForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
