"use client";

import { Computer } from "@/types/lab-reservation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, HardDrive, Monitor } from "lucide-react";

interface ComputerCardProps {
  computer: Computer;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function ComputerCard({ computer, selected, disabled, onClick }: ComputerCardProps) {
  return (
    <Card
      className={`
        cursor-pointer transition-all hover:shadow-lg
        ${selected ? "border-blue-500 border-2 bg-blue-50" : "border-gray-200"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      onClick={disabled ? undefined : onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {computer.name}
              {computer.accessLevel === "special" && (
                <Badge className="ml-2 bg-orange-500">Premium</Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {computer.specialization}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              #{computer.number}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Specifications */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-gray-500" />
              <span className="font-medium">CPU:</span>
              <span className="text-gray-700">{computer.cpu}</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-gray-500" />
              <span className="font-medium">GPU:</span>
              <span className="text-gray-700">{computer.gpu}</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-gray-500" />
              <span className="font-medium">RAM:</span>
              <span className="text-gray-700">{computer.ram}</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Storage:</span>
              <span className="text-gray-700">{computer.storage}</span>
            </div>
          </div>

          {/* Software */}
          <div>
            <p className="text-sm font-medium mb-2">Software disponible:</p>
            <div className="flex flex-wrap gap-1">
              {computer.software.slice(0, 3).map((sw, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {sw}
                </Badge>
              ))}
              {computer.software.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{computer.software.length - 3} más
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {computer.description}
          </p>

          {/* Status */}
          {!computer.isAvailable && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              En mantenimiento
            </Badge>
          )}

          {selected && (
            <Badge className="w-full justify-center bg-blue-500">
              Seleccionada
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
