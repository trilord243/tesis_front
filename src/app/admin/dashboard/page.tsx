import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Metadata } from "next";
import { getAdminDashboardStats } from "@/lib/dashboard-stats";
import { getUserProducts } from "@/lib/admin-products";
import { AdminDashboardContent } from "@/components/admin/admin-dashboard-content";

export const metadata: Metadata = {
  title: "Admin Dashboard - CentroMundoX",
  description: "Panel de administración del sistema",
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const user = await getCurrentUser();

  if (!user) {
    return <div>Error: Usuario no encontrado</div>;
  }

  // Obtener estadísticas reales del servidor
  const stats = await getAdminDashboardStats();

  // Obtener los equipos del administrador
  const adminProducts = user.codigo_acceso
    ? await getUserProducts(user.codigo_acceso)
    : [];

  return (
    <>
      <Navbar
        isAuthenticated={true}
        showAuthButtons={true}
        isAdmin={true}
        isSuperAdmin={user.role === "superadmin"}
      />
      <AdminDashboardContent
        user={user}
        stats={stats}
        adminProductsCount={adminProducts.length}
      />
    </>
  );
}
