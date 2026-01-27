"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import {
  Computer,
  Play,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Code,
  FileText,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import "driver.js/dist/driver.css";

function DemoStep({
  title,
  children,
  stepNumber,
}: {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly stepNumber: number;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white text-brand-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {stepNumber}
          </div>
          <h3 className="text-white font-roboto-condensed font-bold text-xl">
            {title}
          </h3>
        </div>
      </div>
      <div className="p-8 sm:p-10 lg:p-12">{children}</div>
    </div>
  );
}

function MockLabForm() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div
      data-tour="lab-wizard"
      className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      {/* Progress bar */}
      <div data-tour="progress" className="bg-gray-100 px-8 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-brand-primary">
            Paso {currentStep} de 7
          </span>
          <span className="text-xs text-gray-600">
            {Math.round((currentStep / 7) * 100)}% completado
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-brand-primary h-2 rounded-full transition-all"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-8 sm:p-10">
        {/* Step 1: User Type */}
        {currentStep === 1 && (
          <div data-tour="step-user-type" className="space-y-6">
            <div>
              <h3 className="text-2xl font-roboto-condensed font-bold text-brand-primary mb-2">
                Tipo de Usuario
              </h3>
              <p className="text-gray-600">Indica tu tipo de usuario</p>
            </div>

            <div className="space-y-3">
              {[
                "Profesor",
                "Estudiante",
                "CFD",
                "Centro Mundo X Estudiante",
                "Otro",
              ].map((type, idx) => (
                <div
                  key={type}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    idx === 1
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-gray-200 hover:border-brand-primary/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        idx === 1
                          ? "border-brand-primary bg-brand-primary"
                          : "border-gray-300"
                      } flex items-center justify-center`}
                    >
                      {idx === 1 && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-medium">{type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Software */}
        {currentStep === 2 && (
          <div data-tour="step-software" className="space-y-6">
            <div>
              <h3 className="text-2xl font-roboto-condensed font-bold text-brand-primary mb-2">
                Software Requerido
              </h3>
              <p className="text-gray-600">
                Selecciona el software que necesitarás usar (puedes elegir varios)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["Unity", "Blender", "Autodesk", "ANSYS", "MATLAB", "Otro"].map(
                (software, idx) => (
                  <div
                    key={software}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      idx < 2
                        ? "border-brand-primary bg-brand-primary/5"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded ${
                          idx < 2
                            ? "bg-brand-primary border-2 border-brand-primary"
                            : "border-2 border-gray-300"
                        } flex items-center justify-center`}
                      >
                        {idx < 2 && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="font-medium">{software}</p>
                        {software === "Unity" && (
                          <p className="text-xs text-gray-500">
                            Desarrollo de juegos y simulaciones 3D
                          </p>
                        )}
                        {software === "Blender" && (
                          <p className="text-xs text-gray-500">
                            Modelado y animación 3D
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              💡 Selecciona todos los programas que necesites para tu proyecto
            </p>
          </div>
        )}

        {/* Step 3: Purpose */}
        {currentStep === 3 && (
          <div data-tour="step-purpose" className="space-y-6">
            <div>
              <h3 className="text-2xl font-roboto-condensed font-bold text-brand-primary mb-2">
                Propósito de Uso
              </h3>
              <p className="text-gray-600">¿Para qué usarás las computadoras?</p>
            </div>

            <div className="space-y-3">
              {["Tesis", "Clases", "Trabajo Industrial", "Minor", "Otro"].map(
                (purpose, idx) => (
                  <div
                    key={purpose}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      idx === 0
                        ? "border-brand-primary bg-brand-primary/5"
                        : "border-gray-200 hover:border-brand-primary/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          idx === 0
                            ? "border-brand-primary bg-brand-primary"
                            : "border-gray-300"
                        } flex items-center justify-center`}
                      >
                        {idx === 0 && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="font-medium">{purpose}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Step 4: Description */}
        {currentStep === 4 && (
          <div data-tour="step-description" className="space-y-6">
            <div>
              <h3 className="text-2xl font-roboto-condensed font-bold text-brand-primary mb-2">
                Descripción del Proyecto
              </h3>
              <p className="text-gray-600">
                Describe tu proyecto o actividad (mínimo 20 caracteres)
              </p>
            </div>

            <div>
              <textarea
                rows={6}
                value="Desarrollo de mi tesis de maestría sobre simulación de entornos urbanos en realidad virtual. Necesito renderizar modelos 3D complejos de edificios y analizar su comportamiento bajo diferentes condiciones de iluminación natural."
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">194/500 caracteres</p>
                <span className="text-xs text-green-600 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Mínimo alcanzado</span>
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Tip:</strong> Una descripción detallada ayuda a los
                administradores a entender tus necesidades y aprobar más rápido.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Computer Selection */}
        {currentStep === 5 && (
          <div data-tour="step-computer" className="space-y-6">
            <div>
              <h3 className="text-2xl font-roboto-condensed font-bold text-brand-primary mb-2">
                Seleccionar Computadora
              </h3>
              <p className="text-gray-600">
                Elige la computadora que mejor se adapte a tus necesidades
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div
                  key={num}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    num === 3
                      ? "border-brand-primary bg-brand-primary/10 ring-2 ring-brand-primary"
                      : "border-gray-200 hover:border-brand-primary/50"
                  }`}
                >
                  <div className="text-center">
                    <Computer
                      className={`w-8 h-8 mx-auto mb-2 ${
                        num === 3 ? "text-brand-primary" : "text-gray-400"
                      }`}
                    />
                    <p className="font-bold text-lg">PC #{num}</p>
                    {num === 3 && (
                      <div className="mt-2 space-y-1 text-xs text-left">
                        <p className="text-gray-700">
                          <strong>CPU:</strong> Intel i9-13900K
                        </p>
                        <p className="text-gray-700">
                          <strong>GPU:</strong> RTX 4090
                        </p>
                        <p className="text-gray-700">
                          <strong>RAM:</strong> 64GB DDR5
                        </p>
                        <div className="mt-2 pt-2 border-t">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                            Disponible
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              💡 Solo puedes ver las computadoras a las que tu tipo de usuario
              tiene acceso
            </p>
          </div>
        )}

        {/* Step 6: Time Blocks */}
        {currentStep === 6 && (
          <div data-tour="step-time-blocks" className="space-y-6">
            <div>
              <h3 className="text-2xl font-roboto-condensed font-bold text-brand-primary mb-2">
                Bloques Horarios
              </h3>
              <p className="text-gray-600">
                Selecciona hasta 3 bloques (máximo 5h 15min por día)
              </p>
            </div>

            <div className="space-y-3">
              {[
                { time: "07:00 - 08:45", duration: "1h 45min", block: 1 },
                { time: "08:45 - 10:30", duration: "1h 45min", block: 2 },
                { time: "10:30 - 12:15", duration: "1h 45min", block: 3 },
                { time: "12:15 - 14:00", duration: "1h 45min", block: 4 },
                { time: "14:00 - 15:45", duration: "1h 45min", block: 5 },
                { time: "15:45 - 17:30", duration: "1h 45min", block: 6 },
              ].map(({ time, duration, block }) => (
                <div
                  key={block}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    block >= 2 && block <= 3
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded ${
                          block >= 2 && block <= 3
                            ? "bg-brand-primary"
                            : "border-2 border-gray-300"
                        } flex items-center justify-center`}
                      >
                        {block >= 2 && block <= 3 && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold">{time}</p>
                        <p className="text-xs text-gray-500">
                          Bloque {block} • {duration}
                        </p>
                      </div>
                    </div>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium">
                ✅ 2 bloques seleccionados = 3h 30min total
              </p>
            </div>
          </div>
        )}

        {/* Step 7: Dates */}
        {currentStep === 7 && (
          <div data-tour="step-dates" className="space-y-6">
            <div>
              <h3 className="text-2xl font-roboto-condensed font-bold text-brand-primary mb-2">
                Fechas de Reserva
              </h3>
              <p className="text-gray-600">Configura las fechas para tu reserva</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b">
              <button className="px-4 py-2 border-b-2 border-brand-primary text-brand-primary font-medium">
                Fechas Únicas
              </button>
              <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                Recurrente Semanal
              </button>
            </div>

            {/* Selected dates */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">
                Fechas seleccionadas:
              </p>
              {[
                { date: "2025-02-15", day: "Lunes" },
                { date: "2025-02-17", day: "Miércoles" },
                { date: "2025-02-20", day: "Jueves" },
              ].map(({ date, day }) => (
                <div
                  key={date}
                  className="border border-gray-200 rounded-lg p-3 bg-blue-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{date}</p>
                      <p className="text-sm text-gray-600">{day}</p>
                    </div>
                    <div className="text-xs text-gray-600">
                      08:45 - 12:15 • 2 bloques
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
              ⚠️ <strong>Nota:</strong> Las fechas donde ya tienes reservas
              aprobadas están deshabilitadas
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            ← Anterior
          </button>

          {currentStep < 7 ? (
            <button
              onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
              className="bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-secondary flex items-center space-x-2"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button className="bg-brand-orange text-white px-8 py-2 rounded-lg hover:bg-brand-orange/90 font-bold">
              Ver Resumen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MockPreview() {
  return (
    <div
      data-tour="preview"
      className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-8 py-6 border-b">
        <h3 className="text-xl font-roboto-condensed font-bold text-brand-primary mb-2">
          Resumen de tu Reserva
        </h3>
        <p className="text-gray-600">
          Revisa todos los detalles antes de enviar
        </p>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Tipo de Usuario</p>
            <p className="font-medium">Estudiante</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Propósito</p>
            <p className="font-medium">Tesis</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Software</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Unity
            </span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Blender
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Computadora</p>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="font-bold">PC #3</p>
            <p className="text-sm text-gray-600 mt-1">
              Intel i9-13900K • RTX 4090 • 64GB RAM
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Fechas y Horarios</p>
          <div className="space-y-2">
            {[
              { date: "15 Feb 2025", day: "Lun", time: "08:45 - 12:15" },
              { date: "17 Feb 2025", day: "Mié", time: "08:45 - 12:15" },
              { date: "20 Feb 2025", day: "Jue", time: "08:45 - 12:15" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-brand-primary" />
                  <div>
                    <p className="font-medium">{item.date}</p>
                    <p className="text-xs text-gray-500">{item.day}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          data-tour="submit-reservation"
          className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-4 rounded-lg transition-colors"
        >
          Enviar Reserva
        </button>
      </div>
    </div>
  );
}

export function TutorialLabReservation() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .driver-popover {
        --driver-primary-color: #1859A9;
        --driver-secondary-color: #FF8200;
        font-family: 'Roboto', sans-serif;
      }
      .driver-popover-title {
        font-family: 'Roboto Condensed', sans-serif;
        font-weight: 700;
        color: var(--driver-primary-color);
        font-size: 1.25rem;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      progressText: "{{current}} de {{total}}",
      nextBtnText: "Siguiente →",
      prevBtnText: "← Anterior",
      doneBtnText: "¡Finalizar!",
      steps: [
        {
          element: '[data-tour="lab-wizard"]',
          popover: {
            title: "🖥️ Asistente de Reserva",
            description: `
              <p>Este es el <strong>asistente real</strong> de 7 pasos para reservar computadoras del laboratorio.</p>
              <p class="text-sm mt-2">Acceso: <strong>Dashboard → Reservar Lab de Computadoras</strong></p>
            `,
            side: "top",
            align: "center",
          },
        },
        {
          element: '[data-tour="progress"]',
          popover: {
            title: "📊 Barra de Progreso",
            description: `
              <p>Muestra tu avance a través de los 7 pasos del formulario.</p>
              <p class="text-sm text-gray-600 mt-2">Puedes volver atrás en cualquier momento.</p>
            `,
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-tour="step-user-type"]',
          popover: {
            title: "1️⃣ Tipo de Usuario",
            description: `
              <p><strong>Primer paso:</strong> Selecciona tu tipo de usuario.</p>
              <ul class="list-disc ml-4 mt-2 text-sm">
                <li>Opciones configuradas por administradores</li>
                <li>Si seleccionas "Otro", debes escribir tu tipo</li>
                <li>Determina qué computadoras puedes usar</li>
              </ul>
            `,
            side: "right",
            align: "start",
          },
        },
        {
          element: '[data-tour="step-software"]',
          popover: {
            title: "2️⃣ Software Requerido",
            description: `
              <p><strong>Paso 2:</strong> Selecciona el software que necesitas.</p>
              <ul class="list-disc ml-4 mt-2 text-sm">
                <li>Puedes seleccionar <strong>múltiples opciones</strong></li>
                <li>Si seleccionas "Otro", especifica cuál</li>
                <li>Al menos 1 debe estar seleccionado</li>
              </ul>
            `,
            side: "left",
            align: "start",
          },
        },
        {
          element: '[data-tour="step-purpose"]',
          popover: {
            title: "3️⃣ Propósito de Uso",
            description: `
              <p><strong>Paso 3:</strong> Indica para qué usarás las computadoras.</p>
              <p class="text-sm mt-2">Opciones comunes: Tesis, Clases, Trabajo Industrial, Minor</p>
            `,
            side: "right",
            align: "start",
          },
        },
        {
          element: '[data-tour="step-description"]',
          popover: {
            title: "4️⃣ Descripción del Proyecto",
            description: `
              <p><strong>Paso 4:</strong> Describe tu proyecto o actividad.</p>
              <ul class="list-disc ml-4 mt-2 text-sm">
                <li><strong>Mínimo 20 caracteres</strong> requeridos</li>
                <li>Máximo 500 caracteres</li>
                <li>Contador en tiempo real</li>
              </ul>
            `,
            side: "left",
            align: "start",
          },
        },
        {
          element: '[data-tour="step-computer"]',
          popover: {
            title: "5️⃣ Selección de Computadora",
            description: `
              <p><strong>Paso 5:</strong> Elige la computadora que necesitas.</p>
              <ul class="list-disc ml-4 mt-2 text-sm">
                <li>9 computadoras disponibles</li>
                <li>Solo ves las que tu tipo de usuario puede acceder</li>
                <li>Muestra specs: CPU, GPU, RAM</li>
                <li>Indica disponibilidad en tiempo real</li>
              </ul>
            `,
            side: "top",
            align: "center",
          },
        },
        {
          element: '[data-tour="step-time-blocks"]',
          popover: {
            title: "6️⃣ Bloques Horarios",
            description: `
              <p><strong>Paso 6:</strong> Selecciona los bloques de tiempo.</p>
              <ul class="list-disc ml-4 mt-2 text-sm">
                <li>6 bloques disponibles (1h 45min cada uno)</li>
                <li><strong>Máximo 3 bloques</strong> por día</li>
                <li>Horario: 7:00 AM - 5:30 PM</li>
                <li>Muestra duración total</li>
              </ul>
            `,
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-tour="step-dates"]',
          popover: {
            title: "7️⃣ Fechas de Reserva",
            description: `
              <p><strong>Paso 7:</strong> Configura las fechas.</p>
              <p class="font-medium mt-2">Dos modos:</p>
              <ul class="list-disc ml-4 mt-1 text-sm">
                <li><strong>Fechas únicas:</strong> Selecciona días específicos</li>
                <li><strong>Recurrente:</strong> Días de la semana por N semanas</li>
              </ul>
              <p class="text-sm bg-yellow-50 p-2 rounded mt-2">
                ⚠️ Fechas con reservas aprobadas están bloqueadas
              </p>
            `,
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-tour="preview"]',
          popover: {
            title: "📋 Resumen Final",
            description: `
              <p><strong>Antes de enviar</strong>, revisa todos los detalles:</p>
              <ul class="list-disc ml-4 mt-2 text-sm">
                <li>Usuario, propósito, software</li>
                <li>Computadora seleccionada con specs</li>
                <li>Todas las fechas y horarios</li>
              </ul>
              <p class="text-sm bg-blue-50 p-2 rounded mt-2">
                💡 Puedes editar cualquier paso antes de enviar
              </p>
            `,
            side: "top",
            align: "center",
          },
        },
        {
          element: '[data-tour="submit-reservation"]',
          popover: {
            title: "📤 Enviar Reserva",
            description: `
              <p><strong>¡Último paso!</strong></p>
              <p class="text-sm mt-2">Al enviar:</p>
              <ul class="list-disc ml-4 mt-1 text-sm">
                <li>Crea una solicitud por cada fecha</li>
                <li>Estado inicial: <strong>Pendiente</strong></li>
                <li>Espera revisión administrativa</li>
                <li>Recibes notificación de aprobación/rechazo</li>
              </ul>
            `,
            side: "top",
            align: "center",
          },
        },
      ],
    });

    driverObj.drive();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-3 mb-4">
          <Computer className="w-10 h-10 text-brand-primary" />
          <h1 className="text-4xl font-roboto-condensed font-black text-brand-primary">
            Tutorial: Reserva de Laboratorio
          </h1>
        </div>
        <p className="text-xl text-brand-gray mb-8 max-w-3xl mx-auto">
          Aprende el proceso REAL de 7 pasos para reservar computadoras del
          laboratorio en CentroMundoX.
        </p>

        <button
          onClick={startTour}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white font-roboto font-bold px-8 py-4 rounded-lg transition-colors flex items-center space-x-3 mx-auto"
        >
          <Play className="w-5 h-5" />
          <span>Iniciar Tour Interactivo</span>
        </button>
      </div>

      <div className="space-y-12">
        <DemoStep title="Asistente de 7 Pasos" stepNumber={1}>
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-roboto-condensed font-bold text-xl text-brand-primary mb-4">
                Flujo Completo del Proceso
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Users, title: "1. Tipo de Usuario", desc: "Profesor, Estudiante, CFD, etc." },
                  { icon: Code, title: "2. Software", desc: "Unity, Blender, ANSYS, etc." },
                  { icon: FileText, title: "3. Propósito", desc: "Tesis, Clases, Trabajo, etc." },
                  { icon: FileText, title: "4. Descripción", desc: "Min 20 caracteres" },
                  { icon: Computer, title: "5. Computadora", desc: "9 opciones disponibles" },
                  { icon: Clock, title: "6. Bloques", desc: "Máx 3 bloques (5h 15min)" },
                  { icon: Calendar, title: "7. Fechas", desc: "Únicas o recurrentes" },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <step.icon className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-brand-secondary">{step.title}</p>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <MockLabForm />
          </div>
        </DemoStep>

        <DemoStep title="Resumen y Envío" stepNumber={2}>
          <div className="space-y-8">
            <MockPreview />

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h4 className="font-roboto-condensed font-bold text-xl text-brand-primary mb-3 text-center">
                ¿Qué pasa después del envío?
              </h4>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                {[
                  { step: "1", title: "Revisión", desc: "Admin revisa tu solicitud" },
                  { step: "2", title: "Aprobación", desc: "Verifica disponibilidad" },
                  { step: "3", title: "Notificación", desc: "Recibes confirmación" },
                ].map((item) => (
                  <div key={item.step} className="bg-white rounded-lg p-4 text-center">
                    <div className="bg-brand-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3 font-bold">
                      {item.step}
                    </div>
                    <p className="font-bold text-brand-secondary mb-1">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DemoStep>
      </div>

      <div className="mt-16 text-center bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-roboto-condensed font-bold mb-4">
          ¿Listo para Reservar el Laboratorio?
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Ahora que conoces el proceso completo de 7 pasos, crea tu cuenta y
          reserva las computadoras de alto rendimiento.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/auth/register"
            className="bg-white text-brand-primary hover:bg-gray-100 font-roboto font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Crear Cuenta
          </a>
          <a
            href="/auth/login"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-primary font-roboto font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  );
}
