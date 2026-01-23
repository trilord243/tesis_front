"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import { Glasses, Send, CheckCircle, Mail, ArrowRight, Play } from "lucide-react";
import "driver.js/dist/driver.css";

// Mock data real del sistema
const DEMO_USER = {
  name: "María",
  lastName: "González",
  email: "maria.gonzalez@unimet.edu.ve",
  cedula: "V-25123456",
};

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

function MockLensRequestForm() {
  return (
    <div
      data-tour="lens-form"
      className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 px-8 py-6 border-b">
        <div className="flex items-center space-x-3 mb-2">
          <Glasses className="w-6 h-6 text-brand-primary" />
          <h3 className="text-xl sm:text-2xl font-roboto-condensed font-bold text-brand-primary">
            Solicitud de Lentes VR/AR
          </h3>
        </div>
        <p className="text-brand-gray text-base sm:text-lg">
          Solicita acceso a los lentes de realidad virtual y aumentada
        </p>
      </div>

      <div className="p-8 sm:p-10 space-y-6">
        {/* Información del usuario */}
        <div data-tour="user-info" className="bg-blue-50 rounded-lg p-6">
          <h4 className="font-roboto font-bold text-brand-secondary mb-4">
            Información del Solicitante
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Nombre Completo</p>
              <p className="font-medium">
                {DEMO_USER.name} {DEMO_USER.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{DEMO_USER.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Cédula</p>
              <p className="font-medium">{DEMO_USER.cedula}</p>
            </div>
          </div>
        </div>

        {/* Razón de solicitud */}
        <div data-tour="request-reason">
          <label className="block text-base sm:text-lg font-roboto font-semibold text-brand-secondary mb-3">
            Razón de la solicitud *
          </label>
          <textarea
            rows={4}
            value="Necesito los lentes Meta Quest Pro para mi tesis de maestría sobre interfaces de usuario en realidad virtual. Debo realizar pruebas de usabilidad con usuarios reales en entornos 3D inmersivos."
            readOnly
            className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-lg bg-gray-50 text-brand-gray resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">Máximo 500 caracteres</p>
        </div>

        {/* Checkbox salir del metaverso */}
        <div data-tour="will-leave">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 rounded border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            <label className="text-base font-roboto font-semibold text-brand-secondary">
              ¿Saldrá del laboratorio metaverso?
            </label>
          </div>
          <p className="text-xs text-gray-500 ml-6">
            Marque esta opción si necesita usar los lentes fuera del laboratorio
          </p>
        </div>

        {/* Información adicional si sale */}
        <div
          data-tour="external-use"
          className="border-l-4 border-blue-200 pl-4 bg-blue-50 p-4 rounded-r-lg space-y-4"
        >
          <h4 className="font-roboto font-bold text-blue-900">
            Información sobre el uso externo
          </h4>

          <div>
            <label className="block text-sm font-medium text-brand-secondary mb-2">
              Razón para sacar los lentes *
            </label>
            <textarea
              rows={3}
              value="Necesito realizar pruebas de usabilidad con usuarios de diferentes carreras en un ambiente controlado fuera del laboratorio principal."
              readOnly
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Máximo 300 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-secondary mb-2">
              Zona donde usará los lentes *
            </label>
            <input
              type="text"
              value="Sala de Conferencias A - Edificio Central"
              readOnly
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-secondary mb-2">
              Fecha y hora planificada *
            </label>
            <input
              type="datetime-local"
              value="2025-02-15T14:00"
              readOnly
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white"
            />
          </div>
        </div>

        {/* Botón de envío */}
        <div data-tour="submit" className="pt-4">
          <button className="bg-brand-orange hover:bg-brand-orange/90 text-white font-roboto font-bold px-8 py-4 rounded-lg transition-colors flex items-center space-x-3">
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
      data-tour="confirmation"
      className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 px-6 sm:px-8 py-5 border-b">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h3 className="text-lg sm:text-xl font-roboto-condensed font-bold text-brand-primary">
            Solicitud Enviada Exitosamente
          </h3>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            ¡Tu solicitud ha sido recibida y será revisada por los administradores!
          </p>
          <p className="text-green-700 text-sm mt-2">
            Recibirás una confirmación en tu email: <strong>{DEMO_USER.email}</strong>
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-roboto font-bold text-brand-secondary mb-3">
            Próximos pasos:
          </h4>
          <ol className="space-y-2 text-sm text-brand-gray">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Revisión administrativa (24-48 horas)</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Evaluación de disponibilidad de equipos</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Notificación de aprobación o rechazo</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>
                Si es aprobada: <strong>Código de acceso por email</strong>
              </span>
            </li>
          </ol>
        </div>

        <p className="text-sm text-gray-600">
          Puedes revisar el estado de tu solicitud en{" "}
          <span className="font-medium text-brand-primary">
            Dashboard → Mis Reservas
          </span>
        </p>
      </div>
    </div>
  );
}

function MockApprovalEmail() {
  return (
    <div
      data-tour="approval-email"
      className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-green-500 to-blue-500 px-8 py-6">
        <div className="flex items-center space-x-3">
          <Mail className="w-7 h-7 text-white" />
          <h3 className="text-xl sm:text-2xl font-roboto-condensed font-bold text-white">
            Email de Aprobación
          </h3>
        </div>
      </div>

      <div className="p-8 sm:p-10 space-y-4">
        <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
          <div className="border-b border-gray-200 pb-4 mb-4 space-y-1">
            <div>
              <strong>De:</strong> noreply@centromundox.net
            </div>
            <div>
              <strong>Para:</strong> {DEMO_USER.email}
            </div>
            <div>
              <strong>Asunto:</strong> ✅ Solicitud Aprobada - Código de Acceso
            </div>
          </div>

          <div className="space-y-3">
            <p>Estimado/a {DEMO_USER.name},</p>
            <p>
              Tu solicitud de lentes VR/AR ha sido{" "}
              <strong className="text-green-600">APROBADA</strong>.
            </p>

            <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4 text-center my-4">
              <p className="text-green-900 font-bold text-lg mb-1">
                Tu Código de Acceso:
              </p>
              <p className="text-3xl font-mono font-black text-green-700">
                CMX-VR-2025-001
              </p>
              <p className="text-xs text-green-700 mt-2">
                Válido hasta: 28 de Febrero, 2025
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-bold text-yellow-800 mb-2">
                ⚠️ Importante:
              </h4>
              <ul className="text-yellow-800 text-xs space-y-1">
                <li>• Presenta este código en recepción</li>
                <li>• Trae tu cédula para verificación</li>
                <li>• El código expira en la fecha indicada</li>
                <li>
                  • Los lentes deben devolverse en perfecto estado el mismo día
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TutorialLensRequest() {
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
          element: '[data-tour="lens-form"]',
          popover: {
            title: "📝 Formulario de Solicitud",
            description: `
              <p>Este es el formulario REAL para solicitar lentes VR/AR.</p>
              <p class="text-sm mt-2">Accedes a través de: <strong>Dashboard → Solicitar Lentes VR</strong></p>
            `,
            side: "top",
            align: "center",
          },
        },
        {
          element: '[data-tour="user-info"]',
          popover: {
            title: "👤 Información Pre-llenada",
            description: `
              <p>Tu información personal se carga automáticamente desde tu perfil.</p>
              <p class="text-sm text-gray-600 mt-2">No necesitas escribirla nuevamente.</p>
            `,
            side: "bottom",
            align: "start",
          },
        },
        {
          element: '[data-tour="request-reason"]',
          popover: {
            title: "✍️ Razón de Solicitud",
            description: `
              <p><strong>Campo obligatorio</strong> - Explica por qué necesitas los lentes.</p>
              <ul class="list-disc ml-4 mt-2 text-sm space-y-1">
                <li>Máximo 500 caracteres</li>
                <li>Se específico sobre tu proyecto</li>
                <li>Incluye el propósito académico</li>
              </ul>
            `,
            side: "left",
            align: "start",
          },
        },
        {
          element: '[data-tour="will-leave"]',
          popover: {
            title: "📍 ¿Saldrá del Laboratorio?",
            description: `
              <p>Marca esta opción <strong>SOLO si necesitas</strong> llevar los lentes fuera del laboratorio.</p>
              <p class="text-sm bg-yellow-50 p-2 rounded mt-2">
                Si marcas esta opción, aparecerán campos adicionales.
              </p>
            `,
            side: "bottom",
            align: "start",
          },
        },
        {
          element: '[data-tour="external-use"]',
          popover: {
            title: "🗺️ Información de Uso Externo",
            description: `
              <p><strong>Campos obligatorios si saldrá del laboratorio:</strong></p>
              <ul class="list-disc ml-4 mt-2 text-sm">
                <li><strong>Razón:</strong> Por qué necesitas sacarlos (max 300 chars)</li>
                <li><strong>Zona:</strong> Dónde los usarás exactamente</li>
                <li><strong>Fecha:</strong> Cuándo planeas usarlos</li>
              </ul>
            `,
            side: "bottom",
            align: "start",
          },
        },
        {
          element: '[data-tour="submit"]',
          popover: {
            title: "📤 Enviar Solicitud",
            description: `
              <p>Una vez completado el formulario, haz clic en <strong>Enviar Solicitud</strong>.</p>
              <p class="text-sm bg-blue-50 p-2 rounded mt-2">
                Recibirás confirmación inmediata y serás redirigido a "Mis Reservas".
              </p>
            `,
            side: "top",
            align: "center",
          },
        },
        {
          element: '[data-tour="confirmation"]',
          popover: {
            title: "✅ Confirmación",
            description: `
              <p><strong>¡Solicitud enviada!</strong></p>
              <p class="text-sm mt-2">Tu solicitud entra en revisión. Tiempo estimado: 24-48 horas.</p>
              <p class="text-sm bg-blue-50 p-2 rounded mt-2">
                Puedes ver el estado en <strong>Dashboard → Mis Reservas</strong>
              </p>
            `,
            side: "top",
            align: "center",
          },
        },
        {
          element: '[data-tour="approval-email"]',
          popover: {
            title: "📧 Aprobación y Código",
            description: `
              <p><strong>Si tu solicitud es aprobada</strong>, recibirás un email con:</p>
              <ul class="list-disc ml-4 mt-2 text-sm">
                <li><strong>Código de acceso único</strong></li>
                <li>Fecha de vencimiento</li>
                <li>Instrucciones para recoger los lentes</li>
              </ul>
              <p class="text-sm bg-green-50 p-2 rounded mt-2">
                Presenta el código en recepción con tu cédula.
              </p>
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
          <Glasses className="w-10 h-10 text-brand-primary" />
          <h1 className="text-4xl font-roboto-condensed font-black text-brand-primary">
            Tutorial: Solicitud de Lentes VR/AR
          </h1>
        </div>
        <p className="text-xl text-brand-gray mb-8 max-w-3xl mx-auto">
          Aprende el proceso REAL paso a paso para solicitar lentes de realidad
          virtual y aumentada en CentroMundoX.
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
        <DemoStep title="Formulario de Solicitud" stepNumber={1}>
          <MockLensRequestForm />
        </DemoStep>

        <DemoStep title="Confirmación de Envío" stepNumber={2}>
          <div className="space-y-8">
            <MockConfirmation />
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center">
              <h4 className="font-roboto-condensed font-bold text-xl text-brand-primary mb-3">
                ¿Qué pasa después?
              </h4>
              <p className="text-brand-gray mb-4">
                Tu solicitud será revisada por los administradores en un plazo de
                24-48 horas.
              </p>
              <div className="inline-flex items-center space-x-2 text-sm text-brand-primary">
                <ArrowRight className="w-4 h-4" />
                <span>Puedes verificar el estado en "Mis Reservas"</span>
              </div>
            </div>
          </div>
        </DemoStep>

        <DemoStep title="Aprobación y Código de Acceso" stepNumber={3}>
          <div className="space-y-8">
            <MockApprovalEmail />
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <h4 className="font-roboto-condensed font-bold text-xl text-brand-primary mb-3 text-center">
                ¡Listo para Recoger tus Lentes!
              </h4>
              <p className="text-center text-brand-gray mb-4">
                Con tu código de acceso, dirígete a la recepción del Centro Mundo X.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Código de acceso</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Cédula de identidad</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Carnet estudiantil</span>
                </div>
              </div>
            </div>
          </div>
        </DemoStep>
      </div>

      <div className="mt-16 text-center bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-roboto-condensed font-bold mb-4">
          ¿Listo para Solicitar Lentes VR/AR?
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Ahora que conoces el proceso completo, crea tu cuenta y solicita acceso
          a nuestros equipos de realidad virtual.
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
