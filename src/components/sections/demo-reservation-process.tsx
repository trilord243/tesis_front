"use client";

import { useState, useEffect } from "react";
import { driver } from "driver.js";
import {
  User,
  Calendar,
  Clock,
  Computer,
  Headphones,
  Settings,
  Send,
  CheckCircle,
  Mail,
  QrCode,
  ArrowRight,
  Play,
} from "lucide-react";
import "driver.js/dist/driver.css";

// Mock data para el demo
const DEMO_USER = {
  name: "María",
  lastName: "García",
  email: "maria.garcia@universidad.edu.co",
  cedula: "1234567890",
};

const EQUIPMENT_OPTIONS = [
  {
    id: "computer",
    name: "Computador de Alto Rendimiento",
    icon: Computer,
    specs: ["Intel i9-13900K", "32GB RAM DDR5", "RTX 4090", "SSD 1TB NVMe"],
    available: 8,
  },
  {
    id: "vr",
    name: "Realidad Virtual",
    icon: Headphones,
    specs: [
      "Meta Quest Pro",
      "HTC Vive Pro 2",
      "Controladores precisión",
      "Software VR",
    ],
    available: 4,
  },
  {
    id: "specialized",
    name: "Equipos Especializados",
    icon: Settings,
    specs: [
      "Sensores IoT",
      "Equipos medición",
      "Cámaras 4K",
      "Instrumentos lab",
    ],
    available: 12,
  },
];

interface DemoStepProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly stepNumber: number;
}

