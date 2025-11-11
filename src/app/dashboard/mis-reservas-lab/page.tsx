"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LabReservation,
  STATUS_LABELS,
  STATUS_COLORS,
  USER_TYPE_LABELS,
  SOFTWARE_LABELS,
  PURPOSE_LABELS,
} from "@/types/lab-reservation";
import { Calendar, ArrowLeft, RefreshCw, AlertCircle, Loader2, Computer } from "lucide-react";
import { User } from "@/types/auth";

export default function MisReservasLabPage() {
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
      setAuthLoading(false);
    }
  }, [router]);

  const loadReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/lab-reservations/my-reservations");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al cargar las reservas");
      }

      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las reservas");
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading) {
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#1859A920", color: "#1859A9" }}
                  >
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h1
                      className="text-2xl font-bold"
                      style={{ color: "#1859A9" }}
                    >
                      Mis Reservas de Laboratorio
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Historial de todas tus solicitudes de reserva
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={loadReservations} variant="outline" disabled={loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Actualizar
                  </Button>
                  <Link href="/dashboard/reservar-lab">
                    <Button style={{ backgroundColor: "#FF8200" }}>Nueva Reserva</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Cargando tus reservas...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && reservations.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No tienes reservas aún</h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primera solicitud de reserva para usar las computadoras del laboratorio
            </p>
            <Link href="/dashboard/reservar-lab">
              <Button>Crear Primera Reserva</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Reservations List */}
      {!loading && !error && reservations.length > 0 && (
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <Card key={reservation._id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">
                        Solicitud - {formatDate(reservation.createdAt.split("T")[0] || reservation.createdAt)}
                      </CardTitle>
                      <Badge className={STATUS_COLORS[reservation.status]}>
                        {STATUS_LABELS[reservation.status]}
                      </Badge>
                    </div>
                    <CardDescription>
                      Creada el {new Date(reservation.createdAt).toLocaleString("es-ES")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Info General */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                        Información General
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tipo de Usuario:</span>
                          <Badge variant="outline">
                            {USER_TYPE_LABELS[reservation.userType]}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Propósito:</span>
                          <Badge variant="outline">
                            {PURPOSE_LABELS[reservation.purpose]}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                        Software Requerido
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {reservation.software.map((software) => (
                          <Badge key={software} variant="secondary">
                            {SOFTWARE_LABELS[software]}
                          </Badge>
                        ))}
                        {reservation.otherSoftware && (
                          <Badge variant="secondary">{reservation.otherSoftware}</Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                        Descripción
                      </h4>
                      <p className="text-sm bg-muted p-3 rounded-md">
                        {reservation.description}
                      </p>
                    </div>
                  </div>

                  {/* Computadora y Fecha Reservada */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                        Computadora Reservada
                      </h4>
                      <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Computer className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-2xl text-blue-700">
                              Computadora #{reservation.computerNumber}
                            </p>
                            <p className="text-sm text-blue-600">
                              {reservation.computerNumber >= 5 ? "Uso CFD/Metaverso" : "Acceso General"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                        Fecha de Reserva
                      </h4>
                      <div className="p-4 border rounded-lg bg-card">
                        <div className="flex items-center gap-2 font-medium text-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          {formatDate(reservation.reservationDate)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Toda la jornada del día seleccionado
                        </p>
                      </div>
                    </div>

                    {/* Información de Aprobación/Rechazo */}
                    {reservation.status === "approved" && reservation.approvedAt && (
                      <Alert className="bg-green-50 border-green-200">
                        <AlertDescription className="text-green-800">
                          <strong>Aprobada el:</strong>{" "}
                          {new Date(reservation.approvedAt).toLocaleString("es-ES")}
                        </AlertDescription>
                      </Alert>
                    )}

                    {reservation.status === "rejected" && reservation.rejectionReason && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          <strong>Motivo de rechazo:</strong> {reservation.rejectionReason}
                        </AlertDescription>
                      </Alert>
                    )}

                    {reservation.status === "pending" && (
                      <Alert className="bg-yellow-50 border-yellow-200">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                          Tu solicitud está pendiente de revisión por un administrador.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
        </div>
      </div>
    </>
  );
}
