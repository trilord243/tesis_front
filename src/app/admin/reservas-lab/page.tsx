"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminReservationDialog } from "@/components/lab-reservations/admin-reservation-dialog";
import { LabResourceCalendar } from "@/components/lab-reservations/lab-resource-calendar";
import "@/styles/calendar.css";
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
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  HourglassIcon,
  Computer,
  CalendarDays,
  List,
  Package,
} from "lucide-react";
import { ReservationGroupCard } from "@/components/lab-reservations/reservation-group-card";

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
  const [computerFilter, setComputerFilter] = useState<string>("all");

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las reservas");
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

    // Filtro por computadora
    if (computerFilter !== "all") {
      filtered = filtered.filter((r) => r.computerNumber === parseInt(computerFilter));
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
  }, [reservations, statusFilter, searchQuery, computerFilter]);

  // Estadísticas
  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === ReservationStatus.PENDING).length,
    approved: reservations.filter((r) => r.status === ReservationStatus.APPROVED).length,
    rejected: reservations.filter((r) => r.status === ReservationStatus.REJECTED).length,
  };

  // Obtener computadoras únicas
  const uniqueComputers = Array.from(
    new Set(reservations.map((r) => r.computerNumber).filter((num): num is number => num !== undefined && num !== null))
  ).sort((a, b) => a - b);

  // Agrupar reservas por recurrenceGroupId
  const groupedReservations = filteredReservations.reduce<{
    groups: Map<string, LabReservation[]>;
    individual: LabReservation[];
  }>(
    (acc, reservation) => {
      if (reservation.recurrenceGroupId) {
        const existing = acc.groups.get(reservation.recurrenceGroupId) || [];
        existing.push(reservation);
        acc.groups.set(reservation.recurrenceGroupId, existing);
      } else {
        acc.individual.push(reservation);
      }
      return acc;
    },
    { groups: new Map(), individual: [] }
  );

  // Convert groups map to array and sort by first pending reservation's date
  const sortedGroups = Array.from(groupedReservations.groups.entries())
    .map(([groupId, reservations]) => ({
      groupId,
      reservations: reservations.sort((a, b) =>
        new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime()
      ),
      hasPending: reservations.some(r => r.status === ReservationStatus.PENDING),
    }))
    .sort((a, b) => {
      // Groups with pending reservations first
      if (a.hasPending && !b.hasPending) return -1;
      if (!a.hasPending && b.hasPending) return 1;
      // Then by first reservation date
      const dateA = a.reservations[0]?.reservationDate || '';
      const dateB = b.reservations[0]?.reservationDate || '';
      return dateA.localeCompare(dateB);
    });

  // Sort individual reservations (pending first, then by date)
  const sortedIndividual = [...groupedReservations.individual].sort((a, b) => {
    const aIsPending = a.status === ReservationStatus.PENDING;
    const bIsPending = b.status === ReservationStatus.PENDING;
    if (aIsPending && !bIsPending) return -1;
    if (!aIsPending && bIsPending) return 1;
    return new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime();
  });

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
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar isAuthenticated={true} showAuthButtons={true} isAdmin={true} />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="flex items-center space-x-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#1859A920", color: "#1859A9" }}
                >
                  <Computer className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                    Gestión de Reservas de Laboratorio
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Administra las solicitudes de reserva de computadoras
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animated fadeIn">
        <Card>
          <CardHeader className="pb-4 pt-6">
            <CardDescription className="mb-2">Total de Solicitudes</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-4 pt-6">
            <CardDescription className="flex items-center gap-2 mb-2">
              <HourglassIcon className="h-4 w-4" />
              Pendientes
            </CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-4 pt-6">
            <CardDescription className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4" />
              Aprobadas
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-4 pt-6">
            <CardDescription className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4" />
              Rechazadas
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs para Vista de Lista y Calendario */}
      <Tabs defaultValue="list" className="w-full">
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <TabsList className="flex-1 grid grid-cols-2 gap-3 p-2 h-14 bg-gray-100">
            <TabsTrigger
              value="list"
              className="flex items-center justify-center gap-3 h-full text-base font-semibold px-6 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              <List className="h-5 w-5" />
              <span>Lista de Solicitudes</span>
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="flex items-center justify-center gap-3 h-full text-base font-semibold px-6 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              <CalendarDays className="h-5 w-5" />
              <span>Vista de Calendario</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab de Lista */}
        <TabsContent value="list" className="space-y-6">
          {/* Filters */}
          <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Búsqueda - Fila completa con más padding */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Filtros en una segunda fila con más espacio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="w-full">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value={ReservationStatus.PENDING}>Pendientes</SelectItem>
                    <SelectItem value={ReservationStatus.APPROVED}>Aprobadas</SelectItem>
                    <SelectItem value={ReservationStatus.REJECTED}>Rechazadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <Select value={computerFilter} onValueChange={setComputerFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Computadora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las computadoras</SelectItem>
                    {uniqueComputers.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Computadora #{num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <Button
                  variant="outline"
                  onClick={loadReservations}
                  disabled={loading}
                  className="w-full h-10"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Actualizar
                </Button>
              </div>
            </div>
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
              {searchQuery || statusFilter !== "all" || computerFilter !== "all"
                ? "Intenta ajustar los filtros"
                : "Aún no hay solicitudes de reserva"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reservations List */}
      {!loading && !error && filteredReservations.length > 0 && (
        <div className="space-y-6">
          {/* Grouped (Recurrent) Reservations */}
          {sortedGroups.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-purple-700">
                <Package className="h-5 w-5" />
                Solicitudes Recurrentes ({sortedGroups.length})
              </div>
              {sortedGroups.map(({ groupId, reservations }) => (
                <ReservationGroupCard
                  key={groupId}
                  groupId={groupId}
                  reservations={reservations}
                  onSuccess={handleDialogSuccess}
                />
              ))}
            </div>
          )}

          {/* Individual Reservations */}
          {sortedIndividual.length > 0 && (
            <div className="space-y-4">
              {sortedGroups.length > 0 && (
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 pt-4 border-t">
                  <Calendar className="h-5 w-5" />
                  Solicitudes Individuales ({sortedIndividual.length})
                </div>
              )}
              {sortedIndividual.map((reservation) => (
                <Card
                  key={reservation._id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewReservation(reservation)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      {/* Header Row */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge className={STATUS_COLORS[reservation.status]}>
                            {STATUS_LABELS[reservation.status]}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                            <Computer className="h-3 w-3 mr-1" />
                            Computadora #{reservation.computerNumber}
                          </Badge>
                          <span className="font-semibold">{reservation.userName}</span>
                          <span className="text-sm text-muted-foreground">
                            {reservation.userEmail}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleViewReservation(reservation);
                        }}>
                          Ver Detalles
                        </Button>
                      </div>

                      {/* Info Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {formatDate(reservation.reservationDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {reservation.timeBlocks && reservation.timeBlocks.length > 0 ? (
                            <span className="font-medium text-blue-700">
                              {formatTimeBlocksRange(reservation.timeBlocks)}
                            </span>
                          ) : (
                            <span>
                              Solicitada el {new Date(reservation.createdAt).toLocaleDateString("es-ES")}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tipo:</span>{" "}
                          <span className="font-medium">{USER_TYPE_LABELS[reservation.userType]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Propósito:</span>{" "}
                          <span className="font-medium">{PURPOSE_LABELS[reservation.purpose]}</span>
                        </div>
                      </div>

                      {/* Software & Description */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-muted-foreground">Software:</span>
                          {reservation.software.map((sw, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {SOFTWARE_LABELS[sw]}
                              {sw === "otro" && reservation.otherSoftware && `: ${reservation.otherSoftware}`}
                            </Badge>
                          ))}
                        </div>
                        {reservation.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            <span className="font-medium">Descripción:</span> {reservation.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

          {/* Dialog */}
          <AdminReservationDialog
            reservation={selectedReservation}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSuccess={handleDialogSuccess}
          />
        </TabsContent>

        {/* Tab de Calendario */}
        <TabsContent value="calendar">
          <LabResourceCalendar
            reservations={reservations}
            isAdmin={true}
            onSelectReservation={handleViewReservation}
          />
        </TabsContent>
      </Tabs>

        </main>
      </div>
    </>
  );
}
