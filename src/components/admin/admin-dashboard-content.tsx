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
} from "lucide-react";

interface AdminDashboardContentProps {
  user: {
    name: string;
    lastName: string;
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
}

export function AdminDashboardContent({
  user,
  stats,
  adminProductsCount,
}: AdminDashboardContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Todas las funcionalidades organizadas por categoría
  const allFeatures: Feature[] = [
    // Gestión de Activos
    {
      title: "Gestión de Activos",
      description: "Control completo del inventario - crear, editar y administrar activos",
      icon: Package,
      href: "/admin/activos",
      color: "#FF8200",
      stats: "Administración completa",
      category: "Gestión de Activos",
      keywords: ["activos", "inventario", "productos", "equipos", "crear", "editar"],
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
    },

    // Gestión de Usuarios
    {
      title: "Gestión de Usuarios",
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

    // Gestión de Préstamos y Reservas
    {
      title: "Solicitudes de Préstamo",
      description: "Gestiona solicitudes de préstamo de equipos VR/AR",
      icon: AlertCircle,
      href: "/admin/solicitudes",
      color: "#1859A9",
      stats: `${stats.solicitudesPendientes || 0} pendientes`,
      category: "Préstamos y Reservas",
      keywords: ["préstamos", "solicitudes", "vr", "ar", "lentes", "aprobar"],
    },
    {
      title: "Reservas de Laboratorio",
      description: "Administra y aprueba las reservas de computadoras del laboratorio",
      icon: Computer,
      href: "/admin/reservas-lab",
      color: "#1859A9",
      stats: "Gestión de reservas",
      category: "Préstamos y Reservas",
      keywords: ["reservas", "laboratorio", "computadoras", "aprobar", "calendario"],
    },
    {
      title: "Calendario de Reservas",
      description: "Vista mensual de todas las reservas aprobadas del laboratorio",
      icon: Calendar,
      href: "/admin/calendario-reservas",
      color: "#003087",
      stats: "Vista completa",
      category: "Préstamos y Reservas",
      keywords: ["calendario", "reservas", "mensual", "vista", "aprobadas"],
    },
  ];

  // Filtrar funcionalidades basado en la búsqueda
  const filteredFeatures = allFeatures.filter((feature) => {
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
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  // Definir colores e iconos por categoría
  const categoryConfig: Record<string, { icon: typeof Package; color: string; titleColor: string }> = {
    "Gestión de Activos": { icon: Package, color: "#FF8200", titleColor: "#1859A9" },
    "Gestión de Usuarios": { icon: Users, color: "#1859A9", titleColor: "#1859A9" },
    "Préstamos y Reservas": { icon: Calendar, color: "#003087", titleColor: "#1859A9" },
  };

  // Orden de categorías (Préstamos y Reservas primero)
  const categoryOrder = ["Préstamos y Reservas", "Gestión de Activos", "Gestión de Usuarios"];

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
                  Bienvenido, {user.name} {user.lastName} - Administrador
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
              const features = categorizedFeatures[category];
              const config = categoryConfig[category];
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
