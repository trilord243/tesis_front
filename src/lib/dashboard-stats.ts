import { getAuthToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Función para obtener estadísticas del dashboard admin
export async function getAdminDashboardStats() {
  try {
    const token = await getAuthToken();

    if (!token) {
      console.error('No auth token available');
      return {
        solicitudesPendientes: 0,
        error: 'No autorizado'
      };
    }

    // Obtener solicitudes pendientes directamente del backend
    const response = await fetch(`${API_BASE_URL}/lens-requests/admin?status=pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: 'no-store', // No cachear para obtener datos en tiempo real
    });

    if (!response.ok) {
      console.error('Error fetching lens requests:', response.statusText);
      return {
        solicitudesPendientes: 0,
        error: 'Error al obtener solicitudes'
      };
    }

    const requests = await response.json();
    
    // Contar solo las solicitudes pendientes
    const pendingCount = Array.isArray(requests) 
      ? requests.filter(request => request.status === 'pending').length 
      : 0;

    return {
      solicitudesPendientes: pendingCount,
      totalRequests: Array.isArray(requests) ? requests.length : 0,
    };

  } catch (error) {
    console.error('Error in getAdminDashboardStats:', error);
    return {
      solicitudesPendientes: 0,
      error: 'Error de conexión'
    };
  }
}