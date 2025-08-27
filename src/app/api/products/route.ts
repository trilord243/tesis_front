import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    // Obtener cookies de autenticación
    const cookies = request.headers.get("cookie") || "";
    
    // Hacer petición al backend
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "GET",
      headers: {
        "Cookie": cookies,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in products API route:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}