function DemoStep({ title, children, stepNumber }: DemoStepProps) {
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

function MockLoginForm() {
  return (
    <div
      data-tour="demo-login"
      className="max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      <div className="px-8 sm:px-12 lg:px-16 pt-8 pb-8 space-y-6">
        <div className="text-center mb-8">
          <div className="bg-brand-primary text-white rounded-lg p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-roboto-condensed font-black text-brand-primary">
            Iniciar Sesión
          </h2>
          <p className="text-brand-gray mt-3 text-lg">
            Accede a tu dashboard de reservas
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-base sm:text-lg font-roboto font-semibold text-brand-secondary mb-3">
              Email
            </label>
            <input
              type="email"
              value={DEMO_USER.email}
              readOnly
              title="Email de ejemplo para el demo"
              placeholder="Email de usuario"
              className="w-full px-5 py-4 text-base sm:text-lg border border-gray-300 rounded-lg bg-gray-50 text-brand-gray focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-base sm:text-lg font-roboto font-semibold text-brand-secondary mb-3">
              Contraseña
            </label>
            <input
              type="password"
              value="••••••••"
              readOnly
              title="Contraseña de ejemplo para el demo"
              placeholder="Contraseña"
              className="w-full px-5 py-4 text-base sm:text-lg border border-gray-300 rounded-lg bg-gray-50 text-brand-gray focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
            />
          </div>

          <button className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-roboto font-bold py-4 text-base sm:text-lg lg:text-xl rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

function MockDashboard() {
  return (
    <div
      data-tour="demo-dashboard"
      className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-brand-primary/5 to-brand-orange/5 px-8 py-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-roboto-condensed font-bold text-brand-primary">
              Dashboard - {DEMO_USER.name} {DEMO_USER.lastName}
            </h2>
            <p className="text-brand-gray text-sm sm:text-base mt-1">
              Gestiona tus reservas de equipos
            </p>
          </div>
          <div className="bg-brand-orange text-white px-6 py-3 rounded-lg font-roboto font-semibold text-sm sm:text-base">
            Nueva Solicitud +
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-10">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-brand-primary mb-2">3</div>
            <div className="text-sm sm:text-base text-brand-gray">
              Reservas Activas
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">12</div>
            <div className="text-sm sm:text-base text-brand-gray">
              Completadas
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">1</div>
            <div className="text-sm sm:text-base text-brand-gray">
              Pendientes
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-brand-gray text-base sm:text-lg mb-6">
            ¿Necesitas reservar equipos para tu investigación?
          </p>
          <button className="bg-brand-orange hover:bg-brand-orange/90 text-white font-roboto font-bold px-8 py-4 text-base sm:text-lg rounded-lg transition-colors">
            Crear Nueva Solicitud
          </button>
        </div>
      </div>
    </div>
  );
}

function MockReservationForm() {
  const [selectedEquipment, setSelectedEquipment] = useState("computer");
  const [selectedDate, setSelectedDate] = useState("2024-02-15");
  const [selectedTime, setSelectedTime] = useState("10:00");

  return (
    <div
      data-tour="demo-form"
      className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-brand-orange/10 to-brand-primary/10 px-8 py-6 border-b">
        <h3 className="text-xl sm:text-2xl font-roboto-condensed font-bold text-brand-primary">
          Nueva Solicitud de Reserva
        </h3>
        <p className="text-brand-gray text-base sm:text-lg mt-2 max-w-full">
          Completa los datos para tu reserva
        </p>
      </div>

      <div className="p-8 sm:p-10 space-y-8">
        {/* Selección de Equipo */}
        <div data-tour="demo-equipment-selection">
          <label className="block text-base sm:text-lg font-roboto font-semibold text-brand-secondary mb-4">
            Tipo de Equipo *
          </label>
          <div className="grid md:grid-cols-3 gap-6">
            {EQUIPMENT_OPTIONS.map((equipment) => {
              const Icon = equipment.icon;
              return (
                <div
                  key={equipment.id}
                  onClick={() => setSelectedEquipment(equipment.id)}
                  className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedEquipment === equipment.id
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-gray-200 hover:border-brand-primary/50"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <Icon className="w-6 h-6 text-brand-primary mr-3" />
                    <h4 className="font-roboto font-bold text-base text-brand-secondary">
                      {equipment.name}
                    </h4>
                  </div>
                  <div className="text-sm text-brand-gray space-y-1.5">
                    {equipment.specs.map((spec, index) => (
                      <div key={index}>• {spec}</div>
                    ))}
                  </div>
                  <div className="mt-3 text-sm">
                    <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-md font-medium">
                      {equipment.available} disponibles
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fecha y Hora */}
        <div data-tour="demo-datetime" className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base sm:text-lg font-roboto font-semibold text-brand-secondary mb-3">
              Fecha de Reserva *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              title="Seleccionar fecha de reserva"
              placeholder="Fecha de reserva"
              className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-base sm:text-lg font-roboto font-semibold text-brand-secondary mb-3">
              Hora de Inicio *
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              title="Seleccionar hora de inicio"
              className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            >
              <option value="08:00">08:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="14:00">02:00 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
          </div>
        </div>

        {/* Tipo de Uso */}
        <div data-tour="demo-usage-type">
          <label className="block text-base sm:text-lg font-roboto font-semibold text-brand-secondary mb-4">
            Tipo de Uso *
          </label>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 border-2 border-brand-primary bg-brand-primary/5 rounded-lg">
              <div className="flex items-center mb-3">
                <input
                  type="radio"
                  name="usage"
                  value="in_room"
                  defaultChecked
                  title="Uso en sala"
                  className="mr-3 w-4 h-4"
                />
                <h4 className="font-roboto font-bold text-base text-brand-secondary">
                  En Sala
                </h4>
              </div>
              <p className="text-sm sm:text-base text-brand-gray">
                Uso de equipos dentro de las instalaciones del centro
              </p>
            </div>
            <div className="p-5 border-2 border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <input
                  type="radio"
                  name="usage"
                  value="external"
                  title="Uso externo"
                  className="mr-3 w-4 h-4"
                />
                <h4 className="font-roboto font-bold text-base text-brand-secondary">
                  Externo
                </h4>
              </div>
              <p className="text-sm sm:text-base text-brand-gray">
                Préstamo de equipos para uso fuera del centro
              </p>
            </div>
          </div>
        </div>

        {/* Propósito */}
        <div data-tour="demo-purpose">
          <label className="block text-base sm:text-lg font-roboto font-semibold text-brand-secondary mb-3">
            Propósito de la Investigación *
          </label>
          <textarea
            rows={4}
            value="Desarrollo de mi tesis de maestría en Inteligencia Artificial aplicada al reconocimiento de patrones en imágenes médicas. Necesito los computadores de alto rendimiento para entrenar modelos de deep learning con datasets de gran tamaño."
            readOnly
            title="Propósito de la investigación - ejemplo"
            placeholder="Describe tu proyecto de investigación"
            className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-lg bg-gray-50 text-brand-gray resize-none"
          />
          <p className="text-sm sm:text-base text-brand-gray mt-2">
            Describe detalladamente tu proyecto de investigación o tesis
          </p>
        </div>

        {/* Justificación */}
        <div data-tour="demo-justification">
          <label className="block text-base sm:text-lg font-roboto font-semibold text-brand-secondary mb-3">
            Justificación Técnica *
          </label>
          <textarea
            rows={3}
            value="Los modelos de CNN que estoy desarrollando requieren GPUs de alta gama (RTX 4090) para el entrenamiento eficiente. El procesamiento de imágenes de alta resolución y la validación cruzada necesitan al menos 32GB de RAM."
            readOnly
            title="Justificación técnica - ejemplo"
            placeholder="Justifica técnicamente por qué necesitas estos equipos"
            className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-lg bg-gray-50 text-brand-gray resize-none"
          />
        </div>

        {/* Botón de Envío */}
        <div data-tour="demo-submit" className="pt-6 border-t border-gray-200">
          <button className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-roboto font-bold py-4 px-6 text-base sm:text-lg rounded-lg transition-colors flex items-center justify-center space-x-3">
            <Send className="w-5 h-5" />
            <span>Enviar Solicitud</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function MockConfirmation() {
  return (
    <div
      data-tour="demo-confirmation"
      className="w-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 px-6 sm:px-8 py-5 border-b">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h3 className="text-lg sm:text-xl font-roboto-condensed font-bold text-brand-primary">
            Solicitud Enviada Exitosamente
          </h3>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
          <div className="bg-green-100 text-green-700 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h4 className="font-roboto font-bold text-base sm:text-lg text-brand-secondary mb-1">
              ¡Tu solicitud ha sido recibida!
            </h4>
            <p className="text-brand-gray text-sm sm:text-base">
              Hemos enviado una confirmación a tu email:{" "}
              <strong className="text-brand-secondary block sm:inline">
                {DEMO_USER.email}
              </strong>
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-roboto font-bold text-brand-secondary mb-3 text-sm">
              Detalles de Solicitud
            </h5>
            <ul className="text-xs sm:text-sm text-brand-gray space-y-1.5">
              <li>
                <strong>ID:</strong> REQ-2024-001234
              </li>
              <li>
                <strong>Equipo:</strong> Computador Alto Rendimiento
              </li>
              <li>
                <strong>Fecha:</strong> 15 de Febrero, 2024
              </li>
              <li>
                <strong>Hora:</strong> 10:00 AM - 02:00 PM
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h5 className="font-roboto font-bold text-yellow-700 mb-3 text-sm flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              Estado Actual
            </h5>
            <div className="text-yellow-700">
              <p className="text-lg sm:text-xl font-bold mb-1">Pendiente</p>
              <p className="text-xs sm:text-sm">En revisión administrativa</p>
              <p className="text-xs sm:text-sm mt-2">Tiempo estimado: 24-48h</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <p className="text-xs sm:text-sm text-brand-gray text-center">
            <strong>Próximos pasos:</strong> Revisión → Evaluación →
            Notificación → Código QR
          </p>
        </div>
      </div>
    </div>
  );
}

function MockEmailNotification() {
  return (
    <div
      data-tour="demo-email"
      className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-green-500 to-blue-500 px-8 py-6">
        <div className="flex items-center space-x-3">
          <Mail className="w-7 h-7 text-white" />
          <h3 className="text-xl sm:text-2xl font-roboto-condensed font-bold text-white">
            Email de Aprobación
          </h3>
        </div>
      </div>

      <div className="p-8 sm:p-10">
        <div className="bg-gray-50 rounded-lg p-6 mb-6 font-mono text-base">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="space-y-2">
              <div>
                <strong>De:</strong> noreply@centromundox.com
              </div>
              <div>
                <strong>Para:</strong> {DEMO_USER.email}
              </div>
              <div>
                <strong>Asunto:</strong> ✅ Solicitud Aprobada - Código QR de
                Acceso
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <p>Estimado/a {DEMO_USER.name},</p>
            <p>
              ¡Excelentes noticias! Tu solicitud de reserva ha sido{" "}
              <strong className="text-green-600">APROBADA</strong>.
            </p>

            <div className="bg-white border border-gray-300 rounded-lg p-5">
              <h4 className="font-bold mb-4 text-lg">
                Detalles de tu Reserva:
              </h4>
              <ul className="space-y-2.5 text-base">
                <li>
                  📅 <strong>Fecha:</strong> Viernes, 15 de Febrero 2024
                </li>
                <li>
                  ⏰ <strong>Horario:</strong> 10:00 AM - 02:00 PM
                </li>
                <li>
                  💻 <strong>Equipo:</strong> Computador Alto Rendimiento #07
                </li>
                <li>
                  📍 <strong>Ubicación:</strong> Laboratorio A - Estación 7
                </li>
              </ul>
            </div>

            <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-6">
              <QrCode className="w-20 h-20 mx-auto mb-4 text-blue-600" />
              <p className="font-bold text-blue-700 text-lg mb-1">
                Tu Código QR de Acceso
              </p>
              <p className="text-sm text-blue-600">
                Presenta este código en recepción
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
              <h4 className="font-bold text-yellow-700 mb-3 text-base">
                ⚠️ Importante:
              </h4>
              <ul className="text-sm sm:text-base text-yellow-700 space-y-2">
                <li>• Llega 10 minutos antes de tu horario</li>
                <li>• Trae tu cédula para verificación</li>
                <li>• El código QR expira el día de la reserva</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemoReservationProcess() {

  useEffect(() => {
    // Configurar estilos personalizados para Driver.js
    const style = document.createElement("style");
    style.textContent = `
      .driver-popover {
        --driver-primary-color: #1a365d;
        --driver-secondary-color: #ed8936;
        --driver-text-color: #4a5568;
        font-family: 'Roboto', sans-serif;
      }
      
      .driver-popover-title {
        font-family: 'Roboto Condensed', sans-serif;
        font-weight: 700;
        color: var(--driver-primary-color);
        font-size: 1.25rem;
      }
      
      .driver-popover-description {
        color: var(--driver-text-color);
        line-height: 1.6;
        margin: 12px 0;
      }
      
      .driver-popover-next-btn,
      .driver-popover-prev-btn {
        background-color: var(--driver-primary-color);
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 600;
        transition: all 0.2s;
      }
      
      .driver-popover-next-btn:hover,
      .driver-popover-prev-btn:hover {
        background-color: var(--driver-secondary-color);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const startDemoTour = () => {
    const driverObj = driver({
      showProgress: true,
      progressText: "{{current}} de {{total}}",
      nextBtnText: "Siguiente →",
      prevBtnText: "← Anterior",
      doneBtnText: "¡Finalizar Demo!",
      steps: [
        {
          element: '[data-tour="demo-login"]',
          popover: {
            title: "🔐 Paso 1: Iniciar Sesión",
            description: `
              <div class="space-y-3">
                <p>Una vez registrado en CentroMundoX, <strong>inicia sesión</strong> con tus credenciales.</p>
                <p>En este demo usamos datos de ejemplo:</p>
                <ul class="list-disc ml-4 space-y-1 text-sm">
                  <li><strong>Email:</strong> maria.garcia@universidad.edu.co</li>
                  <li><strong>Contraseña:</strong> Tu contraseña segura</li>
                </ul>
                <p class="text-sm bg-blue-50 p-2 rounded">💡 <strong>Tip:</strong> Usa tu email institucional para mayor credibilidad</p>
              </div>
            `,
            side: "right",
            align: "start",
          },
        },
        {
          element: '[data-tour="demo-dashboard"]',
          popover: {
            title: "📊 Paso 2: Tu Dashboard Personal",
            description: `
              <div class="space-y-3">
                <p>Después del login, accedes a tu <strong>dashboard personal</strong> donde puedes:</p>
                <ul class="list-disc ml-4 space-y-1">
                  <li>Ver el resumen de tus reservas</li>
                  <li>Consultar reservas activas y completadas</li>
                  <li>Crear nuevas solicitudes</li>
                  <li>Seguir el estado de solicitudes pendientes</li>
                </ul>
                <p class="text-sm bg-green-50 p-2 rounded">✅ Aquí puedes gestionar todo tu historial de reservas</p>
              </div>
            `,
            side: "top",
            align: "center",
          },
        },
        {
          element: '[data-tour="demo-form"]',
          popover: {
            title: "📝 Paso 3: Formulario de Solicitud",
            description: `
              <div class="space-y-3">
                <p>Al hacer clic en <strong>"Nueva Solicitud"</strong>, accedes al formulario completo.</p>
                <p><strong>Este formulario incluye:</strong></p>
                <ul class="list-disc ml-4 space-y-1 text-sm">
                  <li>Selección de tipo de equipo</li>
                  <li>Fecha y hora de la reserva</li>
                  <li>Tipo de uso (en sala o externo)</li>
                  <li>Propósito de la investigación</li>
                  <li>Justificación técnica</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "center",
          },
        },
        {
          element: '[data-tour="demo-equipment-selection"]',
          popover: {
            title: "🖥️ Selección de Equipos",
            description: `
              <div class="space-y-3">
                <p><strong>Elige el equipo</strong> que necesitas para tu investigación:</p>
                <div class="grid grid-cols-1 gap-2 text-sm">
                  <div class="bg-blue-50 p-2 rounded">
                    <strong>💻 Computadores:</strong> Para análisis de datos, ML, simulaciones
                  </div>
                  <div class="bg-orange-50 p-2 rounded">
                    <strong>🥽 Realidad Virtual:</strong> Para investigación inmersiva, visualización 3D
                  </div>
                  <div class="bg-green-50 p-2 rounded">
                    <strong>🔬 Especializados:</strong> Sensores, instrumentos, equipos de medición
                  </div>
                </div>
                <p class="text-sm bg-yellow-50 p-2 rounded">⚡ Se muestra la disponibilidad en tiempo real</p>
              </div>
            `,
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-tour="demo-datetime"]',
          popover: {
            title: "📅 Fecha y Horario",
            description: `
              <div class="space-y-3">
                <p><strong>Selecciona cuándo</strong> necesitas los equipos:</p>
                <ul class="list-disc ml-4 space-y-1 text-sm">
                  <li><strong>Fecha:</strong> Mínimo 48 horas de anticipación</li>
                  <li><strong>Horario:</strong> Bloques de 4 horas disponibles</li>
                  <li><strong>Disponibilidad:</strong> Lun-Vie 8AM-6PM, Sáb 8AM-4PM</li>
                </ul>
                <p class="text-sm bg-blue-50 p-2 rounded">📅 El sistema verifica disponibilidad automáticamente</p>
              </div>
            `,
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-tour="demo-purpose"]',
          popover: {
            title: "🎯 Propósito de Investigación",
            description: `
              <div class="space-y-3">
                <p><strong>Describe tu proyecto</strong> de manera detallada:</p>
                <ul class="list-disc ml-4 space-y-1 text-sm">
                  <li>Título de tu tesis o investigación</li>
                  <li>Objetivos específicos del proyecto</li>
                  <li>Metodología que vas a aplicar</li>
                  <li>Resultados esperados</li>
                </ul>
                <p class="text-sm bg-yellow-50 p-2 rounded">⚠️ <strong>Importante:</strong> Una descripción detallada mejora las posibilidades de aprobación</p>
              </div>
            `,
            side: "left",
            align: "start",
          },
        },
        {
          element: '[data-tour="demo-justification"]',
          popover: {
            title: "⚙️ Justificación Técnica",
            description: `
              <div class="space-y-3">
                <p><strong>Explica por qué necesitas</strong> estos equipos específicos:</p>
                <ul class="list-disc ml-4 space-y-1 text-sm">
                  <li>Requerimientos técnicos de tu proyecto</li>
                  <li>Por qué estos equipos son necesarios</li>
                  <li>Alternativas consideradas</li>
                  <li>Beneficios esperados</li>
                </ul>
                <p class="text-sm bg-green-50 p-2 rounded">✅ Justificaciones técnicas sólidas aceleran la aprobación</p>
              </div>
            `,
            side: "left",
            align: "start",
          },
        },
        {
          element: '[data-tour="demo-submit"]',
          popover: {
            title: "📤 Enviar Solicitud",
            description: `
              <div class="space-y-3">
                <p><strong>Revisa toda la información</strong> antes de enviar:</p>
                <ul class="list-disc ml-4 space-y-1 text-sm">
                  <li>Verifica fechas y horarios</li>
                  <li>Confirma el equipo seleccionado</li>
                  <li>Revisa la descripción del proyecto</li>
                  <li>Asegúrate de que todo esté completo</li>
                </ul>
                <p class="text-sm bg-blue-50 p-2 rounded">📧 Recibirás confirmación inmediata por email</p>
              </div>
            `,
            side: "top",
            align: "center",
          },
        },
        {
          element: '[data-tour="demo-confirmation"]',
          popover: {
            title: "✅ Confirmación de Envío",
            description: `
              <div class="space-y-3">
                <p><strong>¡Solicitud enviada exitosamente!</strong></p>
                <p>Ahora tu solicitud:</p>
                <ol class="list-decimal ml-4 space-y-1 text-sm">
                  <li><strong>Se asigna un ID único</strong> para seguimiento</li>
                  <li><strong>Entra en cola de revisión</strong> administrativa</li>
                  <li><strong>Se verifica disponibilidad</strong> de equipos</li>
                  <li><strong>Se evalúa la justificación</strong> académica</li>
                </ol>
                <p class="text-sm bg-yellow-50 p-2 rounded">⏱️ Tiempo de respuesta: 24-48 horas laborales</p>
              </div>
            `,
            side: "top",
            align: "center",
          },
        },
        {
          element: '[data-tour="demo-email"]',
          popover: {
            title: "📧 Email de Aprobación",
            description: `
              <div class="space-y-3">
                <p><strong>¡Solicitud aprobada!</strong> Recibes un email con:</p>
                <ul class="list-disc ml-4 space-y-1 text-sm">
                  <li><strong>🔲 Código QR único</strong> - Tu pase de acceso</li>
                  <li><strong>📋 Detalles completos</strong> - Fecha, hora, equipo, ubicación</li>
                  <li><strong>📍 Instrucciones específicas</strong> - Cómo llegar y qué llevar</li>
                  <li><strong>⚠️ Información importante</strong> - Horarios, requisitos, contacto</li>
                </ul>
                <p class="text-sm bg-green-50 p-2 rounded">💾 <strong>Guarda este email</strong> - Lo necesitarás para el acceso</p>
              </div>
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
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-roboto-condensed font-black text-brand-primary mb-4">
          Demo: Proceso de Reserva Paso a Paso
        </h1>
        <p className="text-xl text-brand-gray mb-8 max-w-3xl mx-auto">
          Explora cómo funciona el sistema de reservas de CentroMundoX con datos
          de ejemplo. Sigue el proceso completo desde el login hasta recibir tu
          código QR de acceso.
        </p>

        <button
          onClick={startDemoTour}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white font-roboto font-bold px-8 py-4 rounded-lg transition-colors flex items-center space-x-3 mx-auto"
        >
          <Play className="w-5 h-5" />
          <span>Iniciar Tour Interactivo</span>
        </button>
      </div>

      {/* Demo Steps */}
      <div className="space-y-12">
        {/* Paso 1: Login */}
        <DemoStep title="Iniciar Sesión en tu Cuenta" stepNumber={1}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h4 className="font-roboto font-bold text-lg text-brand-secondary mb-3">
                Accede a tu Dashboard
              </h4>
              <p className="text-brand-gray mb-6">
                Una vez registrado en CentroMundoX, inicia sesión con tus
                credenciales para acceder a tu panel personal de reservas.
              </p>
              <ul className="text-sm text-brand-gray space-y-3">
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-brand-orange mr-2 flex-shrink-0" />
                  <span>Email institucional o personal</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-brand-orange mr-2 flex-shrink-0" />
                  <span>Contraseña segura</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-brand-orange mr-2 flex-shrink-0" />
                  <span>Acceso inmediato al dashboard</span>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <MockLoginForm />
            </div>
          </div>
        </DemoStep>

        {/* Paso 2: Dashboard */}
        <DemoStep title="Dashboard Personal" stepNumber={2}>
          <div className="space-y-8">
            <div className="text-center">
              <h4 className="font-roboto font-bold text-lg sm:text-xl text-brand-secondary mb-4">
                Tu Centro de Control de Reservas
              </h4>
              <p className="text-brand-gray text-base sm:text-lg mb-8 max-w-3xl mx-auto">
                Desde tu dashboard puedes ver el resumen de todas tus
                actividades, crear nuevas solicitudes y seguir el estado de tus
                reservas.
              </p>
            </div>
            <MockDashboard />
          </div>
        </DemoStep>

        {/* Paso 3: Formulario */}
        <DemoStep title="Crear Nueva Solicitud" stepNumber={3}>
          <div className="space-y-8">
            <div className="bg-blue-50 rounded-lg px-8 py-6 mx-auto">
              <h4 className="font-roboto font-bold text-xl sm:text-2xl text-brand-secondary mb-3 text-center">
                Formulario Completo de Reserva
              </h4>
              <p className="text-brand-gray text-base sm:text-lg text-center whitespace-normal sm:whitespace-nowrap">
                Completa todos los campos requeridos para tu solicitud. Entre
                más detallada sea la información, mejor será la evaluación.
              </p>
            </div>
            <MockReservationForm />
          </div>
        </DemoStep>

        {/* Paso 4: Confirmación */}
        <DemoStep title="Confirmación de Envío" stepNumber={4}>
          <div className="space-y-8">
            <MockConfirmation />

            <div className="border-t border-gray-200 pt-8">
              <h4 className="font-roboto font-bold text-lg sm:text-xl text-brand-secondary mb-6 text-center">
                ¿Qué Sucede Después?
              </h4>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    1
                  </div>
                  <h5 className="font-roboto font-semibold text-brand-secondary text-base text-center mb-2">
                    Revisión Administrativa
                  </h5>
                  <p className="text-sm text-brand-gray text-center">
                    Verificación de datos y disponibilidad (24-48h)
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-6">
                  <div className="bg-orange-100 text-orange-600 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    2
                  </div>
                  <h5 className="font-roboto font-semibold text-brand-secondary text-base text-center mb-2">
                    Evaluación Académica
                  </h5>
                  <p className="text-sm text-brand-gray text-center">
                    Revisión del propósito y justificación técnica
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    3
                  </div>
                  <h5 className="font-roboto font-semibold text-brand-secondary text-base text-center mb-2">
                    Notificación de Resultado
                  </h5>
                  <p className="text-sm text-brand-gray text-center">
                    Email con aprobación o solicitud de información adicional
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DemoStep>

        {/* Paso 5: Email con QR */}
        <DemoStep title="Código QR de Acceso" stepNumber={5}>
          <div className="space-y-8">
            <div className="bg-green-50 rounded-lg px-8 py-6 mx-auto">
              <h4 className="font-roboto font-bold text-xl sm:text-2xl text-brand-secondary mb-3 text-center">
                ¡Solicitud Aprobada! - Tu Pase de Acceso
              </h4>
              <p className="text-brand-gray text-base sm:text-lg text-center whitespace-normal sm:whitespace-nowrap">
                Una vez aprobada tu solicitud, recibirás un email con tu código
                QR único y toda la información necesaria para acceder al centro.
              </p>
            </div>
            <MockEmailNotification />

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 text-center">
              <h5 className="font-roboto-condensed font-bold text-xl sm:text-2xl text-brand-primary mb-4">
                ¡Ya Puedes Acceder a CentroMundoX!
              </h5>
              <p className="text-brand-gray text-base sm:text-lg mb-6 whitespace-normal sm:whitespace-nowrap">
                Con tu código QR en mano, dirígete al centro en la fecha y hora
                reservada.
              </p>
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-brand-primary" />
                  <span>Llega 10 min antes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <QrCode className="w-4 h-4 text-brand-primary" />
                  <span>Presenta tu QR</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-brand-primary" />
                  <span>Trae tu cédula</span>
                </div>
              </div>
            </div>
          </div>
        </DemoStep>
      </div>

      {/* Call to Action Final */}
      <div className="mt-16 text-center bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-roboto-condensed font-bold mb-4">
          ¿Listo para Hacer tu Primera Reserva?
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Ahora que conoces todo el proceso, crea tu cuenta y comienza a
          reservar los equipos de alta gama que necesitas para tu investigación.
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
