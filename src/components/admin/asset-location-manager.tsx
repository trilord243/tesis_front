"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  MapPin,
  Wrench,
  Package,
  CheckCircle,
  AlertCircle,
  Building,
  Clock,
  User,
} from "lucide-react";

interface AssetLocation {
  assetCode: string;
  assetName: string;
  currentLocation: string;
  status: 'available' | 'maintenance' | 'in_use' | 'retired';
  lastUpdated: string;
  updatedBy: string;
  notes?: string;
}

export function AssetLocationManager() {
  const [searchCode, setSearchCode] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<AssetLocation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<AssetLocation | null>(null);
  const [searchError, setSearchError] = useState("");
  
  const [formData, setFormData] = useState({
    newLocation: "",
    status: "available",
    notes: "",
    maintenanceType: "",
    expectedReturn: "",
  });

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      setSearchError("Por favor ingrese un código de activo");
      return;
    }

    setIsLoading(true);
    setSearchError("");
    
    // Simulación de búsqueda - aquí conectarías con tu API
    setTimeout(() => {
      // Ejemplo de resultado
      const mockAsset: AssetLocation = {
        assetCode: searchCode.toUpperCase(),
        assetName: "MetaQuest 3 #001",
        currentLocation: "Laboratorio VR Principal",
        status: "available",
        lastUpdated: new Date().toISOString(),
        updatedBy: "Admin",
      };
      
      setSearchResult(mockAsset);
      setSelectedAsset(mockAsset);
      setIsLoading(false);
    }, 1000);
  };

  const handleUpdateLocation = () => {
    setIsDialogOpen(true);
  };

  const handleSendToMaintenance = () => {
    setFormData({
      ...formData,
      status: "maintenance",
      newLocation: "Área de Mantenimiento",
    });
    setIsDialogOpen(true);
  };

  const handleSubmitUpdate = async () => {
    setIsLoading(true);
    
    // Aquí harías la llamada a tu API para actualizar la ubicación
    console.log("Actualizando activo:", {
      assetCode: selectedAsset?.assetCode,
      ...formData,
    });
    
    setTimeout(() => {
      setIsLoading(false);
      setIsDialogOpen(false);
      setSearchResult(null);
      setSelectedAsset(null);
      setSearchCode("");
      setFormData({
        newLocation: "",
        status: "available",
        notes: "",
        maintenanceType: "",
        expectedReturn: "",
      });
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50';
      case 'maintenance':
        return 'text-orange-600 bg-orange-50';
      case 'in_use':
        return 'text-blue-600 bg-blue-50';
      case 'retired':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'maintenance':
        return 'En Mantenimiento';
      case 'in_use':
        return 'En Uso';
      case 'retired':
        return 'Retirado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle style={{ color: "#1859A9" }}>
          Gestión de Ubicación de Activos
        </CardTitle>
        <CardDescription>
          Buscar activos por código para actualizar su ubicación o enviar a mantenimiento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="assetCode">Código del Activo</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="assetCode"
                placeholder="Ej: MQ3-2024-001"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                onClick={handleSearch} 
                disabled={isLoading}
                style={{ backgroundColor: "#1859A9" }}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </div>

        {searchError && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {searchError}
            </AlertDescription>
          </Alert>
        )}

        {/* Search Results */}
        {searchResult && (
          <div className="border rounded-lg p-4 space-y-4" style={{ backgroundColor: "#f9fafb" }}>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" style={{ color: "#1859A9" }} />
                  <span className="font-semibold text-lg">{searchResult.assetName}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(searchResult.status)}`}>
                    {getStatusText(searchResult.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Ubicación actual: <strong>{searchResult.currentLocation}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Última actualización: {new Date(searchResult.lastUpdated).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Actualizado por: {searchResult.updatedBy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>Código: {searchResult.assetCode}</span>
                  </div>
                </div>

                {searchResult.notes && (
                  <div className="mt-2 p-2 bg-white rounded text-sm text-gray-600">
                    <strong>Notas:</strong> {searchResult.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                onClick={handleUpdateLocation}
                variant="outline"
                style={{ borderColor: "#1859A9", color: "#1859A9" }}
              >
                <Building className="h-4 w-4 mr-2" />
                Cambiar Ubicación
              </Button>
              <Button
                onClick={handleSendToMaintenance}
                style={{ backgroundColor: "#FF8200" }}
              >
                <Wrench className="h-4 w-4 mr-2" />
                Enviar a Mantenimiento
              </Button>
            </div>
          </div>
        )}

        {/* Update Location Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {formData.status === 'maintenance' ? 'Enviar a Mantenimiento' : 'Actualizar Ubicación'}
              </DialogTitle>
              <DialogDescription>
                Activo: {selectedAsset?.assetName} ({selectedAsset?.assetCode})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Estado del Activo</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="maintenance">En Mantenimiento</SelectItem>
                    <SelectItem value="in_use">En Uso</SelectItem>
                    <SelectItem value="retired">Retirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="newLocation">Nueva Ubicación</Label>
                <Input
                  id="newLocation"
                  value={formData.newLocation}
                  onChange={(e) => setFormData({ ...formData, newLocation: e.target.value })}
                  placeholder="Ej: Laboratorio VR Principal, Torre A, Piso 3"
                />
              </div>

              {formData.status === 'maintenance' && (
                <>
                  <div>
                    <Label htmlFor="maintenanceType">Tipo de Mantenimiento</Label>
                    <Select
                      value={formData.maintenanceType}
                      onValueChange={(value) => setFormData({ ...formData, maintenanceType: value })}
                    >
                      <SelectTrigger id="maintenanceType">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preventive">Preventivo</SelectItem>
                        <SelectItem value="corrective">Correctivo</SelectItem>
                        <SelectItem value="calibration">Calibración</SelectItem>
                        <SelectItem value="cleaning">Limpieza Profunda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expectedReturn">Fecha Estimada de Retorno</Label>
                    <Input
                      id="expectedReturn"
                      type="date"
                      value={formData.expectedReturn}
                      onChange={(e) => setFormData({ ...formData, expectedReturn: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observaciones adicionales..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmitUpdate}
                disabled={isLoading}
                style={{ backgroundColor: "#1859A9" }}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}