import { Navbar } from "@/components/layout/navbar";
import { Suspense } from "react";
import { Metadata, Viewport } from "next";
import { EmailVerificationPage } from "@/components/auth/email-verification-page";

export const metadata: Metadata = {
  title: "Verificar Email - CentroMundoX",
  description: "Verifica tu correo electrónico",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function VerifyEmailPage() {
  return (
    <>
      <Navbar isAuthenticated={false} showAuthButtons={false} />
      <div
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(135deg, #1859A9 0%, #003087 100%)",
          paddingTop: "100px",
          paddingBottom: "40px",
        }}
      >
        <div className="w-full max-w-3xl">
          {/* Logo y Título */}
          <div className="text-center mb-6 sm:mb-8 mt-8">
            <div className="inline-flex items-center justify-center w-40 h-24 sm:w-48 sm:h-28 bg-white rounded-2xl shadow-2xl mb-6 p-4">
              <img
                src="/centro-mundo-x-logo.png"
                alt="CentroMundoX Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h1
              className="text-4xl sm:text-5xl font-black text-white mb-2"
              style={{
                fontFamily: "Roboto Condensed, sans-serif",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              CentroMundoX
            </h1>

            <p
              className="text-xl sm:text-2xl text-white/90 mx-auto"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: 300,
              }}
            >
              Verificación de Email
            </p>
          </div>

          {/* Componente de Verificación */}
          <Suspense
            fallback={
              <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 lg:p-12">
                <div className="animate-pulse space-y-8">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="space-y-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                    <div className="h-14 bg-gray-200 rounded"></div>
                    <div className="h-14 bg-gray-200 rounded mt-8"></div>
                  </div>
                </div>
              </div>
            }
          >
            <EmailVerificationPage />
          </Suspense>

          {/* Footer */}
          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-white/70 text-sm sm:text-base">
              © 2024 CentroMundoX. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
