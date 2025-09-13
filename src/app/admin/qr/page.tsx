import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Info, Shield, UserCheck, RefreshCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AdminQRDisplay } from "@/components/admin/admin-qr-display";

export const metadata: Metadata = {
  title: "Mi Código QR Admin - CentroMundoX",
  description: "Código QR de acceso administrativo",
};

export default async function AdminQRPage() {
  await requireAdmin();
  const user = await getCurrentUser();

  if (!user) {
    return <div>Error: Usuario no encontrado</div>;
  }

  // El QR debe mostrar principalmente el código de acceso administrativo
  const qrData = user.codigo_acceso || "ADMIN_FULL_ACCESS";

  return (
    <>
      <Navbar isAuthenticated={true} showAuthButtons={false} isAdmin={true} />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al Panel de Administración
              </Link>
              <div className="flex items-center space-x-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{ backgroundColor: "#FF8200" }}
                >
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: "#1859A9" }}
                  >
                    Código QR de Administrador
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Código especial con permisos administrativos completos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Admin Alert */}
          <Alert
            className="mb-6"
            style={{ borderColor: "#FF8200", backgroundColor: "#FFF7ED" }}
          >
            <Shield className="h-4 w-4" style={{ color: "#FF8200" }} />
            <AlertTitle style={{ color: "#1859A9" }}>
              Acceso de Administrador del Sistema
            </AlertTitle>
            <AlertDescription>
              Este QR te identifica como administrador del sistema con permisos
              completos para gestión de equipos, usuarios y solicitudes.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Code Card */}
            <AdminQRDisplay
              qrData={qrData}
              currentCode={user.codigo_acceso}
              userPhone={user.phone}
              userEmail={user.email}
              isEmailVerified={true}
            />

            {/* Information Cards */}
            <div className="space-y-4">
              {/* Admin Info */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle style={{ color: "#1859A9" }}>
                    Información del Administrador
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium">
                      {user.name} {user.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cédula:</span>
                    <span className="font-medium">{user.cedula}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Código de Acceso:</span>
                    <span className="font-medium text-orange-600">
                      {user.codigo_acceso || "ADMIN_FULL_ACCESS"}
                    </span>
                  </div>
                  {user.accessCodeExpiresAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Válido hasta:</span>
                      <span className="font-medium text-green-600">
                        {new Date(user.accessCodeExpiresAt).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rol:</span>
                    <span className="font-medium text-orange-600">
                      Administrador
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck
                      className="h-5 w-5"
                      style={{ color: "#FF8200" }}
                    />
                    <span>Permisos Administrativos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Acceso completo al sistema
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Gestión de solicitudes de lentes
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Administración de usuarios
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Control de inventario de equipos
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Configuración del sistema
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Generación de reportes
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Acceso a gabinetes RFID
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Instructions */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="h-5 w-5" style={{ color: "#1859A9" }} />
                    <span>Instrucciones de Uso</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      • Presenta este QR en cualquier punto de acceso del
                      centro
                    </p>
                    <p>
                      • Tu código te dará acceso administrativo completo al
                      sistema
                    </p>
                    <p>
                      • Úsalo para acceder a gabinetes y áreas restringidas
                    </p>
                    <p>
                      • Utilízalo para supervisar y gestionar el sistema
                    </p>
                    <p className="text-amber-700 font-medium">
                      ⚠️ Mantén la confidencialidad de tu código
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Regenerate Info */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <RefreshCcw className="h-5 w-5" style={{ color: "#FF8200" }} />
                    <span>Regenerar Código</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      • Puedes generar un nuevo código cuando lo necesites
                    </p>
                    <p>
                      • El código anterior se eliminará automáticamente
                    </p>
                    <p>
                      • Recibirás el nuevo código por email con QR incluido
                    </p>
                    <p className="text-green-700 font-medium">
                      ✓ Los códigos de admin nunca expiran
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}