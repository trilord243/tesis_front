"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LabReservation,
  ReservationStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  USER_TYPE_LABELS,
  SOFTWARE_LABELS,
  PURPOSE_LABELS,
  formatTimeBlocksRange,
} from "@/types/lab-reservation";
import {
  Calendar,
  Clock,
  Computer,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Package,
  Check,
  X,
} from "lucide-react";

interface ReservationGroupCardProps {
  groupId: string;
  reservations: LabReservation[];
  onSuccess?: () => void;
}

export function ReservationGroupCard({
  reservations,
  onSuccess,
}: ReservationGroupCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  // Get the first reservation to display general info
  const firstReservation = reservations[0];
  if (!firstReservation) return null;

  // Get pending reservations
  const pendingReservations = reservations.filter(
    (r) => r.status === ReservationStatus.PENDING
  );
  const hasPending = pendingReservations.length > 0;

  // Sort by date
  const sortedReservations = [...reservations].sort(
    (a, b) =>
      new Date(a.reservationDate).getTime() -
      new Date(b.reservationDate).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAllPending = () => {
    const newSelected = new Set<string>();
    pendingReservations.forEach((r) => newSelected.add(r._id));
    setSelectedIds(newSelected);
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) {
      setError("Selecciona al menos una fecha para aprobar");
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      // Approve each selected reservation
      const promises = Array.from(selectedIds).map(async (id) => {
        const response = await fetch("/api/lab-reservations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reservationId: id,
            status: ReservationStatus.APPROVED,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || `Error al aprobar reserva ${id}`);
        }
        return response.json();
      });

      await Promise.all(promises);
      setSelectedIds(new Set());
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al aprobar");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) {
      setError("Selecciona al menos una fecha para rechazar");
      return;
    }

    if (!rejectionReason.trim() || rejectionReason.length < 10) {
      setError("La razón de rechazo debe tener al menos 10 caracteres");
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const promises = Array.from(selectedIds).map(async (id) => {
        const response = await fetch("/api/lab-reservations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reservationId: id,
            status: ReservationStatus.REJECTED,
            rejectionReason,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || `Error al rechazar reserva ${id}`);
        }
        return response.json();
      });

      await Promise.all(promises);
      setSelectedIds(new Set());
      setRejectionReason("");
      setShowRejectInput(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al rechazar");
    } finally {
      setIsUpdating(false);
    }
  };

  // Stats
  const stats = {
    total: reservations.length,
    pending: pendingReservations.length,
    approved: reservations.filter((r) => r.status === ReservationStatus.APPROVED)
      .length,
    rejected: reservations.filter((r) => r.status === ReservationStatus.REJECTED)
      .length,
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Solicitud Recurrente
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700"
                >
                  {stats.total} fechas
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {firstReservation.userName} • {firstReservation.userEmail}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Info */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Computer className="h-4 w-4 text-blue-600" />
            <span>Computadora #{firstReservation.computerNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-600" />
            <span>{USER_TYPE_LABELS[firstReservation.userType]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-600" />
            <span>{formatTimeBlocksRange(firstReservation.timeBlocks)}</span>
          </div>
        </div>

        {/* Software */}
        <div className="flex flex-wrap gap-2">
          {firstReservation.software.map((sw) => (
            <Badge key={sw} variant="secondary" className="text-xs">
              {SOFTWARE_LABELS[sw]}
            </Badge>
          ))}
          <Badge variant="outline" className="text-xs">
            {PURPOSE_LABELS[firstReservation.purpose]}
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3 text-xs">
          {stats.pending > 0 && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
              {stats.pending} pendientes
            </span>
          )}
          {stats.approved > 0 && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              {stats.approved} aprobadas
            </span>
          )}
          {stats.rejected > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
              {stats.rejected} rechazadas
            </span>
          )}
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="space-y-4 pt-4 border-t">
            {/* Description */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Descripción:</strong> {firstReservation.description}
              </p>
            </div>

            {/* Selection Actions */}
            {hasPending && (
              <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllPending}
                  disabled={isUpdating}
                >
                  Seleccionar todas las pendientes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deselectAll}
                  disabled={isUpdating || selectedIds.size === 0}
                >
                  Deseleccionar
                </Button>
                <span className="flex items-center text-sm text-blue-700 ml-auto">
                  {selectedIds.size} seleccionadas
                </span>
              </div>
            )}

            {/* Dates List */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fechas Solicitadas
              </h4>
              <div className="grid gap-2">
                {sortedReservations.map((reservation) => {
                  const isPending =
                    reservation.status === ReservationStatus.PENDING;
                  const isSelected = selectedIds.has(reservation._id);

                  return (
                    <div
                      key={reservation._id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isSelected
                          ? "bg-blue-50 border-blue-300"
                          : isPending
                          ? "bg-white border-gray-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      {isPending && (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelect(reservation._id)}
                          disabled={isUpdating}
                        />
                      )}
                      <div className="flex-1 flex items-center gap-3">
                        <span className="font-medium min-w-[100px]">
                          {formatDate(reservation.reservationDate)}
                        </span>
                        <Badge className={STATUS_COLORS[reservation.status]}>
                          {STATUS_LABELS[reservation.status]}
                        </Badge>
                      </div>
                      {/* Individual Quick Actions */}
                      {isPending && !isUpdating && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-green-600 hover:bg-green-100"
                            onClick={async (e) => {
                              e.stopPropagation();
                              setSelectedIds(new Set([reservation._id]));
                              setIsUpdating(true);
                              try {
                                const response = await fetch(
                                  "/api/lab-reservations",
                                  {
                                    method: "PATCH",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      reservationId: reservation._id,
                                      status: ReservationStatus.APPROVED,
                                    }),
                                  }
                                );
                                if (!response.ok) {
                                  const data = await response.json();
                                  throw new Error(data.error || "Error");
                                }
                                onSuccess?.();
                              } catch (err) {
                                setError(
                                  err instanceof Error
                                    ? err.message
                                    : "Error al aprobar"
                                );
                              } finally {
                                setIsUpdating(false);
                                setSelectedIds(new Set());
                              }
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-600 hover:bg-red-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedIds(new Set([reservation._id]));
                              setShowRejectInput(true);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rejection Reason */}
            {showRejectInput && (
              <div className="space-y-2 p-4 border-2 border-dashed border-red-200 rounded-lg bg-red-50">
                <label className="text-sm font-medium text-red-800">
                  Razón del rechazo (mínimo 10 caracteres)
                </label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explica por qué estás rechazando estas fechas..."
                  rows={2}
                  className="bg-white"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowRejectInput(false);
                      setRejectionReason("");
                    }}
                    disabled={isUpdating}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkReject}
                    disabled={isUpdating || rejectionReason.length < 10}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Rechazar {selectedIds.size} fecha
                    {selectedIds.size !== 1 ? "s" : ""}
                  </Button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Bulk Actions */}
            {hasPending && selectedIds.size > 0 && !showRejectInput && (
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleBulkApprove}
                  disabled={isUpdating}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Aprobar {selectedIds.size} fecha
                  {selectedIds.size !== 1 ? "s" : ""}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectInput(true)}
                  disabled={isUpdating}
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rechazar {selectedIds.size} fecha
                  {selectedIds.size !== 1 ? "s" : ""}
                </Button>
              </div>
            )}

            {/* Quick Approve All */}
            {hasPending && selectedIds.size === 0 && !showRejectInput && (
              <Button
                onClick={async () => {
                  const allIds = new Set<string>();
                  pendingReservations.forEach((r) => allIds.add(r._id));
                  setSelectedIds(allIds);
                  // Wait for state update then approve
                  setIsUpdating(true);
                  setError(null);
                  try {
                    const promises = pendingReservations.map(async (r) => {
                      const response = await fetch("/api/lab-reservations", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          reservationId: r._id,
                          status: ReservationStatus.APPROVED,
                        }),
                      });
                      if (!response.ok) {
                        const data = await response.json();
                        throw new Error(
                          data.error || `Error al aprobar reserva`
                        );
                      }
                      return response.json();
                    });
                    await Promise.all(promises);
                    setSelectedIds(new Set());
                    onSuccess?.();
                  } catch (err) {
                    setError(
                      err instanceof Error ? err.message : "Error al aprobar"
                    );
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                disabled={isUpdating}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Aprobar todas las fechas pendientes ({stats.pending})
              </Button>
            )}
          </div>
        )}

        {/* Collapsed Quick View */}
        {!expanded && hasPending && (
          <div className="flex items-center gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setExpanded(true)}
              className="text-purple-600"
            >
              Ver {stats.pending} pendiente{stats.pending !== 1 ? "s" : ""} para
              aprobar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
