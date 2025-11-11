"use client";

import { useState, useEffect } from "react";
import { Computer, UserType, UserGroup } from "@/types/lab-reservation";
import { ComputerCard } from "./computer-card";
import { LabLayoutVisual } from "./lab-layout-visual";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, LayoutGrid, Building2 } from "lucide-react";

interface ComputerSelectorProps {
  userType: UserType;
  selectedComputerNumber?: number;
  onSelect: (computerNumber: number) => void;
}

type ViewMode = "grid" | "layout";

export function ComputerSelector({
  userType,
  selectedComputerNumber,
  onSelect,
}: ComputerSelectorProps) {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("layout"); // Default to visual layout

  // Determine user group based on user type
  const getUserGroup = (): UserGroup => {
    if (userType === UserType.CFD || userType === UserType.ESTUDIANTE_CENTRO_MUNDO_X) {
      return UserGroup.CFD;
    }
    return UserGroup.NORMAL;
  };

  useEffect(() => {
    const fetchComputers = async () => {
      setLoading(true);
      setError(null);

      try {
        const userGroup = getUserGroup();
        const response = await fetch(`/api/computers?userGroup=${userGroup}`);

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

  const userGroup = getUserGroup();
  const availableCount = computers.filter((c) => c.isAvailable).length;

  return (
    <div className="space-y-4">
      {/* Info Alert */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          {userGroup === UserGroup.NORMAL ? (
            <>
              Como usuario <strong>{userType}</strong>, tienes acceso a{" "}
              <strong>5 computadoras</strong> de acceso general (ubicadas en la parte superior del laboratorio).
              <span className="block mt-2 text-sm">
                Las computadoras del lateral izquierdo (6-9) están reservadas para uso CFD/Metaverso.
              </span>
            </>
          ) : (
            <>
              Como miembro de <strong>{userType}</strong>, tienes acceso a{" "}
              <strong>todas las 9 computadoras</strong> del laboratorio,
              incluyendo las 5 de acceso general (arriba) y las 4 de uso CFD/Metaverso (lateral izquierdo).
            </>
          )}
          {availableCount < computers.length && (
            <span className="block mt-2">
              {computers.length - availableCount} computadora(s) en mantenimiento.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* View Mode Toggle */}
      <div className="flex justify-end gap-2">
        <Button
          variant={viewMode === "layout" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("layout")}
          className="flex items-center gap-2"
        >
          <Building2 className="h-4 w-4" />
          Vista del Laboratorio
        </Button>
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("grid")}
          className="flex items-center gap-2"
        >
          <LayoutGrid className="h-4 w-4" />
          Vista de Tarjetas
        </Button>
      </div>

      {/* Computer Display */}
      {viewMode === "layout" ? (
        <LabLayoutVisual
          computers={computers}
          selectedComputerNumber={selectedComputerNumber}
          onSelect={onSelect}
          userGroup={userGroup}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {computers.map((computer) => {
            // Disable special access computers for normal users
            const isDisabledForUser = userGroup === UserGroup.NORMAL && computer.accessLevel === 'special';
            const isDisabled = !computer.isAvailable || isDisabledForUser;

            return (
              <ComputerCard
                key={computer._id}
                computer={computer}
                selected={selectedComputerNumber === computer.number}
                disabled={isDisabled}
                onClick={() => !isDisabled && onSelect(computer.number)}
                restrictedMessage={isDisabledForUser ? "Solo disponible CFD/Metaverso" : undefined}
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
