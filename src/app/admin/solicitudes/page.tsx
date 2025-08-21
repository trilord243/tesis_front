import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { LensRequestsManager } from "./components/lens-requests-manager";
import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Solicitudes - Admin CentroMundoX",
  description: "Panel de administración para gestionar solicitudes de lentes VR/AR",
};

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Loader2
          className="h-6 w-6 animate-spin"
          style={{ color: "#1859A9" }}
        />
        <span>Cargando solicitudes...</span>
      </div>
    </div>
  );
}

export default async function AdminSolicitudesPage() {
  await requireAdmin();

  return (
    <>
      <Navbar isAuthenticated={true} showAuthButtons={false} />
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: "80px" }}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Volver al Panel de Admin
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full"
                style={{ backgroundColor: "#1859A9" }}
              >
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                  Gestión de Solicitudes de Lentes
                </h1>
                <p className="text-gray-600">
                  Revisar y aprobar solicitudes de acceso a lentes VR/AR
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Suspense fallback={<LoadingFallback />}>
            <LensRequestsManager />
          </Suspense>
        </main>
      </div>
    </>
  );
}
