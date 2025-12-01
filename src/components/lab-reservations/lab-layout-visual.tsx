"use client";

import { useState, useMemo } from "react";
import { Computer } from "@/types/lab-reservation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Cpu, HardDrive, Monitor, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LabLayoutVisualProps {
  computers: Computer[];
  selectedComputerNumber?: number;
  onSelect: (computerNumber: number) => void;
  disabled?: boolean;
  userType: string; // The user's type from the form (e.g., "estudiante", "profesor", etc.)
}

// Helper function to check if user has access to a computer
function userHasAccess(computer: Computer, userType: string): boolean {
  // If accessLevel is "normal" or allowedUserTypes is empty, everyone has access
  if (computer.accessLevel === "normal") return true;
  if (!computer.allowedUserTypes || computer.allowedUserTypes.length === 0) {
    // If special but no allowed types, nobody has access (except admin)
    return false;
  }
  // Check if user's type is in the allowed list
  return computer.allowedUserTypes.includes(userType);
}

export function LabLayoutVisual({
  computers,
  selectedComputerNumber,
  onSelect,
  disabled = false,
  userType,
}: LabLayoutVisualProps) {
  const [selectedForDetails, setSelectedForDetails] = useState<Computer | null>(null);

  // Calcular las dimensiones de la grilla basándose en las posiciones de las computadoras
  const gridDimensions = useMemo(() => {
    if (computers.length === 0) {
      return { rows: 4, cols: 6 };
    }
    const maxRow = Math.max(...computers.map((c) => c.gridRow ?? 0));
    const maxCol = Math.max(...computers.map((c) => c.gridCol ?? 0));
    return {
      rows: Math.max(maxRow + 1, 4),
      cols: Math.max(maxCol + 1, 6),
    };
  }, [computers]);

  // Obtener computadora en una posición específica
  const getComputerAt = (row: number, col: number): Computer | undefined => {
    return computers.find((c) => (c.gridRow ?? 0) === row && (c.gridCol ?? 0) === col);
  };

  // Verificar si hay computadoras con posiciones definidas
  const hasGridPositions = useMemo(() => {
    return computers.some((c) => c.gridRow !== undefined && c.gridRow !== 0 || c.gridCol !== undefined && c.gridCol !== 0);
  }, [computers]);

  // Fallback: separar computadoras por número si no hay posiciones definidas
  const topComputers = useMemo(() => {
    if (hasGridPositions) return [];
    return computers.filter(c => c.number >= 1 && c.number <= 5).sort((a, b) => a.number - b.number);
  }, [computers, hasGridPositions]);

  const leftComputers = useMemo(() => {
    if (hasGridPositions) return [];
    return computers.filter(c => c.number >= 6 && c.number <= 9).sort((a, b) => a.number - b.number);
  }, [computers, hasGridPositions]);

  const handleComputerClick = (computer: Computer) => {
    // Check if user has access to this computer using the new allowedUserTypes system
    const hasAccess = userHasAccess(computer, userType);

    if (!disabled && computer.isAvailable && hasAccess) {
      setSelectedForDetails(computer);
    }
  };

  const handleSelect = () => {
    if (selectedForDetails) {
      onSelect(selectedForDetails.number);
      setSelectedForDetails(null);
    }
  };

  const ComputerStation = ({ computer }: { computer: Computer }) => {
    const isSelected = selectedComputerNumber === computer.number;
    const isAvailable = computer.isAvailable;
    const isRestricted = computer.accessLevel === "special";
    const hasAccess = userHasAccess(computer, userType);

    return (
      <div
        className={`
          relative transition-all duration-300 group
          ${!isAvailable || !hasAccess ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${disabled ? "cursor-not-allowed" : ""}
        `}
        onClick={() => handleComputerClick(computer)}
      >
        {/* Computer Setup */}
        <div className="flex flex-col items-center gap-2">
          {/* Monitor */}
          <div
            className={`
              w-20 h-16 rounded-lg relative
              transition-all duration-300
              ${isSelected ? "ring-4 ring-blue-500 bg-blue-100" : "bg-gray-200"}
              ${isAvailable && !disabled ? "hover:bg-gray-300 hover:scale-105" : ""}
              ${isRestricted ? "border-2 border-orange-400" : "border-2 border-gray-400"}
            `}
          >
            <Monitor className={`absolute inset-0 m-auto h-8 w-8 ${isSelected ? "text-blue-600" : "text-gray-600"}`} />

            {/* Computer Number Badge */}
            <div
              className={`
                absolute -top-2 -right-2
                w-6 h-6 rounded-full
                flex items-center justify-center
                text-xs font-bold
                ${isSelected ? "bg-blue-500 text-white" : isRestricted ? "bg-orange-500 text-white" : "bg-gray-700 text-white"}
              `}
            >
              {computer.number}
            </div>

            {/* Selected Checkmark */}
            {isSelected && (
              <div className="absolute -bottom-1 -right-1">
                <CheckCircle2 className="h-5 w-5 text-blue-500 bg-white rounded-full" />
              </div>
            )}

            {/* Not Available X */}
            {!isAvailable && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-70 rounded-lg">
                <span className="text-white font-bold text-2xl">✕</span>
              </div>
            )}
          </div>

          {/* Keyboard (decorative) */}
          <div className="w-16 h-2 bg-gray-700 rounded-sm"></div>
        </div>

        {/* Hover Info */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
          {!hasAccess ? (
            <span className="text-orange-300 font-semibold">
              Acceso restringido
            </span>
          ) : (
            <>
              {computer.name}
              <br />
              <span className="text-gray-300">{computer.specialization}</span>
            </>
          )}
        </div>
      </div>
    );
  };

  // Renderizar celda de la grilla dinámica
  const renderGridCell = (row: number, col: number) => {
    const computer = getComputerAt(row, col);
    if (!computer) {
      return (
        <div
          key={`${row}-${col}`}
          className="w-24 h-24 border border-dashed border-gray-200 rounded-lg"
        />
      );
    }
    return (
      <div key={`${row}-${col}`} className="w-24 h-24 flex items-center justify-center">
        <ComputerStation computer={computer} />
      </div>
    );
  };

  return (
    <>
      <div className="w-full bg-gray-50 rounded-lg p-8 border-2 border-gray-300">
        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Distribución del Laboratorio</h3>
          <p className="text-sm text-gray-600">Haz clic en una computadora para ver sus especificaciones</p>
        </div>

        {/* Lab Layout - Dynamic Grid or Legacy Layout */}
        {hasGridPositions ? (
          // Dynamic Grid Layout based on database positions
          <div className="flex justify-center">
            <div
              className="inline-grid gap-3 bg-white rounded-lg border-2 border-gray-300 p-6"
              style={{
                gridTemplateColumns: `repeat(${gridDimensions.cols}, 1fr)`,
              }}
            >
              {Array.from({ length: gridDimensions.rows }).map((_, row) =>
                Array.from({ length: gridDimensions.cols }).map((_, col) =>
                  renderGridCell(row, col)
                )
              )}
            </div>
          </div>
        ) : (
          // Legacy Layout (fallback for computers without grid positions)
          <div className="relative">
            {/* Top Row - Normal Access Computers (1-5) */}
            <div className="mb-8">
              <div className="flex justify-center items-center gap-8 p-6 bg-white rounded-lg border-2 border-blue-300">
                <Badge className="absolute top-2 right-2 bg-blue-500">
                  Acceso General
                </Badge>
                {topComputers.map((computer) => (
                  <ComputerStation key={computer._id} computer={computer} />
                ))}
              </div>
            </div>

            {/* Main Area with Left Column */}
            <div className="flex gap-4">
              {/* Left Column - CFD/Metaverso Computers (6-9) */}
              <div className="flex flex-col gap-8 p-6 bg-white rounded-lg border-2 border-orange-300 min-w-[140px]">
                <Badge className="bg-orange-500 text-center mb-2 text-white">
                  Uso CFD/Metaverso
                </Badge>
                {leftComputers.map((computer) => (
                  <ComputerStation key={computer._id} computer={computer} />
                ))}
              </div>

              {/* Center Work Area */}
              <div className="flex-1 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[600px]">
                <div className="text-center text-gray-400">
                  <p className="text-lg font-semibold">Área de Trabajo</p>
                  <p className="text-sm mt-2">Las computadoras están distribuidas alrededor del laboratorio</p>
                  {selectedComputerNumber && (
                    <div className="mt-4">
                      <Badge className="bg-blue-500 text-lg py-2 px-4">
                        Computadora #{selectedComputerNumber} Seleccionada
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Computer Indicator (for dynamic grid) */}
        {hasGridPositions && selectedComputerNumber && (
          <div className="mt-4 flex justify-center">
            <Badge className="bg-blue-500 text-lg py-2 px-4">
              Computadora #{selectedComputerNumber} Seleccionada
            </Badge>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-500"></div>
            <span>Seleccionada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 border-2 border-gray-400"></div>
            <span>Acceso General</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-100 border-2 border-orange-400"></div>
            <span>Acceso Restringido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 border-2 border-gray-400 opacity-50"></div>
            <span>No Disponible</span>
          </div>
        </div>
      </div>

      {/* Specifications Dialog */}
      <Dialog open={!!selectedForDetails} onOpenChange={() => setSelectedForDetails(null)}>
        <DialogContent className="max-w-[700px]">
          {selectedForDetails && (
            <>
              <DialogHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <DialogTitle className="text-xl sm:text-2xl flex flex-wrap items-center gap-2">
                    <span className="break-words">{selectedForDetails.name}</span>
                    {selectedForDetails.accessLevel === "special" && (
                      <Badge className="bg-orange-500 text-white text-xs">CFD/Metaverso</Badge>
                    )}
                  </DialogTitle>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                    #{selectedForDetails.number}
                  </div>
                </div>
                <DialogDescription className="text-base sm:text-lg break-words">
                  {selectedForDetails.specialization}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Description */}
                <p className="text-gray-700 text-sm sm:text-base break-words">{selectedForDetails.description}</p>

                {/* Specifications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Cpu className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">Procesador</p>
                      <p className="text-sm text-gray-700 break-words">{selectedForDetails.cpu}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Monitor className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">Tarjeta Gráfica</p>
                      <p className="text-sm text-gray-700 break-words">{selectedForDetails.gpu}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HardDrive className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">Memoria RAM</p>
                      <p className="text-sm text-gray-700 break-words">{selectedForDetails.ram}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HardDrive className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">Almacenamiento</p>
                      <p className="text-sm text-gray-700 break-words">{selectedForDetails.storage}</p>
                    </div>
                  </div>
                </div>

                {/* Software */}
                <div>
                  <p className="font-semibold mb-2">Software Instalado:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedForDetails.software.map((sw, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {sw}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    onClick={handleSelect}
                    disabled={disabled || !selectedForDetails.isAvailable}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    {selectedComputerNumber === selectedForDetails.number
                      ? "Seleccionada ✓"
                      : "Seleccionar esta Computadora"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedForDetails(null)}
                  >
                    Cerrar
                  </Button>
                </div>

                {!selectedForDetails.isAvailable && (
                  <p className="text-red-600 text-sm text-center">
                    Esta computadora no está disponible actualmente (en mantenimiento)
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
