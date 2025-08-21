import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth-token";

export async function POST() {
  try {
    // Eliminar la cookie de autenticación
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);

    return NextResponse.json(
      {
        success: true,
        message: "Sesión cerrada exitosamente",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en logout:", error);
    return NextResponse.json(
      { error: "Error al cerrar sesión" },
      { status: 500 }
    );
  }
}
