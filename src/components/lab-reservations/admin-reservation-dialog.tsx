"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LabReservation,
  ReservationStatus,
  TIME_BLOCKS,
  USER_TYPE_LABELS,
  SOFTWARE_LABELS,
  PURPOSE_LABELS,
} from "@/types/lab-reservation";
import { Calendar, Clock, User, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface AdminReservationDialogProps {
  reservation: LabReservation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AdminReservationDialog({
  reservation,
  open,
  onOpenChange,
  onSuccess,
}: AdminReservationDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  if (!reservation) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleApprove = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch("/api/lab-reservations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: reservation._id,
          status: ReservationStatus.APPROVED,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Error al aprobar la reserva");
      }

      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Error al aprobar la reserva");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError("Debes proporcionar una razón para rechazar la solicitud");
      return;
    }

    if (rejectionReason.length < 10) {
      setError("La razón debe tener al menos 10 caracteres");
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch("/api/lab-reservations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: reservation._id,
          status: ReservationStatus.REJECTED,
          rejectionReason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Error al rechazar la reserva");
      }

      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
      setRejectionReason("");
    } catch (err: any) {
      setError(err.message || "Error al rechazar la reserva");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Revisar Solicitud de Reserva</DialogTitle>
          <DialogDescription>
            Revisa los detalles y aprueba o rechaza la solicitud
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info */}
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Información del Usuario
            </h4>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <span className="text-sm text-muted-foreground">Nombre:</span>
                <p className="font-medium">{reservation.userName}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <p className="font-medium">{reservation.userEmail}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Tipo:</span>
                <Badge variant="outline">{USER_TYPE_LABELS[reservation.userType]}</Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Propósito:</span>
                <Badge variant="outline">{PURPOSE_LABELS[reservation.purpose]}</Badge>
              </div>
            </div>
          </div>

          {/* Software */}
          <div className="space-y-2">
            <h4 className="font-semibold">Software Requerido</h4>
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

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-semibold">Descripción del Proyecto</h4>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{reservation.description}</p>
            </div>
          </div>

          {/* Requested Slots */}
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fechas y Horarios Solicitados
            </h4>
            <div className="space-y-3">
              {reservation.requestedSlots.map((slot, index) => (
                <div key={index} className="p-4 border rounded-lg bg-card space-y-2">
                  <div className="font-medium">{formatDate(slot.date)}</div>
                  <div className="flex flex-wrap gap-2">
                    {slot.blocks.map((block) => {
                      const blockInfo = TIME_BLOCKS.find((tb) => tb.value === block);
                      return (
                        <Badge
                          key={block}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          {blockInfo?.label}: {blockInfo?.startTime} - {blockInfo?.endTime}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rejection Reason Input */}
          {reservation.status === ReservationStatus.PENDING && (
            <div className="space-y-2 p-4 border-2 border-dashed rounded-lg">
              <Label htmlFor="rejectionReason">
                Razón de Rechazo (solo si vas a rechazar)
              </Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explica por qué estás rechazando esta solicitud (mínimo 10 caracteres)"
                rows={3}
              />
              {rejectionReason.length > 0 && rejectionReason.length < 10 && (
                <p className="text-sm text-red-600">
                  Mínimo 10 caracteres ({rejectionReason.length}/10)
                </p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Warning for Approval */}
          {reservation.status === ReservationStatus.PENDING && (
            <Alert>
              <AlertDescription>
                <strong>Importante:</strong> Al aprobar esta solicitud, los bloques horarios
                seleccionados se bloquearán y no estarán disponibles para otros usuarios en las
                mismas fechas.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          {reservation.status === ReservationStatus.PENDING ? (
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdating}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isUpdating}
                className="flex-1"
              >
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Rechazar
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isUpdating}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Aprobar
              </Button>
            </div>
          ) : (
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
