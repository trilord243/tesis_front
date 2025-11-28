import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * GET /api/metaverse-reservations/approved - Obtener reservas aprobadas (público)
 */
export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/metaverse-reservations/approved`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error fetching approved metaverse reservations:', data);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching approved metaverse reservations:', error);
    return NextResponse.json([], { status: 200 });
  }
}
