"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Users,
  Calendar,
  Package,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Tags,
  QrCode,
  MapPin,
  Computer,
  Search,
  Crown,
  Globe,
  LayoutGrid,
  Settings,
  Gauge,
  FileText,
  BarChart3,
} from "lucide-react";

interface AdminDashboardContentProps {
  user: {
    name: string;
    lastName: string;
    role: "superadmin" | "admin" | "user";
  };
  stats: {
    solicitudesPendientes?: number;
  };
  adminProductsCount: number;
}

interface Feature {
  title: string;
  description: string;
  icon: typeof Package;
  href: string;
  color: string;
  stats: string;
  category: string;
  keywords: string[];
  requiredRole?: "superadmin"; // Si está definido, solo superadmin puede ver esta feature
}

export function AdminDashboardContent({
  user,
  stats,
  adminProductsCount,
}: AdminDashboardContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Todas las funcionalidades organizadas por categoría
  const allFeatures: Feature[] = [
    // 1. Gestión de Reservas - Primera categoría (lentes, computadores, sala)
    {
      title: "Solicitudes de Préstamo (Lentes VR)",
      description: "Gestiona solicitudes de préstamo de equipos VR/AR",
      icon: AlertCircle,
      href: "/admin/solicitudes",
      color: "#1859A9",
      stats: `${stats.solicitudesPendientes || 0} pendientes`,
      category: "Gestión de Reservas",
      keywords: ["préstamos", "solicitudes", "vr", "ar", "lentes", "aprobar"],
    },
    {
      title: "Reservas de Computadoras",
      description: "Administra y aprueba las reservas de computadoras del laboratorio",
      icon: Computer,
      href: "/admin/reservas-lab",
      color: "#1859A9",
      stats: "Gestión de reservas",
      category: "Gestión de Reservas",
      keywords: ["reservas", "laboratorio", "computadoras", "aprobar", "calendario"],
    },
    {
      title: "Reservas de Sala Metaverso",
      description: "Aprueba o rechaza las solicitudes de reserva del laboratorio de metaverso",
      icon: Globe,
      href: "/admin/reservas-metaverso",
      color: "#7C3AED",
      stats: "Aprobar solicitudes",
      category: "Gestión de Reservas",
      keywords: ["aprobar", "rechazar", "metaverso", "solicitudes", "gestionar", "sala"],
    },

    // 2. Configuración del Laboratorio
    {
      title: "Configuración de Computadoras",
      description: "Configura tipos de usuario, software, propósitos y el plano visual del laboratorio",
      icon: LayoutGrid,
      href: "/admin/config-laboratorio",
      color: "#FF8200",
      stats: "Plano y opciones",
      category: "Configuración del Laboratorio",
      keywords: ["configuración", "plano", "grillas", "tipos usuario", "software", "laboratorio"],
      requiredRole: "superadmin",
    },
    {
      title: "Reservar Sala Metaverso",
      description: "Solicita el uso del laboratorio completo para eventos y experiencias inmersivas",
      icon: Globe,
      href: "/laboratorio",
      color: "#8B5CF6",
      stats: "Crear reserva",
      category: "Configuración del Laboratorio",
      keywords: ["laboratorio", "metaverso", "eventos", "reservar", "inmersivo"],
    },

    // 3. Calendarios
    {
      title: "Calendario de Computadoras",
      description: "Vista mensual de todas las reservas aprobadas de computadoras del laboratorio",
      icon: Computer,
      href: "/calendario-computadoras",
      color: "#003087",
      stats: "Vista completa",
      category: "Calendarios",
      keywords: ["calendario", "reservas", "computadoras", "laboratorio", "mensual", "vista", "aprobadas"],
    },
    {
      title: "Calendario Público Metaverso",
      description: "Ver el calendario público de eventos del laboratorio de metaverso",
      icon: Calendar,
      href: "/calendar",
      color: "#10B981",
      stats: "Vista pública",
      category: "Calendarios",
      keywords: ["calendario", "público", "eventos", "metaverso", "ver"],
    },

    // 4. Centro de Control (solo superadmin)
    {
      title: "Centro de Control",
      description: "Panel central con configuraciones del sistema, logs de actividad y estadísticas",
      icon: Gauge,
      href: "/admin/centro-control",
      color: "#7C3AED",
      stats: "Panel completo",
      category: "Centro de Control",
      keywords: ["control", "sistema", "logs", "estadísticas", "configuración", "panel"],
      requiredRole: "superadmin",
    },
    {
      title: "Logs del Sistema",
      description: "Visualiza el historial de acciones y cambios realizados en el sistema",
      icon: FileText,
      href: "/admin/logs",
      color: "#7C3AED",
      stats: "Auditoría",
      category: "Centro de Control",
      keywords: ["logs", "historial", "acciones", "auditoría", "cambios"],
      requiredRole: "superadmin",
    },
    {
      title: "Estadísticas del Sistema",
      description: "Métricas de uso, reservas y actividad general del sistema",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "#7C3AED",
      stats: "Métricas",
      category: "Centro de Control",
      keywords: ["estadísticas", "métricas", "uso", "analytics", "reportes"],
      requiredRole: "superadmin",
    },

    // 5. Gestión de Activos (solo superadmin)
    {
      title: "Gestión de Activos",
      description: "Control completo del inventario - crear, editar y administrar activos",
      icon: Package,
      href: "/admin/activos",
      color: "#FF8200",
      stats: "Administración completa",
      category: "Gestión de Activos",
      keywords: ["activos", "inventario", "productos", "equipos", "crear", "editar"],
      requiredRole: "superadmin",
    },
    {
      title: "Tipos de Activos",
      description: "Gestiona categorías y etiquetas predefinidas para activos",
      icon: Tags,
      href: "/admin/tipos-activos",
      color: "#F68629",
      stats: "Configurar tipos",
      category: "Gestión de Activos",
      keywords: ["tipos", "categorías", "etiquetas", "clasificación"],
      requiredRole: "superadmin",
    },
    {
      title: "Inventario por Ubicación",
      description: "Filtra y administra productos según su ubicación física",
      icon: MapPin,
      href: "/admin/inventario-ubicacion",
      color: "#FF8200",
      stats: "Gestión por ubicación",
      category: "Gestión de Activos",
      keywords: ["ubicación", "localización", "filtrar", "zona"],
      requiredRole: "superadmin",
    },
    {
      title: "Mis Equipos",
      description: "Visualiza y gestiona los equipos que tienes asignados",
      icon: Package,
      href: "/admin/mis-equipos",
      color: "#FF8200",
      stats: `${adminProductsCount} ${adminProductsCount === 1 ? "equipo" : "equipos"}`,
      category: "Gestión de Activos",
      keywords: ["equipos", "asignados", "personal"],
      requiredRole: "superadmin",
    },

    // 6. Gestión de Usuarios
    {
      title: "Roles y Usuarios",
      description: "Crear usuarios, asignar roles (superadmin, admin, user) y gestionar permisos",
      icon: Crown,
      href: "/admin/usuarios",
      color: "#1859A9",
      stats: "Control de acceso",
      category: "Gestión de Usuarios",
      keywords: ["roles", "usuarios", "superadmin", "admin", "permisos", "crear"],
      requiredRole: "superadmin",
    },
    {
      title: "Usuarios y Equipos",
      description: "Administra todos los usuarios del sistema y visualiza sus equipos",
      icon: Users,
      href: "/admin/usuarios-equipos",
      color: "#1859A9",
      stats: "Administración completa",
      category: "Gestión de Usuarios",
      keywords: ["usuarios", "administrar", "equipos", "asignaciones"],
    },
    {
      title: "Productos por Usuario",
      description: "Busca y visualiza qué productos tiene asignado cada usuario",
      icon: Users,
      href: "/admin/productos-usuarios",
      color: "#1859A9",
      stats: "Búsqueda avanzada",
      category: "Gestión de Usuarios",
      keywords: ["usuarios", "productos", "asignaciones", "buscar"],
    },
    {
      title: "Mi Código QR Admin",
      description: "Visualiza tu código QR de acceso administrativo",
      icon: QrCode,
      href: "/admin/qr",
      color: "#003087",
      stats: "Acceso completo",
      category: "Gestión de Usuarios",
      keywords: ["qr", "código", "acceso", "admin"],
    },
  ];

  // Filtrar funcionalidades basado en rol y búsqueda
  const filteredFeatures = allFeatures.filter((feature) => {
    // Primero verificar acceso por rol
    if (feature.requiredRole === "superadmin" && user.role !== "superadmin") {
      return false;
    }

    // Luego filtrar por búsqueda
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      feature.title.toLowerCase().includes(query) ||
      feature.description.toLowerCase().includes(query) ||
      feature.category.toLowerCase().includes(query) ||
      feature.keywords.some((keyword) => keyword.includes(query))
    );
  });

  // Agrupar por categoría
  const categorizedFeatures = filteredFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category]!.push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  // Definir colores e iconos por categoría
  const categoryConfig: Record<string, { icon: typeof Package; color: string; titleColor: string }> = {
    "Gestión de Reservas": { icon: Calendar, color: "#1859A9", titleColor: "#1859A9" },
    "Configuración del Laboratorio": { icon: Settings, color: "#FF8200", titleColor: "#1859A9" },
    "Calendarios": { icon: Calendar, color: "#003087", titleColor: "#1859A9" },
    "Centro de Control": { icon: Gauge, color: "#7C3AED", titleColor: "#7C3AED" },
    "Gestión de Activos": { icon: Package, color: "#FF8200", titleColor: "#1859A9" },
    "Gestión de Usuarios": { icon: Users, color: "#1859A9", titleColor: "#1859A9" },
  };

  // Orden de categorías (Gestión de Reservas primero, luego Configuración)
  const categoryOrder = ["Gestión de Reservas", "Configuración del Laboratorio", "Calendarios", "Centro de Control", "Gestión de Activos", "Gestión de Usuarios"];

  // Ordenar categorías según el orden definido
  const sortedCategories = Object.keys(categorizedFeatures).sort((a, b) => {
    return categoryOrder.indexOf(a) - categoryOrder.indexOf(b);
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
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
                  Bienvenido, {user.name} {user.lastName} - {user.role === "superadmin" ? "Super Administrador" : "Administrador"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
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
                  {stats.solicitudesPendientes || 0}
                </span>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Requieren atención inmediata
              </p>
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
                <span className="text-2xl font-bold text-green-600">✓</span>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Funcionando correctamente
              </p>
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
                  {allFeatures.length}
                </span>
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Funciones disponibles
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Buscador */}
        <Card className="border-0 shadow-md mb-8">
          <CardHeader>
            <CardTitle style={{ color: "#1859A9" }}>
              Buscar Funcionalidades
            </CardTitle>
            <CardDescription>
              Encuentra rápidamente el módulo que necesitas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, categoría o palabra clave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 text-base"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-600 mt-2">
                Se encontraron {filteredFeatures.length} resultado(s)
              </p>
            )}
          </CardContent>
        </Card>

        {/* Funcionalidades por Categoría */}
        {Object.keys(categorizedFeatures).length === 0 ? (
          <Card className="border-0 shadow-md text-center py-12">
            <CardContent>
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-700">
                No se encontraron resultados
              </h3>
              <p className="text-gray-600">
                Intenta con otros términos de búsqueda
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {sortedCategories.map((category) => {
              const features = categorizedFeatures[category]!;
              const config = categoryConfig[category]!;
              const CategoryIcon = config.icon;

              return (
                <Card key={category} className="border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          backgroundColor: `${config.color}20`,
                          color: config.color,
                        }}
                      >
                        <CategoryIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle style={{ color: config.titleColor }}>
                          {category}
                        </CardTitle>
                        <CardDescription>
                          {features.length}{" "}
                          {features.length === 1
                            ? "funcionalidad disponible"
                            : "funcionalidades disponibles"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {features.map((item) => {
                        const FeatureIcon = item.icon;
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
                                  <FeatureIcon className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3
                                    className="font-semibold text-base mb-1"
                                    style={{ color: item.color }}
                                  >
                                    {item.title}
                                  </h3>
                                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                                    {item.description}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <p
                                      className="text-xs font-medium px-2 py-1 rounded-full bg-white"
                                      style={{ color: item.color }}
                                    >
                                      {item.stats}
                                    </p>
                                    <span className="text-xs text-blue-600 font-medium">
                                      Acceder →
                                    </span>
                                  </div>
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
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8">
          {/* Acciones rápidas */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
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
                    <p className="font-medium text-blue-900">
                      Ver Solicitudes Pendientes
                    </p>
                    <p className="text-sm text-blue-700">
                      {stats.solicitudesPendientes || 0} solicitudes esperan
                      revisión
                    </p>
                  </div>
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
