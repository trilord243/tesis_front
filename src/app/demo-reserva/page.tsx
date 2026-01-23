"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TutorialLensRequest } from "@/components/sections/tutorial-lens-request";
import { TutorialLabReservation } from "@/components/sections/tutorial-lab-reservation";
import { Glasses, Computer, ArrowRight, Info } from "lucide-react";

export default function DemoReservaPage() {
  const [selectedTutorial, setSelectedTutorial] = useState<"lens" | "lab" | null>(null);

  if (selectedTutorial === "lens") {
    return (
      <>
        <Navbar isAuthenticated={false} showAuthButtons={false} />
        <div className="min-h-screen bg-gray-50" style={{ paddingTop: "80px" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              onClick={() => setSelectedTutorial(null)}
              className="mb-6 text-brand-primary hover:text-brand-secondary font-medium flex items-center space-x-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Volver a selección de tutoriales</span>
            </button>
          </div>
          <TutorialLensRequest />
          <Footer />
        </div>
      </>
    );
  }

  if (selectedTutorial === "lab") {
    return (
      <>
        <Navbar isAuthenticated={false} showAuthButtons={false} />
        <div className="min-h-screen bg-gray-50" style={{ paddingTop: "80px" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              onClick={() => setSelectedTutorial(null)}
              className="mb-6 text-brand-primary hover:text-brand-secondary font-medium flex items-center space-x-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Volver a selección de tutoriales</span>
            </button>
          </div>
          <TutorialLabReservation />
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar isAuthenticated={false} showAuthButtons={false} />
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: "80px" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-roboto-condensed font-black text-brand-primary mb-4">
              ¿Cómo Reservar en CentroMundoX?
            </h1>
            <p className="text-xl text-brand-gray max-w-3xl mx-auto">
              Contamos con <strong>dos sistemas de reserva</strong>. Selecciona el
              que necesites para ver el tutorial paso a paso.
            </p>
          </div>

          {/* Info Box */}
          <div className="max-w-4xl mx-auto mb-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-roboto-condensed font-bold text-lg text-blue-900 mb-2">
                  Tutoriales Interactivos Reales
                </h3>
                <p className="text-blue-800">
                  Estos tutoriales muestran el <strong>flujo real</strong> de cada
                  sistema de reserva tal como funcionan en la plataforma. Incluyen
                  tours interactivos paso a paso con ejemplos reales.
                </p>
              </div>
            </div>
          </div>

          {/* Tutorial Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Lens Request Card */}
            <div
              onClick={() => setSelectedTutorial("lens")}
              className="group bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-brand-primary hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
            >
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-8">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow">
                  <Glasses className="w-10 h-10 text-brand-primary" />
                </div>
                <h2 className="text-2xl font-roboto-condensed font-bold text-brand-primary text-center mb-2">
                  Lentes VR/AR
                </h2>
                <p className="text-center text-gray-600 text-sm">
                  Solicitud de equipos de realidad virtual y aumentada
                </p>
              </div>

              <div className="p-8 space-y-4">
                <div className="space-y-3">
                  <h3 className="font-roboto font-bold text-brand-secondary mb-3">
                    ¿Qué aprenderás?
                  </h3>
                  {[
                    "Formulario simple de solicitud",
                    "Razón de uso y detalles",
                    "Opción de uso externo",
                    "Proceso de aprobación",
                    "Código de acceso por email",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-brand-orange rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Duración: ~5 min
                    </span>
                    <ArrowRight className="w-5 h-5 text-brand-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lab Reservation Card */}
            <div
              onClick={() => setSelectedTutorial("lab")}
              className="group bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-brand-primary hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-green-500/10 p-8">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow">
                  <Computer className="w-10 h-10 text-brand-primary" />
                </div>
                <h2 className="text-2xl font-roboto-condensed font-bold text-brand-primary text-center mb-2">
                  Laboratorio de Computadoras
                </h2>
                <p className="text-center text-gray-600 text-sm">
                  Reserva de computadoras de alto rendimiento
                </p>
              </div>

              <div className="p-8 space-y-4">
                <div className="space-y-3">
                  <h3 className="font-roboto font-bold text-brand-secondary mb-3">
                    ¿Qué aprenderás?
                  </h3>
                  {[
                    "Asistente de 7 pasos",
                    "Selección de software y propósito",
                    "Elegir computadora específica",
                    "Bloques horarios (7AM-5:30PM)",
                    "Fechas únicas o recurrentes",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-brand-orange rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Duración: ~8 min
                    </span>
                    <ArrowRight className="w-5 h-5 text-brand-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center max-w-4xl mx-auto bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-roboto-condensed font-bold mb-3">
              ¿Ya tienes una cuenta?
            </h3>
            <p className="mb-6 opacity-90">
              Si ya estás registrado, inicia sesión para acceder a los sistemas de
              reserva reales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/login"
                className="bg-white text-brand-primary hover:bg-gray-100 font-roboto font-bold px-8 py-3 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </a>
              <a
                href="/auth/register"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-primary font-roboto font-bold px-8 py-3 rounded-lg transition-colors"
              >
                Crear Cuenta
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
