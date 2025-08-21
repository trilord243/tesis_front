import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getCurrentUser } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener usuario actual
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Obtener datos del cuerpo de la petición
    const { requestReason } = await request.json();

    if (!requestReason || !requestReason.trim()) {
      return NextResponse.json(
        { error: "La razón de la solicitud es requerida" },
        { status: 400 }
      );
    }

    // Preparar datos para el backend (solo requestReason, el backend toma el resto del JWT)
    const lensRequestData = {
      requestReason: requestReason.trim(),
    };

    // Enviar solicitud al backend
    const response = await fetch(`${API_BASE_URL}/lens-requests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lensRequestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al crear la solicitud");
    }

    const createdRequest = await response.json();

    return NextResponse.json({
      message: "Solicitud enviada exitosamente",
      request: createdRequest,
    });
  } catch (error) {
    console.error("Error en POST /api/lens-request:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
