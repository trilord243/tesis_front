"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  User,
  Package,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Shield,
  Users,
} from "lucide-react";
import { getAllUsersWithEquipment } from "@/lib/admin-products";
import { UserWithEquipment, estadoLabels } from "@/types/admin-products";

interface UsersEquipmentManagerProps {
  initialUsers: UserWithEquipment[];
}

export function UsersEquipmentManager({
  initialUsers,
}: UsersEquipmentManagerProps) {
  const [users, setUsers] = useState<UserWithEquipment[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<UserWithEquipment[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "with_equipment" | "without_equipment">("all");

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const updatedUsers = await getAllUsersWithEquipment();
      setUsers(updatedUsers);
      applyFilters(updatedUsers, searchQuery, selectedFilter);
    } catch (error) {
      console.error("Error refreshing users:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (
    usersList: UserWithEquipment[],
    query: string,
    filter: "all" | "with_equipment" | "without_equipment"
  ) => {
    let filtered = usersList;

    // Filtrar por equipos
    if (filter === "with_equipment") {
      filtered = filtered.filter(user => 
        user.equipos_reservados && user.equipos_reservados.length > 0
      );
    } else if (filter === "without_equipment") {
      filtered = filtered.filter(user => 
        !user.equipos_reservados || user.equipos_reservados.length === 0
      );
    }

    // Filtrar por búsqueda
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm) ||
        user.lastName?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.codigo_acceso?.toLowerCase().includes(searchTerm) ||
        user.cedula?.toLowerCase().includes(searchTerm) ||
        user.phone?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    applyFilters(users, query, selectedFilter);
  };

  const handleFilterChange = (filter: "all" | "with_equipment" | "without_equipment") => {
    setSelectedFilter(filter);
    applyFilters(users, searchQuery, filter);
  };

  const getStatusInfo = (estado: string) => {
    const info = estadoLabels[estado as keyof typeof estadoLabels];
    return info || { label: estado, color: "text-gray-800", bgColor: "bg-gray-100" };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const usersWithEquipment = filteredUsers.filter(user => 
    user.equipos_reservados && user.equipos_reservados.length > 0
  ).length;

  const usersWithoutEquipment = filteredUsers.filter(user => 
    !user.equipos_reservados || user.equipos_reservados.length === 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#1859A9" }}>
              {filteredUsers.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Con Equipos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {usersWithEquipment}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <User className="h-4 w-4" />
              Sin Equipos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {usersWithoutEquipment}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {filteredUsers.filter(user => user.role === 'admin').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: "#1859A9" }}>
            <Search className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
          <CardDescription>
            Filtra y busca usuarios en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64">
                <Label htmlFor="userSearch">Buscar Usuario</Label>
                <Input
                  id="userSearch"
                  placeholder="Nombre, email, código de acceso, cédula..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={refreshUsers}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </Button>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedFilter === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("all")}
                style={selectedFilter === "all" ? { backgroundColor: "#1859A9", color: "white" } : undefined}
              >
                Todos ({users.length})
              </Button>
              <Button
                variant={selectedFilter === "with_equipment" ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("with_equipment")}
                style={selectedFilter === "with_equipment" ? { backgroundColor: "#FF8200", color: "white" } : undefined}
              >
                Con Equipos ({users.filter(u => u.equipos_reservados?.length > 0).length})
              </Button>
              <Button
                variant={selectedFilter === "without_equipment" ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("without_equipment")}
              >
                Sin Equipos ({users.filter(u => !u.equipos_reservados?.length).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: "#1859A9" }}>
            Lista de Usuarios ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            {selectedFilter === "all" && "Todos los usuarios del sistema"}
            {selectedFilter === "with_equipment" && "Usuarios que tienen equipos asignados"}
            {selectedFilter === "without_equipment" && "Usuarios sin equipos asignados"}
            {searchQuery && ` - Búsqueda: "${searchQuery}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Usuario</TableHead>
                  <TableHead className="w-[200px]">Contacto</TableHead>
                  <TableHead className="w-[150px]">Código/Cédula</TableHead>
                  <TableHead className="w-[120px]">Estado</TableHead>
                  <TableHead>Equipos Asignados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id} className="hover:bg-gray-50">
                    {/* User Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-full flex-shrink-0"
                          style={{ 
                            backgroundColor: user.role === 'admin' ? '#1859A940' : '#FF820040',
                            color: user.role === 'admin' ? '#1859A9' : '#FF8200'
                          }}
                        >
                          {user.role === 'admin' ? (
                            <Shield className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900">
                            {user.name} {user.lastName}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge 
                              variant={user.role === 'admin' ? 'secondary' : 'outline'} 
                              className="text-xs"
                            >
                              {user.role === 'admin' ? 'Admin' : 'Usuario'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span className="truncate" title={user.email}>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Code/ID */}
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                            {user.codigo_acceso}
                          </code>
                        </div>
                        <div className="text-gray-600">
                          CI: {user.cedula}
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <div className="space-y-1">
                        {user.emailVerified ? (
                          <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verificado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600 border-red-600 text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Sin verificar
                          </Badge>
                        )}
                        <div className="text-xs text-gray-500">
                          {formatDate(user.registrationDate)}
                        </div>
                      </div>
                    </TableCell>

                    {/* Equipment */}
                    <TableCell>
                      {user.equipos_reservados && user.equipos_reservados.length > 0 ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" style={{ color: "#FF8200" }} />
                            <Badge variant="outline" className="text-xs">
                              {user.equipos_reservados.length} equipo{user.equipos_reservados.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                          
                          {user.equipment && user.equipment.length > 0 ? (
                            <div className="space-y-2">
                              {user.equipment.slice(0, 2).map((equipment) => {
                                const statusInfo = getStatusInfo(equipment.estadoUbicacion);
                                return (
                                  <div
                                    key={equipment._id}
                                    className="bg-gray-50 rounded p-2 text-xs border"
                                  >
                                    <div className="font-medium text-gray-900 mb-1">
                                      {equipment.name}
                                    </div>
                                    <div className="flex items-center gap-1 mb-1">
                                      <Badge variant="outline" className="text-xs py-0 px-1">
                                        {equipment.type}
                                      </Badge>
                                      <Badge className={`${statusInfo.bgColor} ${statusInfo.color} text-xs py-0 px-1`}>
                                        {statusInfo.label}
                                      </Badge>
                                    </div>
                                    <div className="text-gray-600 flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span className="truncate" title={equipment.ubicacionFisica}>
                                        {equipment.ubicacionFisica}
                                      </span>
                                    </div>
                                    <div className="text-gray-500 mt-1">
                                      Serial: <code className="text-xs">{equipment.serialNumber}</code>
                                    </div>
                                  </div>
                                );
                              })}
                              {user.equipment.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{user.equipment.length - 2} más...
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                              <div className="flex items-center gap-1 text-yellow-800 text-xs">
                                <AlertTriangle className="h-3 w-3" />
                                <span>
                                  {user.equipos_reservados.length} equipo(s) sin cargar
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 py-2">
                          <Package className="h-6 w-6 mx-auto mb-1" />
                          <p className="text-xs">Sin equipos</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron usuarios
              </h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? `No hay usuarios que coincidan con "${searchQuery}"`
                  : "No hay usuarios que coincidan con los filtros seleccionados"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}