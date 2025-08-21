import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { getProducts, getCabinetInventory } from "@/lib/products";
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
  Package,
  Plus,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
  Headphones,
  Gamepad2,
  Home,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductPrintButton } from "@/components/admin/product-print-button";
import { ProductDetailsDialog } from "@/components/admin/product-details-dialog";

export const metadata: Metadata = {
  title: "Gestión de Activos - Admin CentroMundoX",
  description: "Administrar todos los activos e inventario del centro",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function AssetsManagementPage() {
  await requireAdmin();
  const user = await getCurrentUser();
  const productsResult = await getProducts();
  const cabinetResult = await getCabinetInventory();

  if (!user) {
    return <div>Error: Usuario no encontrado</div>;
  }

  const allProducts = productsResult.success ? productsResult.products : [];
  const cabinetProducts = cabinetResult.success ? cabinetResult.products : [];
  
  // Categorizar productos
  const headsets = allProducts?.filter(p => p.type === "headset") || [];
  const controllers = allProducts?.filter(p => p.type === "controller") || [];
  
  // Determinar ubicación de cada producto
  const productsWithLocation = allProducts?.map(product => {
    const isInCabinet = cabinetProducts?.some(cp => cp.hexValue === product.hexValue);
    return {
      ...product,
      location: isInCabinet ? "Gabinete RFID" : "En préstamo",
      locationIcon: isInCabinet ? Archive : Home,
      locationColor: isInCabinet ? "text-blue-600" : "text-orange-600",
    };
  }) || [];

  // Estadísticas
  const stats = {
    total: allProducts?.length || 0,
    available: allProducts?.filter(p => p.isAvailable).length || 0,
    inUse: allProducts?.filter(p => !p.isAvailable).length || 0,
    inCabinet: cabinetProducts?.length || 0,
    headsets: headsets.length,
    controllers: controllers.length,
  };

  return (
    <>
      <Navbar
        isAuthenticated={true}
        showAuthButtons={false}
        isAdmin={true}
      />
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: "80px" }}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full"
                  style={{ backgroundColor: "#FF8200" }}
                >
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: "#1859A9" }}>
                    Gestión de Activos
                  </h1>
                  <p className="text-gray-600">Control completo del inventario y ubicación de equipos</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/admin/products/add">
                  <Button style={{ backgroundColor: "#FF8200" }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Activo
                  </Button>
                </Link>
                <Link href="/admin/dashboard">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Error handling */}
          {!productsResult.success && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Error al cargar activos: {productsResult.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: "#1859A9" }}>
                  Total Activos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: "#FF8200" }}>
                  {stats.total}
                </div>
                <p className="text-xs text-gray-500 mt-1">Equipos totales</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: "#1859A9" }}>
                  Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.available}
                </div>
                <p className="text-xs text-gray-500 mt-1">Listos para usar</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: "#1859A9" }}>
                  En Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.inUse}
                </div>
                <p className="text-xs text-gray-500 mt-1">Prestados</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: "#1859A9" }}>
                  En Gabinete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.inCabinet}
                </div>
                <p className="text-xs text-gray-500 mt-1">Almacenados</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: "#1859A9" }}>
                  Headsets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: "#003087" }}>
                  {stats.headsets}
                </div>
                <p className="text-xs text-gray-500 mt-1">Dispositivos VR</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: "#1859A9" }}>
                  Controles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: "#003087" }}>
                  {stats.controllers}
                </div>
                <p className="text-xs text-gray-500 mt-1">Controladores</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Assets Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl" style={{ color: "#1859A9" }}>
                    Inventario Completo de Activos
                  </CardTitle>
                  <CardDescription>
                    Vista detallada de todos los equipos con ubicación y estado actual
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Disponible
                  </Badge>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <XCircle className="h-3 w-3 mr-1" />
                    En Uso
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {productsWithLocation.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Nombre</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Serial</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Código</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Ubicación</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">RFID Tag</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsWithLocation.map((product) => {
                        const LocationIcon = product.locationIcon;
                        const TypeIcon = product.type === "headset" ? Headphones : Gamepad2;
                        
                        return (
                          <tr key={product._id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <TypeIcon className="h-5 w-5 text-gray-500 mr-2" />
                                <span className="text-sm capitalize">{product.type}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium">{product.name}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-gray-600">{product.serialNumber}</span>
                            </td>
                            <td className="py-3 px-4">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {product.codigo}
                              </code>
                            </td>
                            <td className="py-3 px-4">
                              <Badge 
                                variant={product.isAvailable ? "default" : "secondary"}
                                className={product.isAvailable 
                                  ? "bg-green-100 text-green-800 border-green-200" 
                                  : "bg-orange-100 text-orange-800 border-orange-200"}
                              >
                                {product.isAvailable ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Disponible
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    En Uso
                                  </>
                                )}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <LocationIcon className={`h-4 w-4 ${product.locationColor}`} />
                                <span className={`text-sm font-medium ${product.locationColor}`}>
                                  {product.location}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <code className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono">
                                {product.hexValue}
                              </code>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <ProductDetailsDialog product={product} />
                                <ProductPrintButton 
                                  product={product}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">No hay activos registrados</p>
                  <p className="text-sm mb-4">Comienza agregando activos al inventario</p>
                  <Link href="/admin/products/add">
                    <Button style={{ backgroundColor: "#FF8200" }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Primer Activo
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Information Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Información del Sistema</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Los productos se rastrean automáticamente mediante RFID cuando entran o salen del gabinete</li>
                  <li>• Puedes imprimir etiquetas RFID para cualquier producto usando el botón de impresión</li>
                  <li>• El estado &quot;Disponible&quot; indica que el equipo puede ser reservado por usuarios</li>
                  <li>• La ubicación &quot;Gabinete RFID&quot; significa que el producto está almacenado de forma segura</li>
                  <li>• La ubicación &quot;En préstamo&quot; indica que el producto está siendo usado por un usuario</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}