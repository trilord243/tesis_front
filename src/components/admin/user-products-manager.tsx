"use client";

import { useState, useEffect } from "react";
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
import { Search, User, Package, MapPin, Calendar, AlertTriangle, Users, ChevronRight, ArrowLeft } from "lucide-react";
import { getUserProducts, getAllUsersWithEquipment } from "@/lib/admin-products";
import { Product, estadoLabels, UserWithEquipment } from "@/types/admin-products";

type ViewMode = 'list' | 'search' | 'detail';

export function UserProductsManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [userCode, setUserCode] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [allUsers, setAllUsers] = useState<UserWithEquipment[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithEquipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los usuarios al montar el componente
  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    setLoading(true);
    try {
      const users = await getAllUsersWithEquipment();
      setAllUsers(users);
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Error al cargar la lista de usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: UserWithEquipment) => {
    setSelectedUser(user);
    setProducts(user.equipment || []);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedUser(null);
    setProducts([]);
    setError(null);
  };

  const handleSearch = async () => {
    if (!userCode.trim()) {
      setError("Por favor ingresa un código de usuario");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getUserProducts(userCode.trim());
      setProducts(result);
      setViewMode('search');

      if (result.length === 0) {
        setError(`No se encontraron productos para el usuario: ${userCode}`);
      }
    } catch (error) {
      console.error("Error searching user products:", error);
      setError("Error al buscar productos del usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getStatusInfo = (estado: string) => {
    const info = estadoLabels[estado as keyof typeof estadoLabels];
    return info || { label: estado, color: "text-gray-800", bgColor: "bg-gray-100" };
  };

  // Renderizar tarjetas de productos
  const renderProductCards = (products: Product[], showBackButton = false) => (
    <>
      {showBackButton && (
        <Button
          onClick={handleBackToList}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la lista
        </Button>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin productos asignados
          </h3>
          <p className="text-gray-500">
            Este usuario no tiene productos asignados actualmente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const statusInfo = getStatusInfo(product.estadoUbicacion);

            return (
              <Card key={product._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {product.type}
                    </Badge>
                    <Badge className={`${statusInfo.bgColor} ${statusInfo.color} text-xs`}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">{product.ubicacionFisica}</span>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Serial: </span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {product.serialNumber}
                    </code>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium text-gray-700">RFID: </span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                      {product.hexValue}
                    </code>
                  </div>

                  {product.lastCheckoutTime && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Último checkout: {new Date(product.lastCheckoutTime).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  )}

                  {product.estadoUbicacion === 'maintenance' && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Equipo en mantenimiento</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Search Section - siempre visible */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: "#1859A9" }}>
            <Search className="h-5 w-5" />
            Buscar Productos de Usuario
          </CardTitle>
          <CardDescription>
            Ingresa el código de acceso del usuario para ver todos los productos que tiene asignados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="userCode">Código de Usuario</Label>
              <Input
                id="userCode"
                placeholder="ej: USER-2025-ABC123 o ADMIN-2024-6DJK"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: USER-YYYY-XXXXX para usuarios o ADMIN-YYYY-XXXXX para administradores
              </p>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                disabled={loading}
                style={{ backgroundColor: "#FF8200", color: "white" }}
                className="hover:opacity-90"
              >
                {loading && viewMode === 'list' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Vista de Lista de Usuarios */}
      {viewMode === 'list' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: "#1859A9" }}>
              <Users className="h-5 w-5" />
              Todos los Usuarios ({allUsers.length})
            </CardTitle>
            <CardDescription>
              Haz clic en un usuario para ver sus equipos asignados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto" />
                <p className="text-gray-600 mt-4">Cargando usuarios...</p>
              </div>
            ) : allUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay usuarios
                </h3>
                <p className="text-gray-500">
                  No se encontraron usuarios en el sistema.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allUsers.map((user) => (
                  <Card
                    key={user._id}
                    className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-300"
                    onClick={() => handleUserClick(user)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">
                            {user.name} {user.lastName}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                        </Badge>
                        {user.equipment && user.equipment.length > 0 && (
                          <Badge style={{ backgroundColor: "#FF8200" }} className="text-white text-xs">
                            {user.equipment.length} {user.equipment.length === 1 ? 'equipo' : 'equipos'}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        <code className="bg-gray-100 px-2 py-1 rounded">
                          {user.codigo_acceso || 'Sin código'}
                        </code>
                      </div>
                      <div className="text-xs text-gray-500">
                        Cédula: {user.cedula}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Vista de Búsqueda */}
      {viewMode === 'search' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: "#1859A9" }}>
              <Package className="h-5 w-5" />
              Productos Asignados ({products.length})
            </CardTitle>
            <CardDescription>
              Usuario: <code className="font-mono bg-gray-100 px-2 py-1 rounded">{userCode}</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleBackToList}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la lista
            </Button>
            {renderProductCards(products)}
          </CardContent>
        </Card>
      )}

      {/* Vista de Detalle de Usuario */}
      {viewMode === 'detail' && selectedUser && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full"
                style={{ backgroundColor: "#1859A9" }}
              >
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle style={{ color: "#1859A9" }}>
                  {selectedUser.name} {selectedUser.lastName}
                </CardTitle>
                <CardDescription>
                  {selectedUser.email} • Cédula: {selectedUser.cedula}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="outline">
                {selectedUser.role === 'admin' ? 'Administrador' : 'Usuario'}
              </Badge>
              <Badge style={{ backgroundColor: "#FF8200" }} className="text-white">
                {products.length} {products.length === 1 ? 'equipo' : 'equipos'}
              </Badge>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">
                {selectedUser.codigo_acceso || 'Sin código'}
              </code>
            </div>
          </CardHeader>
          <CardContent>
            {renderProductCards(products, true)}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
