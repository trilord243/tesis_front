import { getCurrentUser, requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MyEquipment } from "@/components/dashboard/my-equipment";
import { Navbar } from "@/components/layout/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Metadata, Viewport } from "next";
import Link from "next/link";
import {
  Calendar,
  User as UserIcon,
  QrCode,
  ClipboardList,
  Shield,
  Computer,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserProducts } from "@/lib/admin-products";

export const metadata: Metadata = {
  title: "Dashboard - CentroMundoX",
  description: "Panel de control de usuario",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function DashboardPage() {
  await requireAuth();
  const user = await getCurrentUser();

  if (!user) {
    return <div>Error: Usuario no encontrado</div>;
  }

  // Si el usuario es administrador o superadmin, redirigir al panel de admin
  if (user.role === "admin" || user.role === "superadmin") {
    redirect("/admin/dashboard");
  }

  // Obtener los equipos del usuario
  const userProducts = user.codigo_acceso
    ? await getUserProducts(user.codigo_acceso)
    : [];


  // Funcionalidades organizadas por categoría
  const menuSections = [
    {
      category: "Solicitudes",
      description: "Solicita acceso a equipos del centro",
      icon: Calendar,
      color: "#1859A9",
      items: [
        {
          title: "Solicitar Lentes VR/AR",
          description: "Solicita acceso a lentes de realidad virtual y aumentada",
          icon: Calendar,
          href: "/dashboard/reservas",
          color: "#1859A9",
        },
        {
          title: "Solicitar Computadoras",
          description: "Solicita acceso a computadoras de alto rendimiento",
          icon: Computer,
          href: "/dashboard/reservar-lab",
          color: "#FF8200",
        },
      ],
    },
    {
      category: "Mis Solicitudes",
      description: "Consulta y gestiona tus solicitudes activas",
      icon: ClipboardList,
      color: "#003087",
      items: [
        {
          title: "Mis Solicitudes de Lentes",
          description: "Gestiona tus solicitudes de lentes e historial",
          icon: ClipboardList,
          href: "/dashboard/mis-reservas",
          color: "#003087",
        },
        {
          title: "Mis Solicitudes de Computadoras",
          description: "Gestiona tus solicitudes de computadoras e historial",
          icon: BookOpen,
          href: "/dashboard/mis-reservas-lab",
          color: "#F68629",
        },
      ],
    },
    {
      category: "Mi Cuenta",
      description: "Información personal y acceso",
      icon: UserIcon,
      color: "#1859A9",
      items: [
        {
          title: "Mi Perfil",
          description: "Actualiza tu información personal",
          icon: UserIcon,
          href: "/dashboard/perfil",
          color: "#1859A9",
        },
        {
          title: "Mi QR",
          description: "Visualiza tu código QR de acceso",
          icon: QrCode,
          href: "/dashboard/qr",
          color: "#FF8200",
        },
      ],
    },
  ];

  return (
    <>
      <Navbar
        isAuthenticated={true}
        showAuthButtons={false}
        isAdmin={user.role === "admin" || user.role === "superadmin"}
        isSuperAdmin={user.role === "superadmin"}
      />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full"
                style={{ backgroundColor: "#1859A9" }}
              >
                <div className="text-lg font-black text-white">UM</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                  Bienvenido, {user.name}
                </h1>
                <p className="text-gray-600">Panel de control - CentroMundoX</p>
              </div>
            </div>
          </div>

          {/* Estado de Acceso */}
          {user.codigo_acceso ? (
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4" style={{ color: "#1859A9" }} />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Tu código de acceso al centro:
                  </span>
                  <div className="flex flex-col">
                    <span
                      className="text-2xl font-mono font-bold"
                      style={{ color: "#003087" }}
                    >
                      {user.codigo_acceso}
                    </span>
                    {user.accessCodeExpiresAt && (
                      <span className="text-xs text-amber-700 mt-1">
                        Expira: {new Date(user.accessCodeExpiresAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>
                <Link href="/dashboard/qr">
                  <Button variant="outline" size="sm" className="ml-4">
                    <QrCode className="h-4 w-4 mr-2" />
                    Ver QR
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <Shield className="h-4 w-4" style={{ color: "#F59E0B" }} />
              <AlertDescription>
                <div>
                  <span className="text-sm font-medium text-amber-800">
                    Código de acceso pendiente
                  </span>
                  <p className="text-xs text-amber-700 mt-1">
                    Tu código de acceso se generará cuando un administrador apruebe tu solicitud de equipos.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-8">
            {/* Funcionalidades por Categoría */}
            {menuSections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <Card key={section.category} className="border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          backgroundColor: `${section.color}20`,
                          color: section.color,
                        }}
                      >
                        <SectionIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle style={{ color: "#1859A9" }}>
                          {section.category}
                        </CardTitle>
                        <CardDescription>
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block group"
                          >
                            <div className="p-4 border rounded-lg hover:shadow-lg transition-all hover:border-brand-primary group-hover:scale-[1.02] bg-gradient-to-r from-blue-50 to-indigo-50 h-full">
                              <div className="flex items-start space-x-3">
                                <div
                                  className="p-2 rounded-lg bg-opacity-20 flex-shrink-0"
                                  style={{
                                    backgroundColor: `${item.color}40`,
                                    color: item.color,
                                  }}
                                >
                                  <ItemIcon className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3
                                    className="font-semibold text-base mb-1"
                                    style={{ color: item.color }}
                                  >
                                    {item.title}
                                  </h3>
                                  <p className="text-sm text-gray-700 mb-2">
                                    {item.description}
                                  </p>
                                  <span className="text-xs text-blue-600 font-medium">
                                    Acceder →
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Mis Equipos */}
            <MyEquipment products={userProducts} />
          </div>
        </main>
      </div>
    </>
  );
}
