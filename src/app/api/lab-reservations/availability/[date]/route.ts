import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface RouteParams {
  params: Promise<{
    date: string;
  }>;
}

/**
 * GET /api/lab-reservations/availability/[date] - Obtener disponibilidad para una fecha
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { date } = await params;
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/lab-reservations/availability/${date}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener disponibilidad' },
      { status: 500 }
    );
  }
}
