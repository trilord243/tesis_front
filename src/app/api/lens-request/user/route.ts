import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    // Obtener token de autenticación de las cookies
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log('Obteniendo solicitudes del usuario...');

    // Hacer petición al backend NestJS para obtener las solicitudes del usuario
    const response = await fetch(`${API_BASE_URL}/lens-requests/my-requests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    console.log('Solicitudes del backend:', responseData);

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || "Error al obtener solicitudes" },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error en GET /api/lens-request/user:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}