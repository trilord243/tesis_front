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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MapPin,
  Package,
  Filter,
  RefreshCw,
  Calendar,
  AlertTriangle,
  User,
} from "lucide-react";
import {
  getProductsByLocation,
  searchProductsByLocation,
  getLocationSummary,
  getProductUser,
} from "@/lib/admin-products";
import {
  Product,
  LocationSummary,
  ProductUserResponse,
  estadoLabels,
} from "@/types/admin-products";

interface LocationInventoryDashboardProps {
  initialLocationSummary: LocationSummary[];
}

export function LocationInventoryDashboard({
  initialLocationSummary,
}: LocationInventoryDashboardProps) {
  const [locationSummary, setLocationSummary] = useState<LocationSummary[]>(
    initialLocationSummary
  );
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [productUsers, setProductUsers] = useState<
    Record<string, ProductUserResponse>
  >({});
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("summary");

  const refreshSummary = async () => {
    try {
      const summary = await getLocationSummary();
      setLocationSummary(summary);
    } catch (error) {
      console.error("Error refreshing location summary:", error);
    }
  };

  const handleLocationSelect = async (location: string) => {
    setSelectedLocation(location);
    setActiveTab("products");
    setSearchQuery("");
    setError(null);
    setLoading(true);

    try {
      const result = await getProductsByLocation(location);
      setProducts(result);
      setSearchPerformed(true);

      // Fetch user data for each product
      const userPromises = result.map(async (product) => {
        if (product.currentUser) {
          try {
            const userResponse = await getProductUser(product._id);
            return { [product._id]: userResponse };
          } catch (error) {
            console.error(`Error fetching user for product ${product._id}:`, error);
            return { [product._id]: null };
          }
        }
        return { [product._id]: null };
      });

      const userResults = await Promise.all(userPromises);
      const usersMap = userResults.reduce((acc, userObj) => ({ ...acc, ...userObj }), {});
      setProductUsers(usersMap);

      if (result.length === 0) {
        setError(`No se encontraron productos en la ubicación: ${location}`);
      }
    } catch (error) {
      console.error("Error fetching products by location:", error);
      setError("Error al buscar productos por ubicación");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Por favor ingresa un término de búsqueda");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setSelectedLocation("");

    try {
      const result = await searchProductsByLocation(searchQuery.trim());
      setProducts(result);

      // Fetch user data for each product
      const userPromises = result.map(async (product) => {
        if (product.currentUser) {
          try {
            const userResponse = await getProductUser(product._id);
            return { [product._id]: userResponse };
          } catch (error) {
            console.error(`Error fetching user for product ${product._id}:`, error);
            return { [product._id]: null };
          }
        }
        return { [product._id]: null };
      });

      const userResults = await Promise.all(userPromises);
      const usersMap = userResults.reduce((acc, userObj) => ({ ...acc, ...userObj }), {});
      setProductUsers(usersMap);

      if (result.length === 0) {
        setError(`No se encontraron productos que coincidan con: "${searchQuery}"`);
      }
    } catch (error) {
      console.error("Error searching products by location:", error);
      setError("Error al buscar productos");
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

  const clearSearch = () => {
    setSearchQuery("");
    setProducts([]);
    setProductUsers({});
    setSelectedLocation("");
    setSearchPerformed(false);
    setError(null);
    setActiveTab("summary");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary">Resumen por Ubicación</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          {/* Header with Refresh */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                Resumen por Ubicaciones
              </h2>
              <p className="text-gray-600">
                Total de ubicaciones: {locationSummary.length}
              </p>
            </div>
            <Button
              onClick={refreshSummary}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>

          {/* Location Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {locationSummary.map((location) => (
              <Card
                key={location.location}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleLocationSelect(location.location)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start justify-between text-sm">
                    <div className="flex items-start gap-2 min-w-0 flex-1 mr-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#FF8200" }} />
                      <span 
                        className="break-words text-sm leading-5 font-medium" 
                        title={location.location}
                        style={{ 
                          wordBreak: "break-word",
                          hyphens: "auto",
                          lineHeight: "1.4"
                        }}
                      >
                        {location.location}
                      </span>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0 ml-1">
                      {location.count}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-gray-600">
                    <p>
                      {location.count === 1 
                        ? "1 producto" 
                        : `${location.count} productos`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {locationSummary.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sin ubicaciones disponibles
              </h3>
              <p className="text-gray-500">
                No se encontraron productos con ubicaciones definidas.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#1859A9" }}>
                <Filter className="h-5 w-5" />
                Filtrar Productos por Ubicación
              </CardTitle>
              <CardDescription>
                Busca productos por texto en la ubicación física o selecciona una ubicación específica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="locationSearch">Buscar por Ubicación</Label>
                    <Input
                      id="locationSearch"
                      placeholder="ej: Laboratorio, Gabinete, Estante A, etc."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button
                      onClick={handleSearch}
                      disabled={loading}
                      style={{ backgroundColor: "#FF8200", color: "white" }}
                      className="hover:opacity-90"
                    >
                      {loading ? (
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
                    {(searchPerformed || selectedLocation) && (
                      <Button
                        onClick={clearSearch}
                        variant="outline"
                        size="sm"
                      >
                        Limpiar
                      </Button>
                    )}
                  </div>
                </div>

                {selectedLocation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800 font-medium">
                        Mostrando productos en: {selectedLocation}
                      </span>
                    </div>
                  </div>
                )}
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

          {/* Results Section */}
          {searchPerformed && !loading && products.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: "#1859A9" }}>
                  <Package className="h-5 w-5" />
                  Productos Encontrados ({products.length})
                </CardTitle>
                {selectedLocation ? (
                  <CardDescription>
                    Ubicación: <code className="font-mono bg-gray-100 px-2 py-1 rounded">{selectedLocation}</code>
                  </CardDescription>
                ) : (
                  <CardDescription>
                    Búsqueda: <code className="font-mono bg-gray-100 px-2 py-1 rounded">{searchQuery}</code>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {products.map((product) => {
                    const statusInfo = getStatusInfo(product.estadoUbicacion);
                    const userInfo = productUsers[product._id];

                    return (
                      <Card key={product._id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{product.name}</CardTitle>
                          <div className="flex items-center gap-2 flex-wrap">
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

                          {/* User Information */}
                          {userInfo && userInfo.user ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-blue-800">Usuario Asignado</span>
                              </div>
                              <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Nombre:</span> {userInfo.user.name}</p>
                                <p><span className="font-medium">Email:</span> {userInfo.user.email}</p>
                                <p>
                                  <span className="font-medium">Código:</span>{" "}
                                  <code className="bg-white px-2 py-1 rounded text-xs">
                                    {userInfo.user.codigo_acceso}
                                  </code>
                                </p>
                              </div>
                            </div>
                          ) : product.currentUser ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                <span className="text-yellow-800 text-sm">
                                  Usuario asignado pero no se pudieron cargar los datos
                                </span>
                              </div>
                            </div>
                          ) : null}

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
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {searchPerformed && !loading && products.length === 0 && !error && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sin productos encontrados
              </h3>
              <p className="text-gray-500">
                {selectedLocation 
                  ? `No se encontraron productos en la ubicación "${selectedLocation}".`
                  : `No se encontraron productos que coincidan con "${searchQuery}".`}
              </p>
            </div>
          )}

          {/* Instructions */}
          {!searchPerformed && !selectedLocation && (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Filter className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Filtrar Productos por Ubicación
                    </h3>
                    <p className="text-gray-500 mt-1">
                      Busca productos ingresando parte de la ubicación o selecciona una ubicación desde el resumen
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Ejemplos de búsqueda:</strong></p>
                    <p><code className="bg-gray-100 px-2 py-1 rounded">Laboratorio</code></p>
                    <p><code className="bg-gray-100 px-2 py-1 rounded">Gabinete A</code></p>
                    <p><code className="bg-gray-100 px-2 py-1 rounded">Estante</code></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}