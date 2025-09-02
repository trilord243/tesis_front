"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Package } from "lucide-react";
import { completeMaintenance } from "@/lib/maintenance";
import type { Product } from "@/types/product";

interface CompleteMaintenanceDialogProps {
  asset: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function CompleteMaintenanceDialog({
  asset,
  isOpen,
  onClose,
}: CompleteMaintenanceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    actualReturn: new Date().toISOString().split('T')[0], // Fecha de hoy
    finalCost: "",
    completionNotes: "",
    newLocation: "Laboratorio del metaverso", // Ubicación predeterminada
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const completeData = {
        actualReturn: formData.actualReturn,
        ...(formData.finalCost && { finalCost: parseFloat(formData.finalCost) }),
        ...(formData.completionNotes && { completionNotes: formData.completionNotes }),
        ...(formData.newLocation && { newLocation: formData.newLocation }),
      };
      
      const result = await completeMaintenance(asset._id, completeData);
      
      if (result.success) {
        // Reset form
        setFormData({
          actualReturn: new Date().toISOString().split('T')[0],
          finalCost: "",
          completionNotes: "",
          newLocation: "Laboratorio del metaverso",
        });
        
        // Recargar la página para mostrar los cambios
        window.location.reload();
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al completar el mantenimiento");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" style={{ color: "#10B981" }} />
            Completar Mantenimiento
          </DialogTitle>
          <DialogDescription>
            <strong>{asset.name}</strong> ({asset.codigo})
            <br />
            Marcar como disponible y asignar ubicación
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="actualReturn">Fecha de Retorno *</Label>
            <Input
              id="actualReturn"
              type="date"
              value={formData.actualReturn}
              onChange={(e) => setFormData({ ...formData, actualReturn: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="newLocation">Nueva Ubicación *</Label>
            <Input
              id="newLocation"
              value={formData.newLocation}
              onChange={(e) => setFormData({ ...formData, newLocation: e.target.value })}
              placeholder="Ej: Laboratorio del metaverso"
              required
            />
          </div>

          <div>
            <Label htmlFor="finalCost">Costo Final (opcional)</Label>
            <Input
              id="finalCost"
              type="number"
              step="0.01"
              value={formData.finalCost}
              onChange={(e) => setFormData({ ...formData, finalCost: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="completionNotes">Notas de Finalización</Label>
            <Textarea
              id="completionNotes"
              value={formData.completionNotes}
              onChange={(e) => setFormData({ ...formData, completionNotes: e.target.value })}
              placeholder="Ej: Mantenimiento completado exitosamente, dispositivo calibrado..."
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
            disabled={isLoading || !formData.actualReturn || !formData.newLocation}
            style={{ backgroundColor: "#10B981" }}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Completando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Disponible
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}