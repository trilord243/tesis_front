import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * GET /api/lab-reservations/my-reservations - Obtener mis reservas
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

    const response = await fetch(`${API_BASE_URL}/lab-reservations/my-reservations`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching my lab reservations:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener tus reservas' },
      { status: 500 }
    );
  }
}
