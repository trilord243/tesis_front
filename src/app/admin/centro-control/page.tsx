"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gauge,
  Settings,
  Users,
  Tags,
  LayoutGrid,
  Package,
  FileText,
  BarChart3,
  ChevronRight,
  Activity,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Database,
} from "lucide-react";

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalReservations: number;
  pendingReservations: number;
  approvedReservations: number;
  rejectedReservations: number;
  totalProducts: number;
}

export default function CentroControlPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentLogs, setRecentLogs] = useState<Array<{
    id: string;
    action: string;
    user: string;
    timestamp: string;
    type: "reservation" | "user" | "product";
  }>>([]);

  // Cargar estadísticas
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        // Por ahora usamos datos de ejemplo, luego se conectará con el backend
        // Simular carga
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Datos de ejemplo (esto se reemplazará con la API real)
        setStats({
          totalUsers: 45,
          activeUsers: 38,
          totalReservations: 128,
          pendingReservations: 12,
          approvedReservations: 98,
          rejectedReservations: 18,
          totalProducts: 67,
        });

        setRecentLogs([
          { id: "1", action: "Reserva aprobada", user: "Admin", timestamp: "Hace 5 min", type: "reservation" },
          { id: "2", action: "Usuario creado", user: "Sistema", timestamp: "Hace 15 min", type: "user" },
          { id: "3", action: "Producto actualizado", user: "Admin", timestamp: "Hace 30 min", type: "product" },
          { id: "4", action: "Reserva rechazada", user: "Admin", timestamp: "Hace 1 hora", type: "reservation" },
          { id: "5", action: "Configuración modificada", user: "Superadmin", timestamp: "Hace 2 horas", type: "product" },
        ]);
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Configuraciones rápidas
  const quickConfigs = [
    {
      title: "Roles y Usuarios",
      description: "Gestionar usuarios y permisos",
      icon: Users,
      href: "/admin/usuarios",
      color: "#1859A9",
    },
    {
      title: "Tipos de Activos",
      description: "Categorías de productos",
      icon: Tags,
      href: "/admin/tipos-activos",
      color: "#F68629",
    },
    {
      title: "Config. Laboratorio",
      description: "Plano y opciones del lab",
      icon: LayoutGrid,
      href: "/admin/config-laboratorio",
      color: "#FF8200",
    },
    {
      title: "Gestión de Activos",
      description: "Inventario completo",
      icon: Package,
      href: "/admin/activos",
      color: "#FF8200",
    },
  ];

  const getLogIcon = (type: string) => {
    switch (type) {
      case "reservation":
        return Calendar;
      case "user":
        return Users;
      case "product":
        return Package;
      default:
        return Activity;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case "reservation":
        return "text-blue-600 bg-blue-100";
      case "user":
        return "text-green-600 bg-green-100";
      case "product":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <>
      <Navbar isAuthenticated={true} showAuthButtons={false} isAdmin={true} />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#7C3AED20", color: "#7C3AED" }}
                  >
                    <Gauge className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: "#7C3AED" }}>
                      Centro de Control
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Panel de administración del sistema - Solo Superadmin
                    </p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                  Superadmin
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Usuarios Activos</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {loading ? "..." : stats?.activeUsers}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      de {stats?.totalUsers} totales
                    </p>
                  </div>
                  <Users className="h-10 w-10 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Reservas Totales</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {loading ? "..." : stats?.totalReservations}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      este mes
                    </p>
                  </div>
                  <Calendar className="h-10 w-10 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pendientes</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {loading ? "..." : stats?.pendingReservations}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      requieren acción
                    </p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tasa Aprobación</p>
                    <p className="text-3xl font-bold text-green-600">
                      {loading
                        ? "..."
                        : stats
                        ? `${Math.round((stats.approvedReservations / stats.totalReservations) * 100)}%`
                        : "0%"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats?.approvedReservations} aprobadas
                    </p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Configuraciones Rápidas */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" style={{ color: "#7C3AED" }} />
                    Configuraciones
                  </CardTitle>
                  <CardDescription>
                    Acceso rápido a las configuraciones del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickConfigs.map((config) => {
                    const Icon = config.icon;
                    return (
                      <Link key={config.href} href={config.href}>
                        <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{
                                backgroundColor: `${config.color}20`,
                                color: config.color,
                              }}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{config.title}</p>
                              <p className="text-xs text-gray-500">{config.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Actividad Reciente (Logs) */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" style={{ color: "#7C3AED" }} />
                        Actividad Reciente
                      </CardTitle>
                      <CardDescription>
                        Últimas acciones en el sistema
                      </CardDescription>
                    </div>
                    <Link href="/admin/logs">
                      <Button variant="outline" size="sm">
                        Ver todo
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentLogs.map((log) => {
                        const Icon = getLogIcon(log.type);
                        return (
                          <div
                            key={log.id}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                          >
                            <div className={`p-1.5 rounded-full ${getLogColor(log.type)}`}>
                              <Icon className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{log.action}</p>
                              <p className="text-xs text-gray-500">
                                {log.user} · {log.timestamp}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" style={{ color: "#7C3AED" }} />
                        Estadísticas
                      </CardTitle>
                      <CardDescription>
                        Resumen del sistema
                      </CardDescription>
                    </div>
                    <Link href="/admin/analytics">
                      <Button variant="outline" size="sm">
                        Detalles
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Reservas por estado */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Estado de Reservas</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Aprobadas</span>
                        </div>
                        <span className="text-sm font-semibold text-green-600">
                          {stats?.approvedReservations || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">Pendientes</span>
                        </div>
                        <span className="text-sm font-semibold text-yellow-600">
                          {stats?.pendingReservations || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Rechazadas</span>
                        </div>
                        <span className="text-sm font-semibold text-red-600">
                          {stats?.rejectedReservations || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso visual */}
                  {stats && stats.totalReservations > 0 && (
                    <div className="pt-2">
                      <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                        <div
                          className="bg-green-500"
                          style={{
                            width: `${(stats.approvedReservations / stats.totalReservations) * 100}%`,
                          }}
                        />
                        <div
                          className="bg-yellow-500"
                          style={{
                            width: `${(stats.pendingReservations / stats.totalReservations) * 100}%`,
                          }}
                        />
                        <div
                          className="bg-red-500"
                          style={{
                            width: `${(stats.rejectedReservations / stats.totalReservations) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Info adicional */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Productos en sistema</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {stats?.totalProducts || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Sistema activo</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Online
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Gauge className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900">
                        Panel de Control Centralizado
                      </h3>
                      <p className="text-sm text-purple-700">
                        Accede a todas las funciones de administración desde un solo lugar
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/admin/solicitudes">
                      <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                        Ver Solicitudes
                      </Button>
                    </Link>
                    <Link href="/admin/reservas-metaverso">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Gestionar Reservas
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
