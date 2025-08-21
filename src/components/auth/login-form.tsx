"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
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
        throw new Error(data.error || "Error de autenticación");
      }

      // Redireccionar al dashboard
      console.log("Login exitoso, redirigiendo...");

      // Usar window.location para forzar una recarga completa
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-w-[320px] bg-white rounded-2xl shadow-2xl">
      {/* Header Section */}
      <div className="px-8 sm:px-10 pt-8 sm:pt-10 pb-6 text-center">
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
        <div className="px-8 sm:px-10 pb-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
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
        <div className="px-8 sm:px-10 pb-8 pt-6 text-center border-t border-gray-100">
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
