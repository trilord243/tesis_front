import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
import { jwtVerify } from "jose";
import { User } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "changeme_secret_key"
);

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar y decodificar el token para obtener el email del usuario
    let userEmail: string;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userEmail = payload.email as string;
    } catch {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    // Obtener datos del usuario desde el backend
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Token inválido o expirado" },
          { status: 401 }
        );
      }
      throw new Error("Error al obtener datos del usuario");
    }

    const users = await response.json();

    // Buscar el usuario actual por email
    const currentUser = users.find((user: User) => user.email === userEmail);

    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(currentUser);
  } catch (error) {
    console.error("Error en GET /api/auth/user:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
