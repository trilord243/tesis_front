"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendToMaintenance, updateProductLocation } from "@/lib/maintenance";
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
import { CheckCircle, MapPin, Wrench } from "lucide-react";
import type { Product } from "@/types/product";

interface AssetLocationDialogProps {
  asset: Product;
  isOpen: boolean;
  onClose: () => void;
  mode: "location" | "maintenance";
}

export function AssetLocationDialog({
  asset,
  isOpen,
  onClose,
  mode,
}: AssetLocationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    newLocation: mode === "maintenance" ? "Área de Mantenimiento" : "",
    status: mode === "maintenance" ? "maintenance" : "available",
    notes: "",
    maintenanceType: "",
    expectedReturn: "",
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      let result;
      
      if (mode === "maintenance") {
        // Enviar a mantenimiento
        console.log("Asset data:", asset);
        console.log("Asset ID being sent:", asset._id);
        
        const maintenanceData = {
          type: formData.maintenanceType || "Mantenimiento general",
          description: formData.notes || "Mantenimiento programado",
          expectedReturn: formData.expectedReturn,
          technician: "", // Podrías agregar un campo para esto
          notes: formData.notes,
        };
        
        console.log("Maintenance data:", maintenanceData);
        result = await sendToMaintenance(asset._id, maintenanceData);
      } else {
        // Solo cambiar ubicación
        result = await updateProductLocation(
          asset._id,
          formData.newLocation,
          formData.notes
        );
      }
      
      if (result.success) {
        // Reset form
        setFormData({
          newLocation: "",
          status: "available",
          notes: "",
          maintenanceType: "",
          expectedReturn: "",
        });
        
        // Recargar la página para mostrar los cambios
        window.location.reload();
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar el activo");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "maintenance" ? (
              <>
                <Wrench className="h-5 w-5" style={{ color: "#FF8200" }} />
                Enviar a Mantenimiento
              </>
            ) : (
              <>
                <MapPin className="h-5 w-5" style={{ color: "#1859A9" }} />
                Actualizar Ubicación
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            <strong>{asset.name}</strong> ({asset.codigo})
            <br />
            S/N: {asset.serialNumber}
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

          {mode === "maintenance" && (
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
              placeholder={
                mode === "maintenance" 
                  ? "Descripción del problema o trabajo a realizar..." 
                  : "Observaciones adicionales..."
              }
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{ 
              backgroundColor: mode === "maintenance" ? "#FF8200" : "#1859A9" 
            }}
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
  );
}