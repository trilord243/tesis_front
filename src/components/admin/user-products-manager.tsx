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
import { Search, User, Package, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { getUserProducts } from "@/lib/admin-products";
import { Product, estadoLabels } from "@/types/admin-products";

export function UserProductsManager() {
  const [userCode, setUserCode] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!userCode.trim()) {
      setError("Por favor ingresa un código de usuario");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      const result = await getUserProducts(userCode.trim());
      setProducts(result);
      
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

  return (
    <div className="space-y-6">
      {/* Search Section */}
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

      {/* Results Section */}
      {searchPerformed && !loading && products.length > 0 && (
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
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {searchPerformed && !loading && products.length === 0 && !error && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin productos asignados
          </h3>
          <p className="text-gray-500">
            El usuario <code className="font-mono bg-gray-100 px-2 py-1 rounded">{userCode}</code> no tiene productos asignados actualmente.
          </p>
        </div>
      )}

      {/* Instructions */}
      {!searchPerformed && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <User className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Buscar Productos de Usuario
                </h3>
                <p className="text-gray-500 mt-1">
                  Ingresa un código de usuario para ver todos los productos que tiene asignados
                </p>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Ejemplos de códigos válidos:</strong></p>
                <p><code className="bg-gray-100 px-2 py-1 rounded">USER-2025-ABC123</code> - Usuario regular</p>
                <p><code className="bg-gray-100 px-2 py-1 rounded">ADMIN-2024-6DJK</code> - Administrador</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}