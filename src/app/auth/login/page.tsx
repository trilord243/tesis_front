import { LoginForm } from "@/components/auth/login-form";
import { Navbar } from "@/components/layout/navbar";
import { Suspense } from "react";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión - CentroMundoX",
  description: "Inicia sesión en tu cuenta de CentroMundoX",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function LoginPage() {
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
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-2xl mb-4">
              <div
                className="text-2xl sm:text-3xl font-black"
                style={{
                  color: "#1859A9",
                  fontFamily: "Roboto Condensed, sans-serif",
                }}
              >
                UM
              </div>
            </div>

            <h1
              className="text-3xl sm:text-4xl font-black text-white mb-2"
              style={{
                fontFamily: "Roboto Condensed, sans-serif",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              CentroMundoX
            </h1>

            <p
              className="text-lg sm:text-xl text-white/90 mx-auto"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: 300,
              }}
            >
              Sistema de Reservas y Gestión
            </p>
          </div>

          {/* Formulario */}
          <Suspense
            fallback={
              <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 lg:p-12">
                <div className="animate-pulse space-y-8">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="space-y-6">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                      <div className="h-14 bg-gray-200 rounded"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                      <div className="h-14 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-14 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            }
          >
            <LoginForm />
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
