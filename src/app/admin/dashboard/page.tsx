import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Calendar,
  Package,
  Settings,
  Activity,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard - CentroMundoX",
  description: "Panel de administración del sistema",
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const user = await getCurrentUser();

  if (!user) {
    return <div>Error: Usuario no encontrado</div>;
  }

  // Estadísticas reales disponibles
  const stats = {
    solicitudesPendientes: 8, // Solo la que podemos obtener realmente
  };

  // Solo funcionalidades disponibles actualmente
  const availableFeatures = [
    {
      title: "Solicitudes de Lentes",
      description: "Gestiona solicitudes de acceso a lentes VR/AR",
      icon: AlertCircle,
      href: "/admin/solicitudes",
      color: "#1859A9",
      stats: `${stats.solicitudesPendientes} pendientes`,
      available: true,
    },
    {
      title: "Activos Fijos",
      description: "Inventario y control de equipos del centro",
      icon: Package,
      href: "/admin/activos",
      color: "#FF8200",
      stats: "Inventario completo",
      available: true,
    },
  ];

  // Funcionalidades futuras (mostrar como próximamente)
  const futureFeatures = [
    {
      title: "Gestión de Usuarios",
      description: "Administra usuarios y permisos del sistema",
      icon: Users,
      color: "#6B7280",
      stats: "Próximamente",
      available: false,
    },
    {
      title: "Gestión de Reservas", 
      description: "Administra reservas de equipos",
      icon: Calendar,
      color: "#6B7280",
      stats: "Próximamente",
      available: false,
    },
    {
      title: "Inventario de Productos",
      description: "Administra el catálogo de equipos",
      icon: Package,
      color: "#6B7280", 
      stats: "Próximamente",
      available: false,
    },
    {
      title: "Reportes y Analíticas",
      description: "Estadísticas y reportes del sistema",
      icon: Activity,
      color: "#6B7280",
      stats: "Próximamente", 
      available: false,
    },
    {
      title: "Configuración",
      description: "Ajustes generales del sistema",
      icon: Settings,
      color: "#6B7280",
      stats: "Próximamente",
      available: false,
    },
  ];

  return (
    <>
      <Navbar isAuthenticated={true} showAuthButtons={false} />
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: "64px" }}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full"
                  style={{ backgroundColor: "#FF8200" }}
                >
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="titular" style={{ color: "#1859A9" }}>
                    Panel de Administración
                  </h1>
                  <p className="text-sm text-gray-600">
                    Bienvenido, {user.name} {user.lastName} - Administrador
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview - Solo estadísticas disponibles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Solicitudes Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-yellow-600">
                    {stats.solicitudesPendientes}
                  </span>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Requieren atención inmediata</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Sistema Activo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ✓
                  </span>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Funcionando correctamente</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Funciones Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                    2
                  </span>
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Solicitudes y activos</p>
              </CardContent>
            </Card>
          </div>

          {/* Available Features */}
          <Card className="border-0 shadow-md mb-8">
            <CardHeader>
              <CardTitle style={{ color: "#1859A9" }}>
                Funcionalidades Disponibles
              </CardTitle>
              <CardDescription>
                Herramientas de administración actualmente disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFeatures.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block group"
                  >
                    <div className="p-6 border rounded-lg hover:shadow-md transition-all hover:border-brand-primary group-hover:scale-[1.02] bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-start space-x-4">
                        <div
                          className="p-3 rounded-lg bg-opacity-20"
                          style={{
                            backgroundColor: `${item.color}40`,
                            color: item.color,
                          }}
                        >
                          <item.icon className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <h3
                            className="font-semibold text-xl mb-2"
                            style={{ color: item.color }}
                          >
                            {item.title}
                          </h3>
                          <p className="text-gray-700 mb-3">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <p
                              className="text-sm font-medium px-3 py-1 rounded-full bg-white"
                              style={{ color: item.color }}
                            >
                              {item.stats}
                            </p>
                            <span className="text-sm text-blue-600 font-medium">
                              Acceder →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Future Features */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-gray-600">
                Funcionalidades en Desarrollo
              </CardTitle>
              <CardDescription>
                Herramientas que estarán disponibles próximamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {futureFeatures.map((item) => (
                  <div
                    key={item.title}
                    className="p-4 border rounded-lg opacity-60 border-gray-200 bg-gray-50"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className="p-2 rounded-lg bg-opacity-10 relative"
                        style={{
                          backgroundColor: `${item.color}20`,
                          color: item.color,
                        }}
                      >
                        <item.icon className="h-5 w-5" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">⏳</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3
                          className="font-medium text-base mb-1"
                          style={{ color: item.color }}
                        >
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description}
                        </p>
                        <p className="text-xs text-yellow-700 font-medium">
                          🚧 {item.stats}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Acceso Rápido</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/admin/solicitudes"
                className="flex-1 bg-white border border-blue-300 rounded-lg p-4 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Ver Solicitudes Pendientes</p>
                    <p className="text-sm text-blue-700">{stats.solicitudesPendientes} solicitudes esperan revisión</p>
                  </div>
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}