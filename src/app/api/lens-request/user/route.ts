import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function GET() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener solicitudes del usuario desde el backend
    const response = await fetch(`${API_BASE_URL}/lens-requests/my-requests`, {
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
    console.error("Error en GET /api/lens-request/user:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
