import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * GET /api/lab-config/public
 * Obtener configuraciones públicas agrupadas (para formulario de reservas)
 */
export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/lab-config/public`, {
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching public lab configs:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
