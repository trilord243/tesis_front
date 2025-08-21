import { getCurrentUser, requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, QrCode, Download, Info, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import QRCode from "react-qr-code";

export const metadata: Metadata = {
  title: "Mi Código QR - CentroMundoX",
  description: "Visualiza tu código QR de acceso",
};

export default async function QRPage() {
  await requireAuth();
  const user = await getCurrentUser();

  if (!user) {
    return <div>Error: Usuario no encontrado</div>;
  }

  const isAdmin = user.role === "admin";
  if (isAdmin) {
    redirect("/admin/dashboard");
  }

  // Generar el contenido del QR con la información del usuario
  // Para administradores, incluir información especial de identificación
  const qrData = JSON.stringify({
    userId: user._id,
    email: user.email,
    name: `${user.name} ${user.lastName}`,
    cedula: user.cedula,
    role: user.role,
    accessCode: user.codigo_acceso || "N/A",
    adminAccess: isAdmin,
    permissions: isAdmin
      ? ["full_access", "manage_requests", "system_admin"]
      : ["basic_access"],
    timestamp: new Date().toISOString(),
    qrType: isAdmin ? "ADMIN_ACCESS" : "USER_ACCESS",
  });

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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <Link
                href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {isAdmin ? "Volver al Panel de Admin" : "Volver al Dashboard"}
              </Link>
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ backgroundColor: "#FF8200" }}
                  >
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                )}
                <div>
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: "#1859A9" }}
                  >
                    {isAdmin ? "Código QR de Administrador" : "Mi Código QR"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {isAdmin
                      ? "Código especial con permisos administrativos"
                      : "Utiliza este código para acceder al centro de investigación"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Admin Alert */}
          {isAdmin && (
            <Alert
              className="mb-6"
              style={{ borderColor: "#FF8200", backgroundColor: "#FFF7ED" }}
            >
              <Shield className="h-4 w-4" style={{ color: "#FF8200" }} />
              <AlertTitle style={{ color: "#1859A9" }}>
                Acceso de Administrador
              </AlertTitle>
              <AlertDescription>
                Este QR te identifica como administrador del sistema con
                permisos especiales de acceso.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Code Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5" style={{ color: "#1859A9" }} />
                  <span>
                    {isAdmin
                      ? "Código QR Administrativo"
                      : "Código QR Personal"}
                  </span>
                </CardTitle>
                <CardDescription>
                  {isAdmin
                    ? "Presenta este código para acceso administrativo completo"
                    : "Presenta este código en la entrada del centro"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-inner">
                  <QRCode
                    value={qrData}
                    size={250}
                    level="H"
                    fgColor={isAdmin ? "#FF8200" : "#1859A9"}
                    bgColor="#FFFFFF"
                  />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    {isAdmin ? "ID de Administrador" : "ID de Usuario"}
                  </p>
                  <p
                    className="font-mono font-bold text-lg"
                    style={{ color: "#FF8200" }}
                  >
                    {user._id}
                  </p>
                  {isAdmin && (
                    <div className="mt-2">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: "#FF8200" }}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        ADMINISTRADOR
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Information Card */}
            <div className="space-y-4">
              {/* User Info */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle style={{ color: "#1859A9" }}>
                    Información {isAdmin ? "del Administrador" : "Personal"}
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
                    <span className="font-medium">
                      {user.codigo_acceso || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rol:</span>
                    <span
                      className={`font-medium ${
                        isAdmin ? "text-orange-600" : "text-blue-600"
                      }`}
                    >
                      {isAdmin ? "Administrador" : "Usuario"}
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-medium text-orange-800 mb-2">
                        Permisos Administrativos:
                      </h4>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Acceso completo al sistema</li>
                        <li>• Gestión de solicitudes de lentes</li>
                        <li>• Administración de usuarios</li>
                        <li>• Control de inventario</li>
                      </ul>
                    </div>
                  )}
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
                    {isAdmin ? (
                      <>
                        <p>
                          • Presenta este QR en cualquier punto de acceso del
                          centro
                        </p>
                        <p>
                          • Tu código te dará acceso administrativo completo
                        </p>
                        <p>
                          • Utilízalo para supervisar y gestionar el sistema
                        </p>
                        <p>• Mantén la confidencialidad de tu código</p>
                      </>
                    ) : (
                      <>
                        <p>• Presenta este QR en la entrada del centro</p>
                        <p>
                          • Asegúrate de que el código sea claramente visible
                        </p>
                        <p>• Mantén tu dispositivo con batería suficiente</p>
                        <p>• Si tienes problemas, contacta al administrador</p>
                      </>
                    )}
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
