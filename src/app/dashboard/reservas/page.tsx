"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";
import { ArrowLeft, Glasses, Send, Loader2, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@/types/auth";

export default function SolicitudLentesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [requestReason, setRequestReason] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuthAndLoadUser();
  }, [checkAuthAndLoadUser]);

  const checkAuthAndLoadUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (!response.ok) {
        router.push("/auth/login");
        return;
      }

      const userData = await response.json();
      // Si es admin, redirigir a su panel
      if (userData?.role === "admin") {
        router.replace("/admin/dashboard");
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!requestReason.trim()) {
      setError("Por favor, proporciona una razón para tu solicitud");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/lens-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          requestReason: requestReason.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar la solicitud");
      }

      setSuccess(
        "¡Solicitud enviada exitosamente! Será revisada por los administradores."
      );
      setRequestReason("");

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/dashboard/mis-reservas");
      }, 2000);
    } catch (error) {
      console.error("Error enviando solicitud:", error);
      setError(
        error instanceof Error ? error.message : "Error al enviar la solicitud"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar
          isAuthenticated={true}
          showAuthButtons={false}
          isAdmin={user?.role === "admin"}
        />
        <div
          className="min-h-screen bg-gray-50 flex items-center justify-center"
          style={{ paddingTop: "64px" }}
        >
          <div className="flex items-center space-x-2">
            <Loader2
              className="h-8 w-8 animate-spin"
              style={{ color: "#1859A9" }}
            />
            <span className="text-lg">Cargando...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar
        isAuthenticated={true}
        showAuthButtons={false}
        isAdmin={user?.role === "admin"}
      />
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: "64px" }}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#1859A920", color: "#1859A9" }}
                >
                  <Glasses className="h-6 w-6" />
                </div>
                <div>
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: "#1859A9" }}
                  >
                    Solicitud de Lentes VR/AR
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Solicita acceso a los lentes de realidad virtual y aumentada
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Success Alert */}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" style={{ color: "#10b981" }} />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información del Usuario */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: "#1859A9" }}>
                    Información del Solicitante
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Nombre Completo
                    </Label>
                    <p className="text-sm font-medium">
                      {user?.name} {user?.lastName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Email
                    </Label>
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Cédula
                    </Label>
                    <p className="text-sm font-medium">{user?.cedula}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Información sobre el proceso */}
              <Card className="border-0 shadow-md mt-6">
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: "#FF8200" }}>
                    Proceso de Solicitud
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">1. Enviar solicitud</p>
                      <p className="text-xs text-gray-600">
                        Proporciona la razón de tu solicitud
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">2. Revisión</p>
                      <p className="text-xs text-gray-600">
                        Los administradores revisarán tu solicitud
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">3. Aprobación</p>
                      <p className="text-xs text-gray-600">
                        Recibirás un código de acceso si es aprobada
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulario de Solicitud */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: "#1859A9" }}>
                    Detalles de la Solicitud
                  </CardTitle>
                  <CardDescription>
                    Explica brevemente por qué necesitas acceso a los lentes
                    VR/AR
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label
                        htmlFor="requestReason"
                        className="text-sm font-medium"
                      >
                        Razón de la solicitud *
                      </Label>
                      <textarea
                        id="requestReason"
                        value={requestReason}
                        onChange={(e) => setRequestReason(e.target.value)}
                        placeholder="Ejemplo: Necesito los lentes para mi proyecto de investigación sobre interfaces de usuario en realidad virtual..."
                        className="mt-1 w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                        disabled={submitting}
                        maxLength={500}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {requestReason.length}/500 caracteres
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Button
                        type="submit"
                        disabled={submitting || !requestReason.trim()}
                        className="flex items-center space-x-2"
                        style={{ backgroundColor: "#FF8200" }}
                      >
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        <span>
                          {submitting ? "Enviando..." : "Enviar Solicitud"}
                        </span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard")}
                        disabled={submitting}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
