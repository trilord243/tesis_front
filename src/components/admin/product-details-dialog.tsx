"use client";

import { useState } from "react";
import { Eye, Package, MapPin, Calendar, Hash, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product } from "@/types/product";
import { ProductHistoryDashboard } from "./product-history-dashboard";
import { ProductUsageLogs } from "./product-usage-logs";

interface ProductDetailsDialogProps {
  product: Product & { 
    location?: string; 
    locationColor?: string;
  };
}

export function ProductDetailsDialog({ product }: ProductDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" title="Ver detalles">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Activo</DialogTitle>
          <DialogDescription>
            Información completa del activo
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Información Principal */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#1859A920", color: "#1859A9" }}
                >
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{product.type}</p>
                </div>
              </div>
              <Badge 
                variant={product.isAvailable ? "default" : "secondary"}
                className={product.isAvailable 
                  ? "bg-green-100 text-green-800 border-green-200" 
                  : "bg-orange-100 text-orange-800 border-orange-200"}
              >
                {product.isAvailable ? "Disponible" : "En Uso"}
              </Badge>
            </div>
          </div>

          {/* Detalles Técnicos */}
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm text-gray-700 mb-3">Información Técnica</h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <Hash className="h-4 w-4" />
                  <span>Número de Serie</span>
                </div>
                <p className="font-medium pl-6">{product.serialNumber}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <Cpu className="h-4 w-4" />
                  <span>Código</span>
                </div>
                <p className="font-medium pl-6">{product.codigo}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Hash className="h-4 w-4" />
                <span>RFID Tag (Hexadecimal)</span>
              </div>
              <p className="font-mono text-xs bg-gray-100 p-2 rounded pl-6 break-all">
                {product.hexValue}
              </p>
            </div>
          </div>

          {/* Ubicación */}
          {product.location && (
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Ubicación Actual</h4>
              <div className="flex items-center gap-3">
                <MapPin className={`h-5 w-5 ${product.locationColor || 'text-gray-500'}`} />
                <span className={`font-medium ${product.locationColor || 'text-gray-700'}`}>
                  {product.location}
                </span>
              </div>
              <p className="text-xs text-gray-500 pl-8">
                {product.location === "Gabinete RFID" 
                  ? "El activo está almacenado de forma segura en el gabinete con control RFID"
                  : "El activo está actualmente en préstamo a un usuario"}
              </p>
            </div>
          )}

          {/* Información del Sistema */}
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm text-gray-700">Información del Sistema</h4>
            
            <div className="space-y-2 text-sm">
              <div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Fecha de Registro</span>
                </div>
                <p className="font-medium pl-6">{formatDate(product.createdAt)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Última Actualización</span>
                </div>
                <p className="font-medium pl-6">{formatDate(product.updatedAt)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Hash className="h-4 w-4" />
                  <span>ID del Sistema</span>
                </div>
                <p className="font-mono text-xs pl-6">{product._id}</p>
              </div>
            </div>
          </div>

          {/* Información Adicional para Controllers */}
          {product.type === "controller" && product.headsetId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Este controlador está asociado a un headset
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Headset ID: {product.headsetId}
              </p>
            </div>
          )}

          {/* Tabs for History and Usage Logs */}
          <div className="border-t pt-4">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history">Historial</TabsTrigger>
                <TabsTrigger value="usage">Uso y Logs</TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="mt-4">
                <ProductHistoryDashboard product={product} />
              </TabsContent>
              <TabsContent value="usage" className="mt-4">
                <ProductUsageLogs
                  productId={product._id}
                  productName={product.name}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}