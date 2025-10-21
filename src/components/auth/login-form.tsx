"use client";

import { useState } from "react";
import { Loader2, Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setClientAuthToken } from "@/lib/client-auth";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResendOption, setShowResendOption] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setShowResendOption(false);
    setUnverifiedEmail("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Email y contraseña son requeridos");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      console.log("Respuesta del servidor:", { status: response.status, data });

      if (!response.ok) {
        // Extraer el mensaje del error (puede venir en diferentes formatos)
        const errorMessage = (typeof data.message === 'string' ? data.message : data.message?.message) ||
                            data.error ||
                            "";

        console.log("Error message extraído:", errorMessage);

        // Verificar si es error de email no verificado (detectar por texto del mensaje)
        if (response.status === 401 &&
            (errorMessage.toLowerCase().includes("verifica tu correo") ||
             errorMessage.toLowerCase().includes("email") && errorMessage.toLowerCase().includes("verific") ||
             data.message?.errorCode === "EMAIL_NOT_VERIFIED" ||
             data.errorCode === "EMAIL_NOT_VERIFIED")) {
          console.log("✅ Email no verificado detectado, mostrando opciones de verificación");
          setError("Debes verificar tu correo electrónico antes de iniciar sesión");
          setShowResendOption(true);
          setUnverifiedEmail(data.email || data.message?.email || email);
          console.log("✅ showResendOption:", true);
          console.log("✅ unverifiedEmail configurado:", data.email || data.message?.email || email);
        }
        // Verificar si es error de código de acceso expirado
        else if (response.status === 401 &&
                 (errorMessage.includes("código de acceso ha expirado") ||
                  data.message?.errorCode === "ACCESS_CODE_EXPIRED" ||
                  data.errorCode === "ACCESS_CODE_EXPIRED")) {
          setError("Tu código de acceso ha expirado. Por favor contacta al administrador para obtener uno nuevo.");
        }
        else {
          throw new Error(errorMessage || "Error de autenticación");
        }
      } else {
        // Guardar token en localStorage para acceso desde cliente
        if (data.access_token) {
          setClientAuthToken(data.access_token);
        }
        
        // Redireccionar al dashboard
        console.log("Login exitoso, redirigiendo...");
        
        // Usar window.location para forzar una recarga completa
        window.location.href = "/dashboard";
      }
    } catch (err) {
      if (!showResendOption) {
        setError(err instanceof Error ? err.message : "Error de autenticación");
      }
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;

    try {
      const response = await fetch("/api/users/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: unverifiedEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setError("Se ha enviado un nuevo código de verificación a tu correo");
        setShowResendOption(false);
      } else {
        setError(data.message || "Error al reenviar código de verificación");
      }
    } catch (err) {
      setError("Error al reenviar código de verificación");
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl">
      {/* Header Section */}
      <div className="px-10 sm:px-12 pt-10 sm:pt-12 pb-8 text-center">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-3"
          style={{
            color: "#1859A9",
            fontFamily: "Roboto Condensed, sans-serif",
          }}
        >
          Iniciar Sesión
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Ingresa tus credenciales para acceder
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <div className="px-10 sm:px-12 pb-10">
          {/* Error Alert */}
          {error && (
            <div className={`mb-5 p-4 border rounded-lg ${
              error.includes("enviado") ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}>
              <p className={`text-sm font-medium ${
                error.includes("enviado") ? "text-green-700" : "text-red-700"
              }`}>
                {error}
              </p>

              {/* Botones de ayuda para usuarios no verificados */}
              {showResendOption ? (
                <div className="mt-4 pt-4 border-t border-red-200">
                  <p className="text-sm font-semibold text-red-800 mb-3">
                    📧 Para verificar tu cuenta, sigue estos pasos:
                  </p>
                  <ol className="text-xs text-red-700 mb-4 space-y-1 ml-4 list-decimal">
                    <li>Haz clic en &quot;Verificar mi email&quot; abajo</li>
                    <li>Revisa tu correo (inbox y spam)</li>
                    <li>Ingresa el código de 6 dígitos que recibiste</li>
                  </ol>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => router.push(`/auth/verify-email?email=${encodeURIComponent(unverifiedEmail)}`)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold
                               text-white rounded-lg shadow-md
                               hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                      style={{ backgroundColor: "#1859A9" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#003087")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1859A9")}
                    >
                      <Mail className="h-4 w-4" />
                      Verificar mi email ahora
                    </button>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold
                               text-red-700 bg-white border-2 border-red-300 rounded-lg
                               hover:bg-red-50 transition-all duration-200"
                    >
                      <Mail className="h-4 w-4" />
                      Reenviar código
                    </button>
                  </div>
                  <p className="text-xs text-red-600 mt-3 text-center">
                    ¿Te equivocaste en tus datos? Podrás corregirlos en la página de verificación
                  </p>
                </div>
              ) : (
                /* Mensaje de ayuda genérico si no detectamos el tipo específico */
                error.toLowerCase().includes("verifica") && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <p className="text-xs text-red-700 mb-3 text-center">
                      ¿Necesitas verificar tu correo o registrarte nuevamente?
                    </p>
                    <Link
                      href="/auth/verify-email"
                      className="block w-full py-2 px-4 text-sm font-semibold text-center
                               text-white rounded-lg shadow-md
                               hover:shadow-lg transition-all duration-200"
                      style={{ backgroundColor: "#1859A9" }}
                    >
                      Ir a verificación de email
                    </Link>
                  </div>
                )
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              disabled={loading}
              autoComplete="email"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                       disabled:bg-gray-50 disabled:cursor-not-allowed
                       transition-all duration-200"
            />
          </div>

          {/* Password Field */}
          <div className="mb-7">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                disabled={loading}
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 text-base border border-gray-300 rounded-lg
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                         disabled:bg-gray-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-base font-semibold text-white rounded-lg
                     shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 transform hover:-translate-y-0.5
                     flex items-center justify-center gap-2"
            style={{ backgroundColor: loading ? "#FFA347" : "#FF8200" }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#F68629";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#FF8200";
            }}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </div>

        {/* Footer Section */}
        <div className="px-10 sm:px-12 pb-10 pt-8 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link
              href="/auth/register"
              className="font-semibold hover:underline transition-colors duration-200"
              style={{ color: "#1859A9" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#003087")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#1859A9")}
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
