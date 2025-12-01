import { NextResponse } from "next/server";
import { getAuthToken, getCurrentUser } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function POST() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que el usuario es administrador o superadmin
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de administrador" },
        { status: 403 }
      );
    }

    // Generar nuevo código de acceso
    const response = await fetch(`${API_BASE_URL}/admin/generate-access-code`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Error al generar código de acceso" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "Código de acceso generado exitosamente",
      data: data.data,
    });

  } catch (error) {
    console.error("Error en POST /api/admin/generate-access-code:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}