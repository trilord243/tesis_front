"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminReservationDialog } from "@/components/lab-reservations/admin-reservation-dialog";
import {
  LabReservation,
  ReservationStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  TIME_BLOCKS,
} from "@/types/lab-reservation";
import {
  Calendar,
  Clock,
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  HourglassIcon,
} from "lucide-react";

export default function AdminReservasLabPage() {
  const [reservations, setReservations] = useState<LabReservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<LabReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<LabReservation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filtros
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/lab-reservations");
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

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...reservations];

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    // Filtro por búsqueda (nombre o email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.userName.toLowerCase().includes(query) ||
          r.userEmail.toLowerCase().includes(query)
      );
    }

    setFilteredReservations(filtered);
  }, [reservations, statusFilter, searchQuery]);

  // Estadísticas
  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === ReservationStatus.PENDING).length,
    approved: reservations.filter((r) => r.status === ReservationStatus.APPROVED).length,
    rejected: reservations.filter((r) => r.status === ReservationStatus.REJECTED).length,
  };

  const handleViewReservation = (reservation: LabReservation) => {
    setSelectedReservation(reservation);
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    loadReservations();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestión de Reservas de Laboratorio</h1>
        <p className="text-muted-foreground">
          Administra las solicitudes de reserva de computadoras
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Solicitudes</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <HourglassIcon className="h-4 w-4" />
              Pendientes
            </CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Aprobadas
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Rechazadas
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value={ReservationStatus.PENDING}>Pendientes</SelectItem>
                <SelectItem value={ReservationStatus.APPROVED}>Aprobadas</SelectItem>
                <SelectItem value={ReservationStatus.REJECTED}>Rechazadas</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadReservations} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

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
          <p className="text-muted-foreground">Cargando reservas...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredReservations.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No se encontraron reservas</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Intenta ajustar los filtros"
                : "Aún no hay solicitudes de reserva"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reservations List */}
      {!loading && !error && filteredReservations.length > 0 && (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <Card
              key={reservation._id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewReservation(reservation)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge className={STATUS_COLORS[reservation.status]}>
                        {STATUS_LABELS[reservation.status]}
                      </Badge>
                      <span className="font-semibold">{reservation.userName}</span>
                      <span className="text-sm text-muted-foreground">
                        {reservation.userEmail}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {reservation.requestedSlots.length} día(s) solicitado(s)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Creada el {new Date(reservation.createdAt).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {reservation.requestedSlots.slice(0, 3).map((slot, index) => {
                        const date = formatDate(slot.date);
                        const blocksCount = slot.blocks.length;
                        return (
                          <Badge key={index} variant="outline" className="text-xs">
                            {date} - {blocksCount} bloque{blocksCount > 1 ? "s" : ""}
                          </Badge>
                        );
                      })}
                      {reservation.requestedSlots.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{reservation.requestedSlots.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button variant="outline">Ver Detalles</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog */}
      <AdminReservationDialog
        reservation={selectedReservation}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}
