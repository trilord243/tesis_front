"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MetaverseReservation,
  MetaverseReservationStatus,
  METAVERSE_STATUS_LABELS,
  METAVERSE_STATUS_COLORS,
  formatMetaverseTimeBlocksRange,
} from "@/types/metaverse-reservation";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Globe,
  RefreshCw,
  Search,
  Filter,
  Trash2,
} from "lucide-react";

export default function AdminReservasMetaversoPage() {
  const [reservations, setReservations] = useState<MetaverseReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Estados para modales
  const [selectedReservation, setSelectedReservation] = useState<MetaverseReservation | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  // Cargar reservas
  const loadReservations = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/api/metaverse-reservations";
      if (statusFilter !== "all") {
        url += `?status=${statusFilter}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setReservations(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error loading reservations:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  // Filtrar reservas por búsqueda
  const filteredReservations = reservations.filter((r) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.eventTitle.toLowerCase().includes(query) ||
      r.requesterName.toLowerCase().includes(query) ||
      r.requesterEmail.toLowerCase().includes(query) ||
      (r.organization?.toLowerCase().includes(query) ?? false)
    );
  });

  // Aprobar reserva
  const handleApprove = async (reservation: MetaverseReservation) => {
    setProcessing(true);
    try {
      const response = await fetch(`/api/metaverse-reservations/${reservation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (response.ok) {
        loadReservations();
        setShowDetailDialog(false);
      }
    } catch (error) {
      console.error("Error approving reservation:", error);
    } finally {
      setProcessing(false);
    }
  };

  // Rechazar reserva
  const handleReject = async () => {
    if (!selectedReservation || !rejectionReason.trim()) return;

    setProcessing(true);
    try {
      const response = await fetch(`/api/metaverse-reservations/${selectedReservation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "rejected",
          rejectionReason: rejectionReason,
        }),
      });

      if (response.ok) {
        loadReservations();
        setShowRejectDialog(false);
        setShowDetailDialog(false);
        setRejectionReason("");
      }
    } catch (error) {
      console.error("Error rejecting reservation:", error);
    } finally {
      setProcessing(false);
    }
  };

  // Eliminar reserva
  const handleDelete = async (reservation: MetaverseReservation) => {
    if (!confirm("¿Estás seguro de eliminar esta reserva?")) return;

    try {
      const response = await fetch(`/api/metaverse-reservations/${reservation._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadReservations();
        setShowDetailDialog(false);
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  // Contar por estado
  const counts = {
    pending: reservations.filter((r) => r.status === MetaverseReservationStatus.PENDING).length,
    approved: reservations.filter((r) => r.status === MetaverseReservationStatus.APPROVED).length,
    rejected: reservations.filter((r) => r.status === MetaverseReservationStatus.REJECTED).length,
  };

  return (
    <>
      <Navbar isAuthenticated={true} showAuthButtons={false} isAdmin={true} />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#8B5CF620", color: "#8B5CF6" }}
                  >
                    <Globe className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                      Reservas del Metaverso
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Gestiona las solicitudes de reserva del laboratorio
                    </p>
                  </div>
                </div>
                <Button onClick={loadReservations} variant="outline" disabled={loading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Actualizar
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-700">Pendientes</p>
                    <p className="text-3xl font-bold text-yellow-800">{counts.pending}</p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Aprobadas</p>
                    <p className="text-3xl font-bold text-green-800">{counts.approved}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700">Rechazadas</p>
                    <p className="text-3xl font-bold text-red-800">{counts.rejected}</p>
                  </div>
                  <XCircle className="h-10 w-10 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por título, nombre, email u organización..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="approved">Aprobadas</SelectItem>
                      <SelectItem value="rejected">Rechazadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reservations List */}
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes de Reserva</CardTitle>
              <CardDescription>
                {filteredReservations.length} solicitud(es) encontrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : filteredReservations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay solicitudes de reserva</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReservations.map((reservation) => (
                    <div
                      key={reservation._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowDetailDialog(true);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{reservation.eventTitle}</h3>
                            <Badge className={METAVERSE_STATUS_COLORS[reservation.status]}>
                              {METAVERSE_STATUS_LABELS[reservation.status]}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {reservation.requesterName}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {reservation.requesterEmail}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {format(
                                new Date(reservation.reservationDate + "T12:00:00"),
                                "d MMM yyyy",
                                { locale: es }
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {formatMetaverseTimeBlocksRange(reservation.timeBlocks)}
                            </div>
                          </div>
                        </div>

                        {reservation.status === MetaverseReservationStatus.PENDING && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(reservation);
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReservation(reservation);
                                setShowRejectDialog(true);
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedReservation?.eventTitle}</DialogTitle>
              <DialogDescription>Detalles de la solicitud</DialogDescription>
            </DialogHeader>

            {selectedReservation && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge className={METAVERSE_STATUS_COLORS[selectedReservation.status]}>
                    {METAVERSE_STATUS_LABELS[selectedReservation.status]}
                  </Badge>
                  {selectedReservation.isRecurring && (
                    <Badge variant="outline">Recurrente</Badge>
                  )}
                </div>

                {/* Información del solicitante */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Información del Solicitante</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{selectedReservation.requesterName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{selectedReservation.requesterEmail}</span>
                    </div>
                    {selectedReservation.requesterPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedReservation.requesterPhone}</span>
                      </div>
                    )}
                    {selectedReservation.organization && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span>{selectedReservation.organization}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información del evento */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Información del Evento</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        {format(
                          new Date(selectedReservation.reservationDate + "T12:00:00"),
                          "EEEE, d 'de' MMMM yyyy",
                          { locale: es }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{formatMetaverseTimeBlocksRange(selectedReservation.timeBlocks)}</span>
                    </div>
                    {selectedReservation.expectedAttendees && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{selectedReservation.expectedAttendees} asistentes esperados</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">Descripción</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedReservation.eventDescription}
                  </p>
                </div>

                {/* Propósito */}
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">Propósito</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedReservation.purpose}
                  </p>
                </div>

                {/* Razón de rechazo */}
                {selectedReservation.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-red-800">Razón del Rechazo</h4>
                    <p className="text-sm text-red-700">{selectedReservation.rejectionReason}</p>
                  </div>
                )}

                {/* Acciones */}
                <DialogFooter className="flex gap-2">
                  {selectedReservation.status === MetaverseReservationStatus.PENDING && (
                    <>
                      <Button
                        onClick={() => handleApprove(selectedReservation)}
                        disabled={processing}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processing ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Aprobar
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => setShowRejectDialog(true)}
                        disabled={processing}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(selectedReservation)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rechazar Solicitud</DialogTitle>
              <DialogDescription>
                Indica la razón por la cual se rechaza esta solicitud
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Textarea
                placeholder="Escribe la razón del rechazo..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleReject}
                disabled={!rejectionReason.trim() || processing}
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Confirmar Rechazo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
