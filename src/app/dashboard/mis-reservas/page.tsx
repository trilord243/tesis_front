"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Glasses,
  Loader2,
} from "lucide-react";
import { User } from "@/types/auth";

interface LensRequest {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestReason: string;
  willLeaveMetaverse: boolean;
  leaveReason?: string;
  zoneName?: string;
  plannedDate?: string;
  status: "pending" | "approved" | "rejected";
  accessCode?: string;
  expiresAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  processedBy?: string;
}

export default function MisReservasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<LensRequest[]>([]);
  const ensureNotAdmin = useCallback((u: User | null) => {
    if (u?.role === "admin") {
      router.replace("/admin/dashboard");
      return true;
    }
    return false;
  }, [router]);

  const loadRequests = useCallback(async () => {
    try {
      const response = await fetch("/api/lens-request/user", {
        credentials: "include",
      });

      if (response.ok) {
        const requestsData = await response.json();
        setRequests(requestsData);
      }
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    }
  }, []);

  const loadUserAndRequests = useCallback(async () => {
    try {
      // Verificar autenticación y obtener usuario
      const userResponse = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (!userResponse.ok) {
        router.push("/auth/login");
        return;
      }

      const userData = await userResponse.json();
      if (ensureNotAdmin(userData)) return;
      setUser(userData);

      // Cargar solicitudes del usuario
      await loadRequests();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [router, ensureNotAdmin, loadRequests]);

  useEffect(() => {
    loadUserAndRequests();
  }, [loadUserAndRequests]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobada
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazada
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar isAuthenticated={true} showAuthButtons={false} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 md:pt-24">
          <div className="flex items-center space-x-2">
            <Loader2
              className="h-8 w-8 animate-spin"
              style={{ color: "#1859A9" }}
            />
            <span className="text-lg">Cargando solicitudes...</span>
          </div>
        </div>
      </>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedRequests = requests.filter((r) => r.status === "approved");

  return (
    <>
      <Navbar
        isAuthenticated={true}
        showAuthButtons={false}
        isAdmin={user?.role === "admin"}
      />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
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
              <div className="flex items-center justify-between">
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
                      Mis Solicitudes de Lentes
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Historial y estado de tus solicitudes VR/AR
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/reservas">
                  <Button style={{ backgroundColor: "#FF8200" }}>
                    <Glasses className="h-4 w-4 mr-2" />
                    Solicitar Lentes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Solicitudes Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingRequests.length}
                </div>
                <p className="text-xs text-gray-500 mt-1">En revisión</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Solicitudes Aprobadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {approvedRequests.length}
                </div>
                <p className="text-xs text-gray-500 mt-1">Con acceso activo</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Solicitudes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl font-bold"
                  style={{ color: "#1859A9" }}
                >
                  {requests.length}
                </div>
                <p className="text-xs text-gray-500 mt-1">Historial completo</p>
              </CardContent>
            </Card>
          </div>

          {/* Requests List */}
          {requests.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="text-center py-12">
                <Glasses className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes solicitudes aún
                </h3>
                <p className="text-gray-600 mb-4">
                  Solicita acceso a los lentes VR/AR para comenzar
                </p>
                <Link href="/dashboard/reservas">
                  <Button style={{ backgroundColor: "#FF8200" }}>
                    <Glasses className="h-4 w-4 mr-2" />
                    Solicitar Lentes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {requests
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((request) => (
                  <Card key={request._id} className="border-0 shadow-md">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{
                              backgroundColor:
                                request.status === "approved"
                                  ? "#10b98120"
                                  : request.status === "rejected"
                                  ? "#ef444420"
                                  : "#eab30820",
                              color:
                                request.status === "approved"
                                  ? "#10b981"
                                  : request.status === "rejected"
                                  ? "#ef4444"
                                  : "#eab308",
                            }}
                          >
                            <Glasses className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              Solicitud de Lentes VR/AR
                            </h3>
                            <p className="text-sm text-gray-600">
                              Solicitado el {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          Razón de la solicitud:
                        </h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                          {request.requestReason}
                        </p>
                      </div>

                      {/* Información de zona si es uso externo */}
                      {request.willLeaveMetaverse && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">
                            🌐 Uso fuera del laboratorio metaverso
                          </h4>
                          
                          {request.leaveReason && (
                            <div className="mb-2">
                              <p className="text-xs text-blue-700 font-medium">Motivo:</p>
                              <p className="text-sm text-blue-800">{request.leaveReason}</p>
                            </div>
                          )}
                          
                          {request.zoneName && (
                            <div className="mb-2">
                              <p className="text-xs text-blue-700 font-medium">Zona:</p>
                              <p className="text-sm text-blue-800">📍 {request.zoneName}</p>
                            </div>
                          )}
                          
                          {request.plannedDate && (
                            <div>
                              <p className="text-xs text-blue-700 font-medium">Fecha planificada:</p>
                              <p className="text-sm text-blue-800">
                                📅 {formatDate(request.plannedDate)}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {request.status === "approved" && request.accessCode && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-green-900">
                                Código de Acceso Asignado
                              </h4>
                              <code className="text-lg font-mono font-bold text-green-700">
                                {request.accessCode}
                              </code>
                            </div>
                            {request.expiresAt && (
                              <div className="text-right">
                                <p className="text-xs text-green-700">
                                  Expira:
                                </p>
                                <p className="text-sm font-medium text-green-800">
                                  {formatDate(request.expiresAt)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {request.status === "rejected" &&
                        request.rejectionReason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-red-900 mb-1">
                              Razón del rechazo:
                            </h4>
                            <p className="text-sm text-red-700">
                              {request.rejectionReason}
                            </p>
                          </div>
                        )}

                      {request.processedAt && (
                        <div className="text-xs text-gray-500 border-t pt-3">
                          Procesado el {formatDate(request.processedAt)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
