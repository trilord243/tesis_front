import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { ProductForm } from "@/components/admin/product-form";
import { MetaQuestSetForm } from "@/components/admin/metaquest-set-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata, Viewport } from "next";
import Link from "next/link";
import {
  Package,
  Plus,
  ArrowLeft,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Agregar Producto - Admin CentroMundoX",
  description: "Agregar nuevos productos al inventario",
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
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                    Agregar Producto
                  </h1>
                  <p className="text-gray-600">Crear nuevos productos en el inventario</p>
                </div>
              </div>
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Productos
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Individual Product Form */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Package className="h-6 w-6" style={{ color: "#1859A9" }} />
                  <div>
                    <CardTitle style={{ color: "#1859A9" }}>
                      Producto Individual
                    </CardTitle>
                    <CardDescription>
                      Agregar un headset o controlador individual
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ProductForm />
              </CardContent>
            </Card>

            {/* MetaQuest Set Form */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Gamepad2 className="h-6 w-6" style={{ color: "#FF8200" }} />
                  <div>
                    <CardTitle style={{ color: "#FF8200" }}>
                      Set Completo MetaQuest
                    </CardTitle>
                    <CardDescription>
                      Crear un set completo (1 headset + 2 controladores)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <MetaQuestSetForm />
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <Card className="mt-8 border-0 shadow-md">
            <CardHeader>
              <CardTitle style={{ color: "#1859A9" }}>
                Información Importante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: "#003087" }}>
                    Producto Individual
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Usa esto para agregar headsets o controladores por separado</li>
                    <li>• Para controladores, necesitas el ID del headset asociado</li>
                    <li>• El sistema genera automáticamente códigos EPC únicos</li>
                    <li>• Cada producto recibe un código interno automático</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: "#FF8200" }}>
                    Set Completo MetaQuest
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Crea 1 headset + 2 controladores en una sola operación</li>
                    <li>• Los controladores se vinculan automáticamente al headset</li>
                    <li>• Más eficiente para configurar equipos completos</li>
                    <li>• Todos los productos reciben códigos únicos</li>
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