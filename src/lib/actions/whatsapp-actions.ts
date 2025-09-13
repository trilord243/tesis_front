"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const COOKIE_NAME = "auth-token";

interface ResendResponse {
  success: boolean;
  message: string;
  data?: {
    user: string;
    phone?: string;
    email?: string;
    codigo_acceso: string;
    tipo_codigo: string;
    expira: string | null;
  };
}

export async function resendUserAccessCode(): Promise<ResendResponse> {
  try {
    // Obtener token de las cookies del servidor
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      // Si no hay token, redirigir al login
      redirect('/auth/login');
    }

    // Llamar al endpoint del backend para usuarios
    const response = await fetch(`${API_BASE_URL}/users/resend-access-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Error al reenviar código por WhatsApp',
      };
    }

    return {
      success: true,
      message: data.message || 'Código QR enviado por WhatsApp exitosamente',
      data: data.data,
    };

  } catch (error) {
    console.error('Error in resendUserAccessCode:', error);
    return {
      success: false,
      message: 'Error interno del servidor',
    };
  }
}

export async function resendUserAccessCodeEmail(): Promise<ResendResponse> {
  try {
    // Obtener token de las cookies del servidor
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      // Si no hay token, redirigir al login
      redirect('/auth/login');
    }

    // Llamar al endpoint del backend para usuarios (reenvío por email)
    const response = await fetch(`${API_BASE_URL}/users/resend-access-code-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Error al reenviar código por email',
      };
    }

    return {
      success: true,
      message: data.message || 'Código QR enviado por email exitosamente',
      data: data.data,
    };

  } catch (error) {
    console.error('Error in resendUserAccessCodeEmail:', error);
    return {
      success: false,
      message: 'Error interno del servidor',
    };
  }
}

export async function resendAdminAccessCode(): Promise<ResendResponse> {
  try {
    // Obtener token de las cookies del servidor
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      // Si no hay token, redirigir al login
      redirect('/auth/login');
    }

    // Llamar al endpoint del backend para administradores
    const response = await fetch(`${API_BASE_URL}/admin/resend-access-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Error al reenviar código por WhatsApp',
      };
    }

    return {
      success: true,
      message: data.message || 'Código QR enviado por WhatsApp exitosamente',
      data: data.data,
    };

  } catch (error) {
    console.error('Error in resendAdminAccessCode:', error);
    return {
      success: false,
      message: 'Error interno del servidor',
    };
  }
}