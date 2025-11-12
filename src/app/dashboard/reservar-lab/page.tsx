"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { LabReservationForm } from "@/components/lab-reservations/lab-reservation-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Computer, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { User } from "@/types/auth";

export default function ReservarLabPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const checkAuthAndLoadUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (!response.ok) {
        router.push("/auth/login");
        return;
      }

      const userData = await response.json();
      // Si es admin, redirigir a su panel
      if (userData?.role === "admin") {
        router.replace("/admin/dashboard");
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuthAndLoadUser();
  }, [checkAuthAndLoadUser]);

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

  if (loading) {
    return (
      <>
        <Navbar
          isAuthenticated={true}
          showAuthButtons={false}
          isAdmin={user?.role === "admin"}
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 md:pt-24">
          <div className="flex items-center space-x-2">
            <Loader2
              className="h-8 w-8 animate-spin"
              style={{ color: "#1859A9" }}
            />
            <span className="text-lg">Cargando...</span>
          </div>
        </div>
      </>
    );
  }

  if (showSuccess) {
    return (
      <>
        <Navbar
          isAuthenticated={true}
          showAuthButtons={false}
          isAdmin={user?.role === "admin"}
        />
        <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
          <div className="container max-w-4xl mx-auto px-4 py-16">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-3xl text-green-900 mb-2">
              ¡Solicitud Enviada Exitosamente!
            </CardTitle>
            <CardDescription className="text-green-700 text-lg">
              Tu solicitud de reserva de computadoras ha sido recibida
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <Alert className="bg-white border-green-300">
              <AlertTitle className="text-green-900 text-xl mb-3">¿Qué sigue?</AlertTitle>
              <AlertDescription className="text-green-700">
                <div className="mt-2 space-y-3 text-left text-base">
                  <p className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <span>Un administrador revisará tu solicitud</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <span>Recibirás una notificación cuando sea aprobada o rechazada</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <span>Podrás ver el estado de tu reserva en &quot;Mis Reservas&quot;</span>
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 max-w-2xl mx-auto">
              <Button onClick={() => router.push("/dashboard/mis-reservas-lab")} className="flex-1 h-12 text-base">
                Ver Mis Reservas
              </Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex-1 h-12 text-base">
                Volver al Dashboard
              </Button>
            </div>

            <p className="text-sm text-muted-foreground pt-2">
              Redirigiendo automáticamente en 3 segundos...
            </p>
          </CardContent>
        </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar
        isAuthenticated={true}
        showAuthButtons={false}
        isAdmin={user?.role === "admin"}
      />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#1859A920", color: "#1859A9" }}
                >
                  <Computer className="h-6 w-6" />
                </div>
                <div>
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: "#1859A9" }}
                  >
                    Reservar Computadoras del Laboratorio
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Solicita acceso a las computadoras de alto rendimiento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Info Card */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Información Importante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-blue-800">
              <p>• <strong>Días disponibles:</strong> Lunes, Martes, Miércoles, Jueves y Viernes</p>
              <p>• <strong>Horario:</strong> 6 bloques de 1 hora 45 minutos (7:00 AM - 5:30 PM)</p>
              <p>• <strong>Límite:</strong> Máximo 2 bloques por día</p>
              <p>• <strong>Proceso:</strong> Tu solicitud será revisada por un administrador</p>
              <p>• <strong>Disponibilidad:</strong> Solo se pueden reservar bloques que no estén ya aprobados para otros usuarios</p>
            </CardContent>
          </Card>

          {/* Form */}
          <LabReservationForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </>
  );
}
