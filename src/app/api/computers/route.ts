import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * GET /api/computers
 * Get all computers or filter by user group
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  // Get query parameters
  const { searchParams } = new URL(request.url);
  const userGroup = searchParams.get("userGroup");

  // Build URL with query params if needed
  let url = `${API_BASE_URL}/computers`;
  if (userGroup) {
    url = `${API_BASE_URL}/computers/by-user-group?userGroup=${userGroup}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching computers:", error);
    return NextResponse.json(
      { error: "Error al obtener las computadoras" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/computers
 * Create a new computer (admin only)
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
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/computers`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error creating computer:", error);
    return NextResponse.json(
      { error: "Error al crear la computadora" },
      { status: 500 }
    );
  }
}
