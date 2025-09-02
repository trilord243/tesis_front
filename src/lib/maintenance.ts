"use server";

import { getAuthToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface MaintenanceData {
  type: string; // Puede ser cualquier string, no solo "preventive", "corrective", etc.
  description: string;
  expectedReturn: string;
  technician?: string;
  cost?: number;
  notes?: string;
}

interface CompleteMaintenanceData {
  actualReturn: string; // Obligatorio
  finalCost?: number;
  completionNotes?: string;
  newLocation?: string;
}

// Enviar a mantenimiento
export async function sendToMaintenance(productId: string, maintenanceData: MaintenanceData) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "No tienes autorización para realizar esta acción",
      };
    }

    const response = await fetch(`${API_BASE_URL}/products/${productId}/maintenance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(maintenanceData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        Array.isArray(error.message) ? error.message.join(", ") : error.message
      );
    }

    const result = await response.json();
    return { success: true, product: result };
  } catch (error) {
    console.error("Send to maintenance error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al enviar a mantenimiento",
    };
  }
}

// Completar/Quitar de mantenimiento
export async function completeMaintenance(productId: string, completeData: CompleteMaintenanceData) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "No tienes autorización para realizar esta acción",
      };
    }

    // Si no se especifica ubicación, usar la predeterminada
    const dataToSend = {
      ...completeData,
    };

    const response = await fetch(`${API_BASE_URL}/products/${productId}/maintenance/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        Array.isArray(error.message) ? error.message.join(", ") : error.message
      );
    }

    const result = await response.json();
    return { success: true, product: result };
  } catch (error) {
    console.error("Complete maintenance error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al completar mantenimiento",
    };
  }
}

// Cambiar ubicación (no es mantenimiento)
export async function updateProductLocation(productId: string, newLocation: string, notes?: string) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "No tienes autorización para realizar esta acción",
      };
    }

    // Usar el endpoint de PATCH para actualizar solo la ubicación
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ubicacionFisica: newLocation,
        // Podríamos agregar un campo de notas si el backend lo soporta
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        Array.isArray(error.message) ? error.message.join(", ") : error.message
      );
    }

    const result = await response.json();
    return { success: true, product: result };
  } catch (error) {
    console.error("Update location error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar ubicación",
    };
  }
}