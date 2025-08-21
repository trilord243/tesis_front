"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiError,
} from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "changeme_secret_key"
);
const COOKIE_NAME = "auth-token";

// Configuración de cookies
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60, // 1 hora
  path: "/",
};

export async function login(credentials: LoginCredentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(
        Array.isArray(error.message) ? error.message.join(", ") : error.message
      );
    }

    const data: AuthResponse = await response.json();

    // Guardar token en cookie segura
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, data.access_token, COOKIE_OPTIONS);

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de autenticación",
    };
  }
}

export async function register(userData: RegisterData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        equipos_reservados: userData.equipos_reservados || [],
        expectedTags: userData.expectedTags || [],
        missingTags: userData.missingTags || [],
        presentTags: userData.presentTags || [],
      }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(
        Array.isArray(error.message) ? error.message.join(", ") : error.message
      );
    }

    await response.json();

    // Después del registro exitoso, hacer login automático
    const loginResult = await login({
      email: userData.email,
      password: userData.password,
    });

    return loginResult;
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error en el registro",
    };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/auth/login");
}

export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    return token?.value || null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    // Verificar y decodificar el token JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Obtener datos actualizados del usuario desde la API
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const users: User[] = await response.json();
    const currentUser = users.find((user) => user.email === payload.email);

    return currentUser || null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/auth/login");
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }
}
