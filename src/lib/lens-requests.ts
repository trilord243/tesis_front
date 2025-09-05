"use server";

import { getAuthToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface LensRequest {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestReason: string;
  willLeaveMetaverse: boolean;
  leaveReason?: string;
  zoneName?: string;
  plannedDate?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  processedBy?: string;
  accessCode?: string;
  expiresAt?: string;
  rejectionReason?: string;
}

export interface AdminLensRequestsResponse {
  success: boolean;
  data?: LensRequest[];
  error?: string;
}

export interface UpdateLensRequestData {
  status: "approved" | "rejected";
  accessCode?: string;
  rejectionReason?: string;
  expiration?: {
    days?: number;
    weeks?: number;
    months?: number;
  };
}

export interface UpdateLensRequestResponse {
  success: boolean;
  message?: string;
  data?: LensRequest;
  error?: string;
}

export async function getAllLensRequests(): Promise<AdminLensRequestsResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Token de autenticación no encontrado" };
    }

    const response = await fetch(`${API_BASE_URL}/lens-requests/admin`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
      return { 
        success: false, 
        error: errorData.message || `Error ${response.status}: ${response.statusText}` 
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching lens requests:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al obtener solicitudes" 
    };
  }
}

export async function getLensRequestById(id: string): Promise<AdminLensRequestsResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Token de autenticación no encontrado" };
    }

    const response = await fetch(`${API_BASE_URL}/lens-requests/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
      return { 
        success: false, 
        error: errorData.message || `Error ${response.status}: ${response.statusText}` 
      };
    }

    const data = await response.json();
    return { success: true, data: [data] };
  } catch (error) {
    console.error("Error fetching lens request:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al obtener solicitud" 
    };
  }
}

export async function updateLensRequest(
  id: string, 
  updateData: UpdateLensRequestData
): Promise<UpdateLensRequestResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Token de autenticación no encontrado" };
    }

    const response = await fetch(`${API_BASE_URL}/lens-requests/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
      return { 
        success: false, 
        error: errorData.message || `Error ${response.status}: ${response.statusText}` 
      };
    }

    const data = await response.json();
    return { 
      success: true, 
      message: `Solicitud ${updateData.status === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`,
      data 
    };
  } catch (error) {
    console.error("Error updating lens request:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al actualizar solicitud" 
    };
  }
}

export async function deleteLensRequest(id: string): Promise<UpdateLensRequestResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Token de autenticación no encontrado" };
    }

    const response = await fetch(`${API_BASE_URL}/lens-requests/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
      return { 
        success: false, 
        error: errorData.message || `Error ${response.status}: ${response.statusText}` 
      };
    }

    const data = await response.json();
    return { 
      success: true, 
      message: data.message || "Solicitud eliminada exitosamente"
    };
  } catch (error) {
    console.error("Error deleting lens request:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al eliminar solicitud" 
    };
  }
}

export async function filterLensRequests(
  status?: string, 
  userId?: string
): Promise<AdminLensRequestsResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Token de autenticación no encontrado" };
    }

    const searchParams = new URLSearchParams();
    if (status && status !== 'all') {
      searchParams.append('status', status);
    }
    if (userId) {
      searchParams.append('userId', userId);
    }

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/lens-requests/admin${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
      return { 
        success: false, 
        error: errorData.message || `Error ${response.status}: ${response.statusText}` 
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error filtering lens requests:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al filtrar solicitudes" 
    };
  }
}