import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/products";
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
  Eye,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Gestión de Productos - Admin CentroMundoX",
  description: "Administrar productos del inventario",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function ProductsAdminPage() {
  await requireAdmin();
  const user = await getCurrentUser();
  const productsResult = await getProducts();

  if (!user) {
    return <div>Error: Usuario no encontrado</div>;
  }

  const products = productsResult.success ? productsResult.products : [];
  const headsets = products?.filter(p => p.type === "headset") || [];
  const controllers = products?.filter(p => p.type === "controller") || [];

  return (
    <>
      <Navbar
        isAuthenticated={true}
        showAuthButtons={false}
        isAdmin={true}
      />
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: "80px" }}>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                  <h1 className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                    Gestión de Productos
                  </h1>
                  <p className="text-gray-600">Administrar inventario de equipos</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/admin/products/add">
                  <Button style={{ backgroundColor: "#FF8200" }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </Link>
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
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
                Error al cargar productos: {productsResult.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base" style={{ color: "#1859A9" }}>
                  Total Productos
                </CardTitle>
                <CardDescription>Productos en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: "#FF8200" }}>
                  {products?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base" style={{ color: "#1859A9" }}>
                  Headsets
                </CardTitle>
                <CardDescription>Dispositivos VR principales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: "#003087" }}>
                  {headsets.length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base" style={{ color: "#1859A9" }}>
                  Controllers
                </CardTitle>
                <CardDescription>Controladores disponibles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: "#003087" }}>
                  {controllers.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Headsets */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle style={{ color: "#1859A9" }}>
                  Headsets VR/AR
                </CardTitle>
                <CardDescription>
                  Dispositivos principales de realidad virtual
                </CardDescription>
              </CardHeader>
              <CardContent>
                {headsets.length > 0 ? (
                  <div className="space-y-3">
                    {headsets.map((headset) => (
                      <div
                        key={headset._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{headset.name}</h4>
                          <p className="text-sm text-gray-500">
                            S/N: {headset.serialNumber}
                          </p>
                          <p className="text-xs text-gray-400">
                            Código: {headset.codigo}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              headset.isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {headset.isAvailable ? "Disponible" : "En uso"}
                          </span>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay headsets registrados</p>
                    <Link href="/admin/products/add">
                      <Button className="mt-4" style={{ backgroundColor: "#FF8200" }}>
                        Agregar primer headset
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Controllers */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle style={{ color: "#1859A9" }}>
                  Controladores
                </CardTitle>
                <CardDescription>
                  Controladores para dispositivos VR
                </CardDescription>
              </CardHeader>
              <CardContent>
                {controllers.length > 0 ? (
                  <div className="space-y-3">
                    {controllers.map((controller) => (
                      <div
                        key={controller._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{controller.name}</h4>
                          <p className="text-sm text-gray-500">
                            S/N: {controller.serialNumber}
                          </p>
                          <p className="text-xs text-gray-400">
                            Código: {controller.codigo}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              controller.isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {controller.isAvailable ? "Disponible" : "En uso"}
                          </span>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay controladores registrados</p>
                    <Link href="/admin/products/add">
                      <Button className="mt-4" style={{ backgroundColor: "#FF8200" }}>
                        Agregar controladores
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}