"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const cedula = formData.get("cedula") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validaciones básicas
    if (
      !name ||
      !lastName ||
      !email ||
      !cedula ||
      !password ||
      !confirmPassword
    ) {
      setError("Todos los campos son requeridos");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          lastName,
          email,
          cedula,
          password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en el registro");
      }

      // Redireccionar al dashboard después del registro exitoso
      console.log("Registro exitoso, redirigiendo...");

      // Usar window.location para forzar una recarga completa
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en el registro");
      setLoading(false);
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
          Crear Cuenta
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Regístrate para acceder al sistema
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <div className="px-10 sm:px-12 pb-10">
          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Name and LastName Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Tu nombre"
                required
                disabled={loading}
                autoComplete="given-name"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                         disabled:bg-gray-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              />
            </div>

            {/* LastName Field */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Apellido
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Tu apellido"
                required
                disabled={loading}
                autoComplete="family-name"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                         disabled:bg-gray-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              />
            </div>
          </div>

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

          {/* Cedula Field */}
          <div className="mb-5">
            <label
              htmlFor="cedula"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cédula
            </label>
            <input
              id="cedula"
              name="cedula"
              type="text"
              placeholder="12345678"
              required
              disabled={loading}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                       disabled:bg-gray-50 disabled:cursor-not-allowed
                       transition-all duration-200"
            />
          </div>

          {/* Password and Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
            {/* Password Field */}
            <div>
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
                autoComplete="new-password"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                         disabled:bg-gray-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                disabled={loading}
                autoComplete="new-password"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                         disabled:bg-gray-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              />
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
                <span>Creando cuenta...</span>
              </>
            ) : (
              "Crear Cuenta"
            )}
          </button>
        </div>

        {/* Footer Section */}
        <div className="px-10 sm:px-12 pb-10 pt-8 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/auth/login"
              className="font-semibold hover:underline transition-colors duration-200"
              style={{ color: "#1859A9" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#003087")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#1859A9")}
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
