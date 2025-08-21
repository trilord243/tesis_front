import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const COOKIE_NAME = "auth-token";

// Configuración de cookies
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60, // 1 hora
  path: "/",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, lastName, email, cedula, password } = body;

    // Validaciones básicas
    if (!name || !lastName || !email || !cedula || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Crear usuario en el backend
    const registerResponse = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        lastName,
        email,
        cedula,
        password,
      }),
    });

    const registerData = await registerResponse.json();

    if (!registerResponse.ok) {
      // Handle different error types from backend
      let errorMessage = "Error en el registro";
      
      if (registerData.message) {
        // If it's a string message
        if (typeof registerData.message === 'string') {
          errorMessage = registerData.message;
        } 
        // If it's an array of validation errors
        else if (Array.isArray(registerData.message)) {
          errorMessage = registerData.message.join(', ');
        }
      } else if (registerData.error) {
        errorMessage = registerData.error;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: registerResponse.status }
      );
    }

    // Hacer login automático después del registro
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      return NextResponse.json(
        {
          error:
            "Usuario creado pero error al iniciar sesión. Por favor, inicia sesión manualmente.",
        },
        { status: 200 }
      );
    }

    // Guardar token en cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, loginData.access_token, COOKIE_OPTIONS);

    return NextResponse.json(
      {
        success: true,
        message: "Registro exitoso",
        user: registerData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
