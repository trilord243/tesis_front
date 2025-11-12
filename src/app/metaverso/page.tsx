import { Navbar } from "@/components/layout/navbar";
import { UnityPlayer } from "@/components/unity/unity-player";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import { Building2, Info, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Mundo X en 3D - CentroMundoX",
  description: "Explora el laboratorio de computación en realidad virtual",
};

export default function MetaversoPage() {
  return (
    <>
      <Navbar isAuthenticated={false} showAuthButtons={true} />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="flex items-center space-x-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#1859A920", color: "#1859A9" }}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                    Mundo X en 3D
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Explora nuestro laboratorio de computación en realidad virtual
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <CardTitle>Acerca del Laboratorio</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  Bienvenido al laboratorio de computación de alto rendimiento del Centro Mundo X.
                  Aquí podrás explorar virtualmente nuestras instalaciones equipadas con las últimas
                  tecnologías para diseño 3D, simulación y realidad virtual.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>5 computadoras de acceso general</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>4 computadoras especializadas CFD/Metaverso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Software: Unity, Autodesk, Blender, ANSYS</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <CardTitle>Controles de Navegación</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Movimiento:</p>
                    <p className="text-gray-700">
                      <kbd className="px-2 py-1 bg-gray-100 border rounded text-xs">W</kbd>{" "}
                      <kbd className="px-2 py-1 bg-gray-100 border rounded text-xs">A</kbd>{" "}
                      <kbd className="px-2 py-1 bg-gray-100 border rounded text-xs">S</kbd>{" "}
                      <kbd className="px-2 py-1 bg-gray-100 border rounded text-xs">D</kbd>{" "}
                      - Caminar
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Cámara:</p>
                    <p className="text-gray-700">
                      <kbd className="px-2 py-1 bg-gray-100 border rounded text-xs">Mouse</kbd>{" "}
                      - Mirar alrededor
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Acciones:</p>
                    <p className="text-gray-700">
                      <kbd className="px-2 py-1 bg-gray-100 border rounded text-xs">E</kbd>{" "}
                      - Interactuar |{" "}
                      <kbd className="px-2 py-1 bg-gray-100 border rounded text-xs">ESC</kbd>{" "}
                      - Liberar cursor
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Unity Player */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle style={{ color: "#1859A9" }}>
                Laboratorio Virtual
              </CardTitle>
              <CardDescription>
                Explora el laboratorio en tiempo real. Haz clic en el visor para comenzar a navegar.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <UnityPlayer width={1280} height={720} />
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
