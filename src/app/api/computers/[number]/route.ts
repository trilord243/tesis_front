import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * GET /api/computers/[number]
 * Get a single computer by number
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const { number } = await params;

    const response = await fetch(`${API_BASE_URL}/computers/${number}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching computer:", error);
    return NextResponse.json(
      { error: "Error al obtener la computadora" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/computers/[number]
 * Update a computer (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const { number } = await params;
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/computers/${number}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error updating computer:", error);
    return NextResponse.json(
      { error: "Error al actualizar la computadora" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/computers/[number]
 * Delete a computer (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const { number } = await params;

    const response = await fetch(`${API_BASE_URL}/computers/${number}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error deleting computer:", error);
    return NextResponse.json(
      { error: "Error al eliminar la computadora" },
      { status: 500 }
    );
  }
}
