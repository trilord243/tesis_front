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
  AlertCircle,
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetsList } from "@/components/admin/assets-list";
import { AssetLocationManager } from "@/components/admin/asset-location-manager";

export const metadata: Metadata = {
  title: "Gestión de Activos - Admin CentroMundoX",
  description: "Administrar activos del inventario",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function ActivosAdminPage() {
  await requireAdmin();
  const user = await getCurrentUser();
  const productsResult = await getProducts();

  if (!user) {
    return <div>Error: Usuario no encontrado</div>;
  }

  const products = productsResult.success ? productsResult.products : [];

  return (
    <>
      <Navbar
        isAuthenticated={true}
        showAuthButtons={false}
        isAdmin={true}
      />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
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
                    Gestión de Activos
                  </h1>
                  <p className="text-gray-600">Administrar inventario de equipos</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/admin/tipos-activos">
                  <Button variant="outline" style={{ borderColor: "#F68629", color: "#F68629" }}>
                    <Tags className="h-4 w-4 mr-2" />
                    Tipos de Activos
                  </Button>
                </Link>
                <Link href="/admin/activos/add">
                  <Button style={{ backgroundColor: "#FF8200" }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Activo
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
                Error al cargar activos: {productsResult.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base" style={{ color: "#1859A9" }}>
                  Total Activos
                </CardTitle>
                <CardDescription>En el sistema</CardDescription>
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
                  Disponibles
                </CardTitle>
                <CardDescription>Listos para usar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {products?.filter(p => p.isAvailable).length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base" style={{ color: "#1859A9" }}>
                  En Uso
                </CardTitle>
                <CardDescription>Actualmente prestados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {products?.filter(p => !p.isAvailable).length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base" style={{ color: "#1859A9" }}>
                  Mantenimiento
                </CardTitle>
                <CardDescription>En reparación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {products?.filter(p => p.estadoUbicacion === 'maintenance').length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Asset Management */}
          <div className="mb-8">
            <AssetLocationManager />
          </div>

          {/* All Assets List */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle style={{ color: "#1859A9" }}>
                Listado de Activos
              </CardTitle>
              <CardDescription>
                Todos los activos del inventario con opciones de gestión
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssetsList products={products || []} />
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}