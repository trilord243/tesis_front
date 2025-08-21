"use client";

import { FileText } from "lucide-react";

interface ReservationTourProps {
  readonly isMobile?: boolean;
}

export function ReservationTour({ isMobile = false }: ReservationTourProps) {
  const handleReservationGuide = () => {
    // Redirigir a la página demo interactiva
    window.location.href = "/demo-reserva";
  };

  return (
    <button
      onClick={handleReservationGuide}
      className={`flex items-center space-x-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-roboto font-semibold rounded-lg transition-colors ${
        isMobile ? "w-full justify-center" : ""
      }`}
    >
      <FileText className="w-4 h-4" />
      <span>¿Cómo Solicitar Lentes?</span>
    </button>
  );
}
