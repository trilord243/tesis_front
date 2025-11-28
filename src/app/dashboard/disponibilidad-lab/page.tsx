"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LabResourceCalendar } from "@/components/lab-reservations/lab-resource-calendar";
import { LabReservation } from "@/types/lab-reservation";
import { User } from "@/types/auth";
import {
  Calendar,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Loader2,
  Computer,
  Info,
  Plus,
} from "lucide-react";
import "@/styles/calendar.css";

export default function DisponibilidadLabPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [reservations, setReservations] = useState<LabReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      if (userData?.role === "admin") {
        router.replace("/admin/dashboard");
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      router.push("/auth/login");
    } finally {
      setAuthLoading(false);
    }
  }, [router]);

  const loadReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar todas las reservas aprobadas para mostrar disponibilidad
      const response = await fetch("/api/lab-reservations?status=approved");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al cargar la disponibilidad");
      }

      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar la disponibilidad");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthAndLoadUser();
  }, [checkAuthAndLoadUser]);

  useEffect(() => {
    if (!authLoading && user) {
      loadReservations();
    }
  }, [authLoading, user]);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date; resourceId: number }) => {
    // Redirigir al formulario de reserva con los datos preseleccionados
    const date = slotInfo.start.toISOString().split("T")[0];
    const computer = slotInfo.resourceId;
    router.push(`/dashboard/reservar-lab?date=${date}&computer=${computer}`);
  };

  if (authLoading) {
    return (
      <>
        <Navbar isAuthenticated={true} showAuthButtons={false} isAdmin={false} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 md:pt-24">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#1859A9" }} />
            <span className="text-lg">Cargando...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar isAuthenticated={true} showAuthButtons={false} isAdmin={false} />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al Dashboard
              </Link>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#1859A920", color: "#1859A9" }}
                  >
                    <Computer className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                      Disponibilidad del Laboratorio
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Ve qué computadoras están disponibles y haz tu reserva
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={loadReservations} variant="outline" disabled={loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Actualizar
                  </Button>
                  <Link href="/dashboard/reservar-lab">
                    <Button style={{ backgroundColor: "#FF8200" }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Reserva
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Info Alert */}
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Cómo usar:</strong> El calendario muestra las reservas aprobadas en verde.
              Los espacios vacíos están disponibles. Haz clic en un espacio vacío para hacer una reserva,
              o usa el botón &quot;Nueva Reserva&quot; para completar el formulario.
            </AlertDescription>
          </Alert>

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <Card className="text-center py-12">
              <CardContent>
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-muted-foreground">Cargando disponibilidad...</p>
              </CardContent>
            </Card>
          )}

          {/* Calendar */}
          {!loading && (
            <LabResourceCalendar
              reservations={reservations}
              showOnlyApproved={true}
              onSelectSlot={handleSelectSlot}
            />
          )}

          {/* Legend Card */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Información del Laboratorio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Horarios de Bloques</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Bloque 1:</span> 07:00 - 08:45</p>
                    <p><span className="font-medium">Bloque 2:</span> 08:45 - 10:30</p>
                    <p><span className="font-medium">Bloque 3:</span> 10:30 - 12:15</p>
                    <p><span className="font-medium">Bloque 4:</span> 12:15 - 14:00</p>
                    <p><span className="font-medium">Bloque 5:</span> 14:00 - 15:45</p>
                    <p><span className="font-medium">Bloque 6:</span> 15:45 - 17:30</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Computadoras</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">PC 1-5:</span> Uso general</p>
                    <p><span className="font-medium">PC 6-9:</span> CFD / Metaverso (alto rendimiento)</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Días Disponibles</h4>
                    <p className="text-sm">Lunes a Viernes (fines de semana no disponibles)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
