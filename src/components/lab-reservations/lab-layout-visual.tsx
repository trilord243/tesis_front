"use client";

import { useState } from "react";
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
}

export function LabLayoutVisual({
  computers,
  selectedComputerNumber,
  onSelect,
  disabled = false,
}: LabLayoutVisualProps) {
  const [selectedForDetails, setSelectedForDetails] = useState<Computer | null>(null);

  // Separar computadoras por posición
  // Top row: computadoras 1-4 (normal access - acceso general)
  const topComputers = computers.filter(c => c.number >= 1 && c.number <= 4).sort((a, b) => a.number - b.number);
  // Left column: computadoras 5-9 (special access - CFD/Metaverso)
  const leftComputers = computers.filter(c => c.number >= 5 && c.number <= 9).sort((a, b) => a.number - b.number);

  const handleComputerClick = (computer: Computer) => {
    if (!disabled && computer.isAvailable) {
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
    const isPremium = computer.accessLevel === "special";

    return (
      <div
        className={`
          relative cursor-pointer transition-all duration-300 group
          ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}
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
              ${isPremium ? "border-2 border-orange-400" : "border-2 border-gray-400"}
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
                ${isSelected ? "bg-blue-500 text-white" : isPremium ? "bg-orange-500 text-white" : "bg-gray-700 text-white"}
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
          {computer.name}
          <br />
          <span className="text-gray-300">{computer.specialization}</span>
        </div>
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

        {/* Lab Layout */}
        <div className="relative">
          {/* Top Row - Normal Access Computers (1-4) */}
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
            {/* Left Column - CFD/Metaverso Computers (5-9) */}
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

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-4 text-sm">
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
            <span>CFD/Metaverso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 border-2 border-gray-400 opacity-50"></div>
            <span>En Mantenimiento</span>
          </div>
        </div>
      </div>

      {/* Specifications Dialog */}
      <Dialog open={!!selectedForDetails} onOpenChange={() => setSelectedForDetails(null)}>
        <DialogContent className="max-w-2xl">
          {selectedForDetails && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl">
                    {selectedForDetails.name}
                    {selectedForDetails.accessLevel === "special" && (
                      <Badge className="ml-2 bg-orange-500 text-white">CFD/Metaverso</Badge>
                    )}
                  </DialogTitle>
                  <div className="text-3xl font-bold text-blue-600">
                    #{selectedForDetails.number}
                  </div>
                </div>
                <DialogDescription className="text-lg">
                  {selectedForDetails.specialization}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Description */}
                <p className="text-gray-700">{selectedForDetails.description}</p>

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Cpu className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Procesador</p>
                      <p className="text-sm text-gray-700">{selectedForDetails.cpu}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Monitor className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Tarjeta Gráfica</p>
                      <p className="text-sm text-gray-700">{selectedForDetails.gpu}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HardDrive className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Memoria RAM</p>
                      <p className="text-sm text-gray-700">{selectedForDetails.ram}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HardDrive className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Almacenamiento</p>
                      <p className="text-sm text-gray-700">{selectedForDetails.storage}</p>
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
                <div className="flex gap-2 pt-4">
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
