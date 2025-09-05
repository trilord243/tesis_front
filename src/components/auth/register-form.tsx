"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { EmailVerification } from "./email-verification";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const countryCode = formData.get("countryCode") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const cedula = formData.get("cedula") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Combinar código de país y número de teléfono
    const phone = phoneNumber ? `${countryCode}${phoneNumber}` : "";

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
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          lastName,
          email,
          phone,
          cedula,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Error en el registro");
      }

      // Mostrar pantalla de verificación
      setUserEmail(email);
      setShowVerification(true);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en el registro");
      setLoading(false);
    }
  };

  const handleBackToRegister = () => {
    setShowVerification(false);
    setUserEmail("");
    setError("");
  };

  // Mostrar componente de verificación si es necesario
  if (showVerification) {
    return <EmailVerification email={userEmail} onBack={handleBackToRegister} />;
  }

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

          {/* Phone Field */}
          <div className="mb-5">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Teléfono Celular
            </label>
            <div className="flex">
              <select
                name="countryCode"
                disabled={loading}
                className="px-3 py-3 text-base border border-gray-300 rounded-l-lg
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                         disabled:bg-gray-50 disabled:cursor-not-allowed
                         transition-all duration-200 bg-white min-w-[100px]"
                defaultValue="+58"
              >
                <option value="+1">🇺🇸 +1</option>
                <option value="+58">🇻🇪 +58</option>
                <option value="+52">🇲🇽 +52</option>
                <option value="+57">🇨🇴 +57</option>
                <option value="+51">🇵🇪 +51</option>
                <option value="+54">🇦🇷 +54</option>
                <option value="+56">🇨🇱 +56</option>
                <option value="+55">🇧🇷 +55</option>
                <option value="+593">🇪🇨 +593</option>
                <option value="+507">🇵🇦 +507</option>
                <option value="+34">🇪🇸 +34</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+49">🇩🇪 +49</option>
                <option value="+39">🇮🇹 +39</option>
              </select>
              <input
                id="phone"
                name="phoneNumber"
                type="tel"
                placeholder="4129704419"
                disabled={loading}
                autoComplete="tel"
                className="flex-1 px-4 py-3 text-base border border-l-0 border-gray-300 rounded-r-lg
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                         disabled:bg-gray-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ingresa tu número sin el código de país
            </p>
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
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  autoComplete="new-password"
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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 text-base border border-gray-300 rounded-lg
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                           disabled:bg-gray-50 disabled:cursor-not-allowed
                           transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
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
