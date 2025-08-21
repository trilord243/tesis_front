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
import {
  Package,
  Monitor,
  Headphones,
  Cpu,
  HardDrive,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Activos Fijos - Admin CentroMundoX",
  description: "Gestión de activos fijos del centro",
};

export default async function AdminActivosPage() {
  await requireAdmin();
  const user = await getCurrentUser();

  if (!user) {
    return <div>Error: Usuario no encontrado</div>;
  }

  // Datos de ejemplo para activos fijos
  const activos = [
    {
      id: 1,
      nombre: "Lentes VR Meta Quest 3",
      categoria: "Realidad Virtual",
      codigo: "VR-001",
      estado: "Disponible",
      ubicacion: "Sala VR 1",
      fechaAdquisicion: "2024-01-15",
      valor: "$899.99",
      icon: Headphones,
    },
    {
      id: 2,
      nombre: "Lentes AR HoloLens 2",
      categoria: "Realidad Aumentada",
      codigo: "AR-001",
      estado: "En uso",
      ubicacion: "Sala AR",
      fechaAdquisicion: "2023-12-10",
      valor: "$3,500.00",
      icon: Monitor,
    },
    {
      id: 3,
      nombre: "PC Gaming RTX 4090",
      categoria: "Computadoras",
      codigo: "PC-001",
      estado: "Disponible",
      ubicacion: "Estación 1",
      fechaAdquisicion: "2024-02-20",
      valor: "$2,999.99",
      icon: Cpu,
    },
    {
      id: 4,
      nombre: "Servidor Principal",
      categoria: "Servidores",
      codigo: "SRV-001",
      estado: "Operativo",
      ubicacion: "Sala de Servidores",
      fechaAdquisicion: "2023-10-05",
      valor: "$5,500.00",
      icon: HardDrive,
    },
  ];

  const estadisticas = {
    total: activos.length,
    disponibles: activos.filter(a => a.estado === "Disponible").length,
    enUso: activos.filter(a => a.estado === "En uso" || a.estado === "Operativo").length,
    valorTotal: "$12,899.98",
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Disponible":
        return "bg-green-100 text-green-800 border-green-200";
      case "En uso":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Operativo":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Mantenimiento":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Fuera de servicio":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      <Navbar isAuthenticated={true} showAuthButtons={false} isAdmin={true} />
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
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="titular" style={{ color: "#1859A9" }}>
                    Gestión de Activos Fijos
                  </h1>
                  <p className="text-sm text-gray-600">
                    Inventario y control de equipos del CentroMundoX
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Activos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                    {estadisticas.total}
                  </span>
                  <Package className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Equipos registrados</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    {estadisticas.disponibles}
                  </span>
                  <Monitor className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Listos para usar</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  En Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    {estadisticas.enUso}
                  </span>
                  <Headphones className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Actualmente ocupados</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Valor Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold" style={{ color: "#FF8200" }}>
                    {estadisticas.valorTotal}
                  </span>
                  <Cpu className="h-8 w-8 text-orange-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Inversión total</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Activos */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle style={{ color: "#1859A9" }}>
                Inventario de Activos Fijos
              </CardTitle>
              <CardDescription>
                Lista completa de equipos y dispositivos del centro
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activos.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No se encontraron activos registrados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activos.map((activo) => {
                    const IconComponent = activo.icon;
                    return (
                      <Card key={activo.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: "#1859A920", color: "#1859A9" }}
                              >
                                <IconComponent className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {activo.nombre}
                                </h3>
                                <p className="text-xs text-gray-500">{activo.codigo}</p>
                              </div>
                            </div>
                            <span 
                              className={`px-2 py-1 text-xs font-medium rounded-full border ${getEstadoColor(activo.estado)}`}
                            >
                              {activo.estado}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Categoría:</span>
                              <span className="font-medium">{activo.categoria}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ubicación:</span>
                              <span className="font-medium">{activo.ubicacion}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Adquisición:</span>
                              <span className="font-medium">{activo.fechaAdquisicion}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                              <span className="text-gray-600">Valor:</span>
                              <span className="font-bold" style={{ color: "#FF8200" }}>
                                {activo.valor}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información adicional */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Información del Sistema</h3>
            </div>
            <div className="text-sm text-blue-800">
              <p className="mb-2">
                • Los activos se actualizan automáticamente cuando se realizan reservas
              </p>
              <p className="mb-2">
                • El estado &quot;Disponible&quot; indica que el equipo está listo para ser reservado
              </p>
              <p>
                • Para gestión avanzada de inventario, contacte al administrador del sistema
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}