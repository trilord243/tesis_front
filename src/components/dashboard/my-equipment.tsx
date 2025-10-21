"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { Product, estadoLabels } from "@/types/admin-products";

interface MyEquipmentProps {
  products: Product[];
}

export function MyEquipment({ products }: MyEquipmentProps) {
  const getStatusInfo = (estado: string) => {
    const info = estadoLabels[estado as keyof typeof estadoLabels];
    return info || { label: estado, color: "text-gray-800", bgColor: "bg-gray-100" };
  };

  if (products.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle style={{ color: "#1859A9" }}>
            Mis Equipos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sin equipos asignados
            </h3>
            <p className="text-gray-500">
              Actualmente no tienes equipos asignados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle style={{ color: "#1859A9" }}>
          Mis Equipos ({products.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  );
}
