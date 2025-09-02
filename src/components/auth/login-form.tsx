"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResendOption, setShowResendOption] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

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

      if (!response.ok) {
        // Verificar si es error de email no verificado
        if (response.status === 401 && data.message && 
            data.message.includes("verifica tu correo")) {
          setError("Debes verificar tu correo electrónico antes de iniciar sesión");
          setShowResendOption(true);
          setUnverifiedEmail(email);
        } else {
          throw new Error(data.error || data.message || "Error de autenticación");
        }
      } else {
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
            <div className={`mb-5 p-3 border rounded-lg ${
              error.includes("enviado") ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}>
              <p className={`text-sm ${
                error.includes("enviado") ? "text-green-700" : "text-red-700"
              }`}>
                {error}
              </p>
              
              {/* Botón de reenvío para usuarios no verificados */}
              {showResendOption && (
                <div className="mt-3 pt-3 border-t border-red-100">
                  <p className="text-xs text-red-600 mb-2">
                    ¿No tienes el código de verificación?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium 
                             text-red-700 bg-red-100 border border-red-300 rounded-md
                             hover:bg-red-200 transition-colors duration-200"
                  >
                    <Mail className="h-3 w-3" />
                    Reenviar código de verificación
                  </button>
                </div>
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
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="current-password"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                       disabled:bg-gray-50 disabled:cursor-not-allowed
                       transition-all duration-200"
            />
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
