import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * GET /api/system-logs - Obtener logs del sistema (solo superadmin)
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Construir URL con parámetros de filtro
    const params = new URLSearchParams();
    const actionType = searchParams.get("actionType");
    const targetType = searchParams.get("targetType");
    const userId = searchParams.get("userId");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    if (actionType) params.append("actionType", actionType);
    if (targetType) params.append("targetType", targetType);
    if (userId) params.append("userId", userId);
    if (search) params.append("search", search);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/system-logs${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || "Error al obtener logs" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching system logs:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
