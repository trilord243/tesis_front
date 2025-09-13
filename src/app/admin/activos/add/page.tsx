import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { AssetForm } from "@/components/admin/asset-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata, Viewport } from "next";
import Link from "next/link";
import { Package, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Agregar Activo - Admin CentroMundoX",
  description: "Agregar nuevos activos al inventario",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function AddProductPage() {
  await requireAdmin();
  const user = await getCurrentUser();

  if (!user) {
    return <div>Error: Usuario no encontrado</div>;
  }

  return (
    <>
      <Navbar isAuthenticated={true} showAuthButtons={false} isAdmin={true} />
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: "80px" }}>
        {/* Header Section */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50">
                  <Plus className="h-6 w-6" style={{ color: "#1859A9" }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Agregar Nuevo Activo
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Complete el formulario para registrar un activo en el
                    inventario
                  </p>
                </div>
              </div>
              <Link href="/admin/activos">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Activos
                </Button>
              </Link>
            </div>
            {/* Breadcrumb */}
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span>Dashboard</span>
              <span className="mx-2">/</span>
              <span>Activos</span>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Agregar Activo</span>
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Product Form */}
          <Card className="border-0 shadow-md max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Package className="h-6 w-6" style={{ color: "#1859A9" }} />
                <div>
                  <CardTitle style={{ color: "#1859A9" }}>
                    Nuevo Activo
                  </CardTitle>
                  <CardDescription>
                    Agregar un nuevo activo al inventario con tipo
                    personalizable
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AssetForm />
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-8 border-0 shadow-md">
            <CardHeader>
              <CardTitle style={{ color: "#1859A9" }}>
                Información del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: "#003087" }}
                  >
                    Tipos de Productos
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Selecciona un tipo existente de la base de datos</li>
                    <li>• Crea nuevos tipos si no encuentras el adecuado</li>
                    <li>• Los tipos incluyen etiquetas predefinidas</li>
                    <li>
                      • Las sugerencias de nombres se adaptan al tipo
                      seleccionado
                    </li>
                  </ul>
                </div>
                <div>
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: "#FF8200" }}
                  >
                    Códigos y Etiquetas RFID
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • El sistema genera automáticamente códigos EPC únicos
                    </li>
                    <li>
                      • Las etiquetas RFID se pueden imprimir directamente
                    </li>
                    <li>• Cada activo recibe un código interno automático</li>
                    <li>
                      • Los tags personalizados complementan los predefinidos
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
