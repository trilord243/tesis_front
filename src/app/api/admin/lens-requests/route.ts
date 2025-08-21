import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getCurrentUser } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// GET - Obtener todas las solicitudes (solo administradores)
export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que el usuario es administrador
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de administrador" },
        { status: 403 }
      );
    }

    // Obtener parámetros de consulta para filtros
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    
    // Construir URL con filtros
    const queryParams = new URLSearchParams();
    if (status && status !== "all") {
      queryParams.append("status", status);
    }
    if (userId) {
      queryParams.append("userId", userId);
    }
    
    const queryString = queryParams.toString();
    const apiUrl = `${API_BASE_URL}/lens-requests/admin${queryString ? `?${queryString}` : ""}`;

    // Obtener todas las solicitudes desde el backend
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Si no hay solicitudes, devolver un array vacío
        return NextResponse.json([]);
      }
      throw new Error("Error al obtener solicitudes");
    }

    const requests = await response.json();
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error en GET /api/admin/lens-requests:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar estado de una solicitud (aprobar/rechazar)
export async function PATCH(request: NextRequest) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que el usuario es administrador
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de administrador" },
        { status: 403 }
      );
    }

    // Obtener datos del cuerpo de la petición
    const { requestId, status, accessCode, rejectionReason, expiration } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: "ID de solicitud y estado son requeridos" },
        { status: 400 }
      );
    }

    // Validar estado
    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Estado inválido. Debe ser 'approved' o 'rejected'" },
        { status: 400 }
      );
    }

    // Preparar datos según el tipo de acción
    const updateData: Record<string, unknown> = { status };

    if (status === "approved") {
      // Para aprobaciones
      if (accessCode) {
        updateData.accessCode = accessCode;
      }
      if (expiration) {
        updateData.expiration = expiration;
      } else {
        // Valores por defecto para expiración
        updateData.expiration = {
          days: 30,
          weeks: 0,
          months: 0,
        };
      }
    } else if (status === "rejected") {
      // Para rechazos
      updateData.rejectionReason = rejectionReason || "Sin razón especificada";
    }

    // Enviar actualización al backend
    const response = await fetch(`${API_BASE_URL}/lens-requests/${requestId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al actualizar la solicitud");
    }

    const updatedRequest = await response.json();

    return NextResponse.json({
      message: `Solicitud ${
        status === "approved" ? "aprobada" : "rechazada"
      } exitosamente`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error en PATCH /api/admin/lens-requests:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una solicitud (solo administradores)
export async function DELETE(request: NextRequest) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que el usuario es administrador
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de administrador" },
        { status: 403 }
      );
    }

    // Obtener ID desde los parámetros de consulta
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("id");

    if (!requestId) {
      return NextResponse.json(
        { error: "ID de solicitud es requerido" },
        { status: 400 }
      );
    }

    // Enviar eliminación al backend
    const response = await fetch(`${API_BASE_URL}/lens-requests/${requestId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al eliminar la solicitud");
    }

    const result = await response.json();

    return NextResponse.json({
      message: result.message || "Solicitud eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error en DELETE /api/admin/lens-requests:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
