import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "changeme_secret_key"
);
const COOKIE_NAME = "auth-token";

// Rutas que requieren autenticación
const protectedRoutes = ["/dashboard", "/admin"];

// Rutas que solo pueden acceder usuarios no autenticados (excepto la raíz)
const authRoutes = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] Processing: ${pathname}`);

  // Verificar si la ruta requiere autenticación
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Verificar si es una ruta de autenticación
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Obtener token de las cookies
  const token = request.cookies.get(COOKIE_NAME)?.value;

  console.log(`[Middleware] Token exists: ${!!token}`);

  let isAuthenticated = false;
  let role: string | undefined;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
      // Leer rol desde el payload si está presente
      role = (payload as any)?.role as string | undefined;
      console.log(`[Middleware] Token is valid`);
    } catch (error) {
      // Token inválido o expirado
      isAuthenticated = false;
      console.log(`[Middleware] Token is invalid:`, error);
    }
  }

  console.log(`[Middleware] Is authenticated: ${isAuthenticated}`);
  console.log(`[Middleware] Is protected route: ${isProtectedRoute}`);
  console.log(`[Middleware] Is auth route: ${isAuthRoute}`);

  // Si es una ruta protegida y no está autenticado
  if (isProtectedRoute && !isAuthenticated) {
    console.log(`[Middleware] Redirecting to login`);
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Enrutamiento por rol cuando está autenticado
  if (isAuthenticated) {
    // Admin no debe usar rutas de usuario
    if (pathname.startsWith("/dashboard") && role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // Usuarios no admin no deben acceder a rutas de admin
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Si es una ruta de auth y ya está autenticado, redirigir adecuadamente
  if (isAuthRoute && isAuthenticated) {
    const redirectTo = role === "admin" ? "/admin/dashboard" : "/dashboard";
    console.log(`[Middleware] Already authenticated, redirecting to ${redirectTo}`);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  console.log(`[Middleware] Allowing request to continue`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Hacer match con todas las rutas excepto:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
