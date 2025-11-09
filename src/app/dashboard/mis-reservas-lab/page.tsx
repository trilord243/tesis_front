"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LabReservation,
  STATUS_LABELS,
  STATUS_COLORS,
  TIME_BLOCKS,
  USER_TYPE_LABELS,
  SOFTWARE_LABELS,
  PURPOSE_LABELS,
} from "@/types/lab-reservation";
import { Calendar, Clock, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

export default function MisReservasLabPage() {
  const [reservations, setReservations] = useState<LabReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      setError(err.message || "Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mis Reservas de Laboratorio</h1>
            <p className="text-muted-foreground">
              Historial de todas tus solicitudes de reserva
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadReservations} variant="outline" disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Link href="/dashboard/reservar-lab">
              <Button>Nueva Reserva</Button>
            </Link>
          </div>
        </div>
      </div>

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
                        Solicitud - {formatDate(reservation.createdAt.split("T")[0])}
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

                  {/* Slots Solicitados */}
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                      Fechas y Horarios Solicitados
                    </h4>
                    <div className="space-y-3">
                      {reservation.requestedSlots.map((slot, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-card space-y-2"
                        >
                          <div className="flex items-center gap-2 font-medium">
                            <Calendar className="h-4 w-4" />
                            {formatDate(slot.date)}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {slot.blocks.map((block) => {
                              const blockInfo = TIME_BLOCKS.find((tb) => tb.value === block);
                              return (
                                <Badge key={block} variant="outline" className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {blockInfo?.label}: {blockInfo?.startTime} - {blockInfo?.endTime}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Información de Aprobación/Rechazo */}
                    {reservation.status === "approved" && reservation.approvedAt && (
                      <Alert className="mt-4 bg-green-50 border-green-200">
                        <AlertDescription className="text-green-800">
                          <strong>Aprobada el:</strong>{" "}
                          {new Date(reservation.approvedAt).toLocaleString("es-ES")}
                        </AlertDescription>
                      </Alert>
                    )}

                    {reservation.status === "rejected" && reservation.rejectionReason && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertDescription>
                          <strong>Motivo de rechazo:</strong> {reservation.rejectionReason}
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
  );
}
