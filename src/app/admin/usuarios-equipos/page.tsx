import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Metadata } from "next";
import { getAllUsersWithEquipment } from "@/lib/admin-products";
import { UsersEquipmentManager } from "@/components/admin/users-equipment-manager";

export const metadata: Metadata = {
  title: "Gestión de Usuarios - Admin CentroMundoX",
  description: "Administrar usuarios y sus equipos asignados",
};

export default async function UsuariosEquiposPage() {
  await requireAdmin();
  const user = await getCurrentUser();

  if (!user) {
    return <div>Error: Usuario no encontrado</div>;
  }

  // Obtener todos los usuarios con sus equipos
  const usersWithEquipment = await getAllUsersWithEquipment();

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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="titular" style={{ color: "#1859A9" }}>
                    Gestión de Usuarios
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Administra todos los usuarios del sistema y visualiza sus equipos asignados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UsersEquipmentManager initialUsers={usersWithEquipment} />
        </main>
      </div>
    </>
  );
}