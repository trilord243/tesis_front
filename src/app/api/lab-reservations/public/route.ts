import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * GET /api/lab-reservations/public - Obtener reservas aprobadas (público para usuarios autenticados)
 * Este endpoint permite a usuarios normales ver las reservas aprobadas para ver disponibilidad
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Usar el endpoint público de reservas aprobadas
    const url = `${API_BASE_URL}/lab-reservations/approved`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Si falla, devolver array vacío para no romper la UI
      console.error('Error fetching approved reservations:', data);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching public lab reservations:', error);
    return NextResponse.json([], { status: 200 });
  }
}
