import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    // Obtener token de autenticación de las cookies
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener datos del cuerpo de la petición
    const body = await request.json();
    const { requestReason, willLeaveMetaverse, leaveReason, zoneName, plannedDate } = body;

    // Validar campos requeridos
    if (!requestReason || !requestReason.trim()) {
      return NextResponse.json(
        { error: "La razón de la solicitud es requerida" },
        { status: 400 }
      );
    }

    // Validar campos de zona si es necesario
    if (willLeaveMetaverse) {
      if (!leaveReason || !leaveReason.trim()) {
        return NextResponse.json(
          { error: "Debe proporcionar una razón para sacar los lentes del laboratorio" },
          { status: 400 }
        );
      }
      if (!zoneName || !zoneName.trim()) {
        return NextResponse.json(
          { error: "Debe especificar una zona cuando sale del laboratorio" },
          { status: 400 }
        );
      }
      if (!plannedDate) {
        return NextResponse.json(
          { error: "Debe especificar la fecha planificada" },
          { status: 400 }
        );
      }
    }

    // Preparar datos para el backend
    const lensRequestData = {
      requestReason: requestReason.trim(),
      willLeaveMetaverse: Boolean(willLeaveMetaverse),
      leaveReason: willLeaveMetaverse ? leaveReason.trim() : undefined,
      zoneName: willLeaveMetaverse ? zoneName.trim() : undefined,
      plannedDate: willLeaveMetaverse ? plannedDate : undefined,
    };

    console.log('Enviando al backend:', lensRequestData);

    // Enviar solicitud al backend NestJS
    const response = await fetch(`${API_BASE_URL}/lens-requests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lensRequestData),
    });

    const responseData = await response.json();
    console.log('Respuesta del backend:', responseData);

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || "Error al crear la solicitud" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "Solicitud enviada exitosamente",
      request: responseData,
    });
  } catch (error) {
    console.error("Error en POST /api/lens-request:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}