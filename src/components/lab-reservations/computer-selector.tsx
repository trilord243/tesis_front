"use client";

import { useState, useEffect } from "react";
import { Computer, UserType } from "@/types/lab-reservation";
import { ComputerCard } from "./computer-card";
import { LabLayoutVisual } from "./lab-layout-visual";
import { UnityPlayer } from "@/components/unity/unity-player";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, LayoutGrid, Building2, Box } from "lucide-react";

// Helper function to check if user has access to a computer (same logic as lab-layout-visual)
function userHasAccessToComputer(computer: Computer, userTypeValue: string): boolean {
  if (computer.accessLevel === "normal") return true;
  if (!computer.allowedUserTypes || computer.allowedUserTypes.length === 0) return false;
  return computer.allowedUserTypes.includes(userTypeValue);
}

interface ComputerSelectorProps {
  userType: UserType;
  selectedComputerNumber?: number;
  onSelect: (computerNumber: number) => void;
}

type ViewMode = "grid" | "layout" | "3d";

export function ComputerSelector({
  userType,
  selectedComputerNumber,
  onSelect,
}: ComputerSelectorProps) {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("layout"); // Default to visual layout

  useEffect(() => {
    const fetchComputers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all computers - access control is done on the frontend based on allowedUserTypes
        const response = await fetch(`/api/computers`);

        if (!response.ok) {
          throw new Error("Error al cargar las computadoras");
        }

        const data: Computer[] = await response.json();
        setComputers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar las computadoras");
      } finally {
        setLoading(false);
      }
    };

    fetchComputers();
  }, [userType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Cargando computadoras...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-900">{error}</AlertDescription>
      </Alert>
    );
  }

  if (computers.length === 0) {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-900">
          No hay computadoras disponibles en este momento.
        </AlertDescription>
      </Alert>
    );
  }

  // Count computers the user has access to
  const accessibleComputers = computers.filter((c) => userHasAccessToComputer(c, userType));
  const availableAndAccessibleCount = accessibleComputers.filter((c) => c.isAvailable).length;
  const totalAccessibleCount = accessibleComputers.length;
  const maintenanceCount = accessibleComputers.filter((c) => !c.isAvailable).length;

  return (
    <div className="space-y-4">
      {/* Info Alert */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          Como usuario <strong>{userType}</strong>, tienes acceso a{" "}
          <strong>{totalAccessibleCount} computadora(s)</strong> del laboratorio.
          {totalAccessibleCount < computers.length && (
            <span className="block mt-2 text-sm">
              Algunas computadoras tienen acceso restringido a ciertos tipos de usuario.
            </span>
          )}
          {maintenanceCount > 0 && (
            <span className="block mt-2">
              {maintenanceCount} computadora(s) en mantenimiento.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* View Mode Toggle */}
      <div className="flex justify-end gap-2 flex-wrap">
        <Button
          variant={viewMode === "layout" ? "primary" : "outline"}
          size="sm"
          onClick={() => setViewMode("layout")}
          className="flex items-center gap-2"
        >
          <Building2 className="h-4 w-4" />
          Vista del Laboratorio
        </Button>
        <Button
          variant={viewMode === "grid" ? "primary" : "outline"}
          size="sm"
          onClick={() => setViewMode("grid")}
          className="flex items-center gap-2"
        >
          <LayoutGrid className="h-4 w-4" />
          Vista de Tarjetas
        </Button>
        <Button
          variant={viewMode === "3d" ? "primary" : "outline"}
          size="sm"
          onClick={() => setViewMode("3d")}
          className="flex items-center gap-2"
        >
          <Box className="h-4 w-4" />
          Vista 3D
        </Button>
      </div>

      {/* Computer Display */}
      {viewMode === "layout" ? (
        <LabLayoutVisual
          computers={computers}
          {...(selectedComputerNumber !== undefined && { selectedComputerNumber })}
          onSelect={onSelect}
          userType={userType}
        />
      ) : viewMode === "3d" ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Vista 3D del Laboratorio:</strong> Explora el laboratorio virtualmente.
              Usa WASD para moverte y el mouse para mirar alrededor. Haz clic en el visor para comenzar.
            </p>
          </div>
          <div className="flex justify-center">
            <UnityPlayer width={1100} height={620} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {computers.map((computer) => {
            // Check access using the new allowedUserTypes system
            const hasAccess = userHasAccessToComputer(computer, userType);
            const isDisabled = !computer.isAvailable || !hasAccess;

            const restrictedMessage = !hasAccess ? "Acceso restringido" : undefined;

            return (
              <ComputerCard
                key={computer._id}
                computer={computer}
                selected={selectedComputerNumber === computer.number}
                disabled={isDisabled}
                onClick={() => !isDisabled && onSelect(computer.number)}
                {...(restrictedMessage && { restrictedMessage })}
              />
            );
          })}
        </div>
      )}

      {/* Selection Reminder */}
      {!selectedComputerNumber && (
        <Alert className="bg-orange-50 border-orange-200">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-900">
            Por favor, selecciona una computadora para continuar con tu reserva.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
