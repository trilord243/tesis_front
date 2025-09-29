"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  MapPin,
  Wrench,
  Search,
  Filter,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductPrintButton } from "@/components/admin/product-print-button";
import { AssetLocationDialog } from "@/components/admin/asset-location-dialog";
import { CompleteMaintenanceDialog } from "@/components/admin/complete-maintenance-dialog";
import { ProductHistoryDashboard } from "@/components/admin/product-history-dashboard";
import type { Product } from "@/types/product";

interface AssetsListProps {
  products: Product[];
}

export function AssetsList({ products }: AssetsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Product | null>(null);
  const [dialogType, setDialogType] = useState<"location" | "maintenance" | "complete" | null>(null);

  // Filter products based on search term (by name, serial number, or code)
  const filteredProducts = products.filter(product => {
    const search = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(search) ||
      product.serialNumber?.toLowerCase().includes(search) ||
      product.codigo?.toLowerCase().includes(search)
    );
  });

  const handleLocationUpdate = (product: Product) => {
    setSelectedAsset(product);
    setDialogType("location");
  };

  const handleSendToMaintenance = (product: Product) => {
    setSelectedAsset(product);
    setDialogType("maintenance");
  };

  const handleCloseDialog = () => {
    setSelectedAsset(null);
    setDialogType(null);
  };

  const getStatusBadge = (product: Product) => {
    // Usar estadoUbicacion si existe, si no, determinar por isAvailable
    const status = product.estadoUbicacion || (product.isAvailable ? "available" : "in_use");
    
    const statusConfig = {
      available: { bg: "bg-green-100", text: "text-green-800", label: "Disponible" },
      in_use: { bg: "bg-blue-100", text: "text-blue-800", label: "En Uso" },
      maintenance: { bg: "bg-orange-100", text: "text-orange-800", label: "Mantenimiento" },
      retired: { bg: "bg-red-100", text: "text-red-800", label: "Retirado" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    
    return (
      <span className={`px-3 py-1 text-sm rounded-full font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, código o número de serie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Assets List */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Asset Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between lg:justify-start lg:items-center gap-4 mb-2">
                    <h4 className="font-semibold text-lg" style={{ color: "#1859A9" }}>
                      {product.name}
                    </h4>
                    {getStatusBadge(product)}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="text-gray-600">
                      <span className="font-medium">Tipo:</span>{" "}
                      {product.type === "headset" ? "Headset VR" : "Controlador"}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">S/N:</span> {product.serialNumber}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Código:</span> {product.codigo}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Ubicación:</span>{" "}
                      {product.ubicacionFisica || "Lab. Principal"}
                    </div>
                  </div>
                  
                  {product.hexValue && (
                    <p className="text-gray-500 font-mono text-xs mt-2">
                      <span className="font-medium">RFID:</span> {product.hexValue}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                  {/* Si está en mantenimiento, mostrar botón para completar */}
                  {product.estadoUbicacion === "maintenance" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAsset(product);
                        setDialogType("complete");
                      }}
                      className="flex items-center gap-1"
                      style={{ borderColor: "#10B981", color: "#10B981" }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Completar Mantenimiento
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLocationUpdate(product)}
                        className="flex items-center gap-1"
                        style={{ borderColor: "#1859A9", color: "#1859A9" }}
                      >
                        <MapPin className="h-4 w-4" />
                        Cambiar Ubicación
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendToMaintenance(product)}
                        className="flex items-center gap-1"
                        style={{ borderColor: "#FF8200", color: "#FF8200" }}
                      >
                        <Wrench className="h-4 w-4" />
                        Mantenimiento
                      </Button>
                    </>
                  )}

                  <ProductHistoryDashboard product={product} />
                  <ProductPrintButton product={product} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? "No se encontraron activos con ese criterio de búsqueda" 
              : "No hay activos registrados en el sistema"}
          </p>
          {!searchTerm && (
            <Link href="/admin/activos/add">
              <Button style={{ backgroundColor: "#FF8200" }}>
                <Package className="h-4 w-4 mr-2" />
                Agregar Primer Activo
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Location/Maintenance Dialog */}
      {selectedAsset && dialogType !== "complete" && (
        <AssetLocationDialog
          asset={selectedAsset}
          isOpen={dialogType !== null}
          onClose={handleCloseDialog}
          mode={dialogType || "location"}
        />
      )}

      {/* Complete Maintenance Dialog */}
      {selectedAsset && dialogType === "complete" && (
        <CompleteMaintenanceDialog
          asset={selectedAsset}
          isOpen={true}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
}