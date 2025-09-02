"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, RefreshCw, CheckCircle } from "lucide-react";

interface EmailVerificationProps {
  email: string;
  onBack?: () => void;
}

export function EmailVerification({ email, onBack }: EmailVerificationProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Auto-focus en el input del código
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Contador para el botón de reenvío
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendDisabled && countdown === 0) {
      setResendDisabled(false);
    }
    return undefined;
  }, [countdown, resendDisabled]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(value);
    setError("");
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError("El código debe tener 6 dígitos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(data.message || "Error al verificar el código");
        // Limpiar el código si hay error
        setCode("");
      }
    } catch (err) {
      setError("Error al verificar el código");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendDisabled(true);
    setCountdown(60);
    setError("");

    try {
      const response = await fetch("/api/users/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al reenviar el código");
        // Si hay error, habilitar el botón inmediatamente
        setResendDisabled(false);
        setCountdown(0);
      }
    } catch (err) {
      setError("Error al reenviar el código");
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && code.length === 6 && !loading) {
      handleVerifyCode();
    }
  };

  if (success) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-2xl">
        <div className="px-10 sm:px-12 py-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3 text-green-600"
            style={{
              fontFamily: "Roboto Condensed, sans-serif",
            }}
          >
            ¡Email Verificado!
          </h2>
          
          <p className="text-base text-gray-600 mb-6">
            Tu correo electrónico ha sido verificado exitosamente.
            <br />
            Serás redirigido al login en unos segundos...
          </p>

          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-green-600" />
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
          Verifica tu correo
        </h2>
        
        <p className="text-sm sm:text-base text-gray-600 mb-2">
          Hemos enviado un código de 6 dígitos a:
        </p>
        
        <p className="text-base font-semibold text-gray-800 mb-4">
          {email}
        </p>
        
        <p className="text-sm text-gray-500">
          Revisa tu bandeja de entrada y tu carpeta de spam
        </p>
      </div>

      {/* Form Section */}
      <div className="px-10 sm:px-12 pb-10">
        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Code Input */}
        <div className="mb-6">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-2 text-center"
          >
            Código de verificación
          </label>
          <input
            ref={inputRef}
            id="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="123456"
            value={code}
            onChange={handleCodeChange}
            onKeyPress={handleKeyPress}
            maxLength={6}
            disabled={loading}
            className="w-full px-4 py-4 text-2xl text-center font-mono border border-gray-300 rounded-lg
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                     disabled:bg-gray-50 disabled:cursor-not-allowed
                     transition-all duration-200 tracking-widest"
          />
          <p className="text-xs text-gray-500 text-center mt-2">
            Ingresa los 6 dígitos que recibiste por correo
          </p>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerifyCode}
          disabled={loading || code.length !== 6}
          className="w-full py-3 text-base font-semibold text-white rounded-lg
                   shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 transform hover:-translate-y-0.5
                   flex items-center justify-center gap-2 mb-6"
          style={{ 
            backgroundColor: loading || code.length !== 6 ? "#94a3b8" : "#1859A9" 
          }}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Verificando...</span>
            </>
          ) : (
            "Verificar Código"
          )}
        </button>

        {/* Resend Section */}
        <div className="text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600 mb-3">
            ¿No recibiste el código?
          </p>
          
          <button
            onClick={handleResendCode}
            disabled={resendDisabled}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                     border border-gray-300 rounded-lg hover:bg-gray-50 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
            style={{ 
              color: resendDisabled ? "#94a3b8" : "#1859A9",
              borderColor: resendDisabled ? "#e2e8f0" : "#1859A9"
            }}
          >
            <RefreshCw className="h-4 w-4" />
            {resendDisabled 
              ? `Reenviar en ${countdown}s` 
              : "Reenviar código"
            }
          </button>
        </div>

        {/* Back Button */}
        {onBack && (
          <div className="text-center mt-4">
            <button
              onClick={onBack}
              disabled={loading}
              className="text-sm text-gray-500 hover:text-gray-700 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200"
            >
              ← Volver al registro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}