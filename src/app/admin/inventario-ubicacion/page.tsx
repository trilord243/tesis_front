import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Metadata } from "next";
import { getLocationSummary } from "@/lib/admin-products";
import { LocationInventoryDashboard } from "@/components/admin/location-inventory-dashboard";

export const metadata: Metadata = {
  title: "Inventario por Ubicación - Admin CentroMundoX",
  description: "Dashboard de inventario filtrado por ubicaciones",
};

export default async function InventarioUbicacionPage() {
  await requireAdmin();
  const user = await getCurrentUser();

  if (!user) {
    return <div>Error: Usuario no encontrado</div>;
  }

  // Obtener resumen inicial de ubicaciones
  const initialLocationSummary = await getLocationSummary();

  return (
    <>
      <Navbar isAuthenticated={true} showAuthButtons={false} isAdmin={true} />
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center space-x-4">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full"
                  style={{ backgroundColor: "#FF8200" }}
                >
                  <svg 
                    className="h-6 w-6 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="titular" style={{ color: "#1859A9" }}>
                    Inventario por Ubicación
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Visualiza y filtra productos por su ubicación física en el centro
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LocationInventoryDashboard initialLocationSummary={initialLocationSummary} />
        </main>
      </div>
    </>
  );
}