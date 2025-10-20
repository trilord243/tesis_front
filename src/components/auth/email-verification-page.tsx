"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EmailVerification } from "./email-verification";
import { Mail, AlertCircle } from "lucide-react";
import Link from "next/link";

export function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Obtener email de los parámetros de URL si existe
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
      setShowVerification(true);
    }
  }, [searchParams]);

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setShowVerification(true);
  };

  const handleBackToEmail = () => {
    setShowVerification(false);
    setError("");
  };

  const handleEditData = () => {
    // Redirigir al registro para que pueda corregir sus datos
    // El backend eliminará el usuario no verificado automáticamente
    router.push("/auth/register");
  };

  if (showVerification) {
    return (
      <div className="space-y-4">
        <EmailVerification email={email} onBack={handleBackToEmail} />

        {/* Opción para editar datos */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-gray-700 font-medium mb-2">
                ¿Te equivocaste en algún dato?
              </p>
              <p className="text-xs text-gray-600 mb-3">
                Si ingresaste mal tu cédula, teléfono u otro dato durante el registro,
                puedes volver a registrarte con los datos correctos.
              </p>
              <button
                onClick={handleEditData}
                className="text-sm font-semibold hover:underline transition-colors duration-200"
                style={{ color: "#1859A9" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#003087")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1859A9")}
              >
                ← Volver al registro para corregir datos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl">
      {/* Header Section */}
      <div className="px-10 sm:px-12 pt-10 sm:pt-12 pb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
          <Mail className="h-8 w-8" style={{ color: "#1859A9" }} />
        </div>

        <h2
          className="text-2xl sm:text-3xl font-bold mb-3"
          style={{
            color: "#1859A9",
            fontFamily: "Roboto Condensed, sans-serif",
          }}
        >
          Verificar Email
        </h2>

        <p className="text-sm sm:text-base text-gray-600">
          Ingresa tu email para verificar tu cuenta
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleEmailSubmit}>
        <div className="px-10 sm:px-12 pb-10">
          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                       transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-2">
              Ingresa el email que usaste para registrarte
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-base font-semibold text-white rounded-lg
                     shadow-lg hover:shadow-xl
                     transition-all duration-200 transform hover:-translate-y-0.5"
            style={{ backgroundColor: "#1859A9" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#003087")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1859A9")}
          >
            Continuar
          </button>

          {/* Back to Login */}
          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              ¿Ya verificaste tu email?{" "}
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
        </div>
      </form>
    </div>
  );
}
