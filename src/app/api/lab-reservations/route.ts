import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * POST /api/lab-reservations - Crear nueva reserva de laboratorio
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/lab-reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating lab reservation:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear la reserva' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/lab-reservations - Obtener todas las reservas (solo admin)
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

    // Obtener query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    // Construir query string
    const queryParams = new URLSearchParams();
    if (status) queryParams.set('status', status);
    if (userId) queryParams.set('userId', userId);
    if (date) queryParams.set('date', date);

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/lab-reservations${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching lab reservations:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener las reservas' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/lab-reservations - Actualizar estado de reserva
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { reservationId, ...updateData } = body;

    if (!reservationId) {
      return NextResponse.json(
        { success: false, error: 'ID de reserva requerido' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/lab-reservations/${reservationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating lab reservation:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la reserva' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lab-reservations - Eliminar reserva
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get('id');
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    if (!reservationId) {
      return NextResponse.json(
        { success: false, error: 'ID de reserva requerido' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/lab-reservations/${reservationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error deleting lab reservation:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar la reserva' },
      { status: 500 }
    );
  }
}
