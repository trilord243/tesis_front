import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { MyEquipment } from "@/components/dashboard/my-equipment";
import { Metadata } from "next";
import { getUserProducts } from "@/lib/admin-products";

export const metadata: Metadata = {
  title: "Mis Equipos - Admin CentroMundoX",
  description: "Visualiza los equipos que tienes asignados",
};

export default async function MisEquiposAdminPage() {
  await requireAdmin();
  const user = await getCurrentUser();

  if (!user) {
    return <div>Error: Usuario no encontrado</div>;
  }

  // Obtener los equipos del administrador
  const adminProducts = user.codigo_acceso
    ? await getUserProducts(user.codigo_acceso)
    : [];

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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="titular" style={{ color: "#1859A9" }}>
                    Mis Equipos
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Equipos asignados a {user.name} {user.lastName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MyEquipment products={adminProducts} />
        </main>
      </div>
    </>
  );
}
