"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { LabReservationsCalendar } from "@/components/admin/lab-reservations-calendar";
import { LabReservation } from "@/types/lab-reservation";
import { CalendarDays, ArrowLeft, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function CalendarioReservasPage() {
  const [reservations, setReservations] = useState<LabReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/lab-reservations");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al cargar las reservas");
      }

      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  return (
    <>
      <Navbar isAuthenticated={true} showAuthButtons={true} isAdmin={true} />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al Dashboard
              </Link>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#1859A920", color: "#1859A9" }}
                  >
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                      Calendario de Reservas de Laboratorio
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Vista mensual de todas las reservas aprobadas
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={loadReservations}
                    disabled={loading}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Actualizar
                  </Button>
                  <Link href="/admin/reservas-lab">
                    <Button>Ver Lista de Solicitudes</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Cargando calendario...</p>
            </div>
          )}

          {!loading && !error && (
            <div className="animated fadeIn">
              <LabReservationsCalendar reservations={reservations} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
