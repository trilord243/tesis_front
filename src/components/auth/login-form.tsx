"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
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
    <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header Section */}
      <div className="px-8 sm:px-12 lg:px-16 pt-10 sm:pt-12 lg:pt-14 pb-8 text-center">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3"
          style={{
            color: "#1859A9",
            fontFamily: "Roboto Condensed, sans-serif",
          }}
        >
          Iniciar Sesión
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <div className="px-8 sm:px-12 lg:px-16 pb-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm sm:text-base text-red-700">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-3"
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
              className="w-full px-5 py-4 text-base sm:text-lg border border-gray-300 rounded-lg
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                       disabled:bg-gray-50 disabled:cursor-not-allowed
                       transition-all duration-200"
            />
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-3"
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
              className="w-full px-5 py-4 text-base sm:text-lg border border-gray-300 rounded-lg
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                       disabled:bg-gray-50 disabled:cursor-not-allowed
                       transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-base sm:text-lg lg:text-xl font-semibold text-white rounded-lg
                     shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 transform hover:-translate-y-0.5
                     flex items-center justify-center gap-3"
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
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </div>

        {/* Footer Section */}
        <div className="px-8 sm:px-12 lg:px-16 pb-10 pt-4 text-center border-t border-gray-100">
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">
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
