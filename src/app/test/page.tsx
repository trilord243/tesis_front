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
import { Gamepad2, Info, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Test Unity WebGL - CentroMundoX",
  description: "Página de prueba para visualizar el metaverso de Unity",
};

export default function TestUnityPage() {
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
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: "#1859A9" }}>
                    Prueba de Unity WebGL
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Visualización del metaverso - CampuUnimetWebLimpio
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
                  <CardTitle>Información del Proyecto</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-gray-600">Nombre:</dt>
                    <dd className="font-semibold">CampuUnimetWebLimpio</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">Versión:</dt>
                    <dd className="font-semibold">0.1.0</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">Tecnología:</dt>
                    <dd className="font-semibold">Unity WebGL</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">Compresión:</dt>
                    <dd className="font-semibold">Brotli (.br)</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <CardTitle>Requisitos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Navegador moderno con soporte WebGL 2.0</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>WebAssembly habilitado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Mínimo 4GB de RAM recomendado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">⚠</span>
                    <span>
                      La primera carga puede tardar varios segundos (archivos grandes)
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Unity Player */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle style={{ color: "#1859A9" }}>
                Metaverso Interactivo
              </CardTitle>
              <CardDescription>
                Usa las teclas WASD para moverte y el mouse para mirar alrededor
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <UnityPlayer width={960} height={600} />
            </CardContent>
          </Card>

          {/* Controles */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Controles del Juego</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-semibold mb-2 text-blue-600">
                    Movimiento
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>
                      <kbd className="px-2 py-1 bg-white border rounded">W</kbd>{" "}
                      Adelante
                    </li>
                    <li>
                      <kbd className="px-2 py-1 bg-white border rounded">A</kbd>{" "}
                      Izquierda
                    </li>
                    <li>
                      <kbd className="px-2 py-1 bg-white border rounded">S</kbd>{" "}
                      Atrás
                    </li>
                    <li>
                      <kbd className="px-2 py-1 bg-white border rounded">D</kbd>{" "}
                      Derecha
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-semibold mb-2 text-blue-600">Cámara</div>
                  <ul className="text-sm space-y-1">
                    <li>
                      <kbd className="px-2 py-1 bg-white border rounded">
                        Mouse
                      </kbd>{" "}
                      Mirar
                    </li>
                    <li>
                      <kbd className="px-2 py-1 bg-white border rounded">
                        Scroll
                      </kbd>{" "}
                      Zoom
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-semibold mb-2 text-blue-600">
                    Acciones
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>
                      <kbd className="px-2 py-1 bg-white border rounded">
                        Space
                      </kbd>{" "}
                      Saltar
                    </li>
                    <li>
                      <kbd className="px-2 py-1 bg-white border rounded">
                        Shift
                      </kbd>{" "}
                      Correr
                    </li>
                    <li>
                      <kbd className="px-2 py-1 bg-white border rounded">E</kbd>{" "}
                      Interactuar
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-semibold mb-2 text-blue-600">
                    Sistema
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>
                      <kbd className="px-2 py-1 bg-white border rounded">
                        ESC
                      </kbd>{" "}
                      Liberar cursor
                    </li>
                    <li>
                      <kbd className="px-2 py-1 bg-white border rounded">F</kbd>{" "}
                      Pantalla completa
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
