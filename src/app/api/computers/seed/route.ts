import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * POST /api/computers/seed
 * Initialize/seed the 9 computers in the database
 * Development/admin only
 */
export async function POST(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/computers/seed`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error seeding computers:", error);
    return NextResponse.json(
      { error: "Error al inicializar las computadoras" },
      { status: 500 }
    );
  }
}
