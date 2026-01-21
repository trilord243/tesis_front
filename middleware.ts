import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "changeme_secret_key"
);
const COOKIE_NAME = "auth-token";

// Rutas que requieren autenticación
const protectedRoutes = ["/dashboard", "/admin", "/laboratorio"];

// Rutas que solo pueden acceder usuarios no autenticados (excepto la raíz)
const authRoutes = ["/auth/login", "/auth/register"];

// ============================================================================
// SECURITY: Rate Limiting & IP Blocking (in-memory, resets on deploy)
// ============================================================================

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const blockedIPs = new Set<string>([
  "87.121.84.24",  // Attack detected 2026-01-21 15:00 UTC - file write attempts (Bulgaria)
  "195.3.222.78",  // Attack detected 2026-01-21 18:36 UTC - same attack pattern
  "95.214.55.246", // Attack detected 2026-01-21 19:00 UTC - same attack pattern
]);

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_MAX_POST_ROOT = 3; // Very strict for POST to root

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP.trim();
  }
  return request.headers.get("cf-connecting-ip") ?? "unknown";
}

function checkRateLimit(ip: string, key: string, max: number): boolean {
  const now = Date.now();
  const storeKey = `${ip}:${key}`;
  const record = rateLimitStore.get(storeKey);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(storeKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  record.count++;
  return record.count <= max;
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);

  // -------------------------------------------------------------------------
  // SECURITY CHECK 1: Blocked IPs
  // -------------------------------------------------------------------------
  if (blockedIPs.has(ip)) {
    console.log(`[Security] ========== BLOCKED IP ATTEMPT ==========`);
    console.log(`[Security] IP: ${ip}`);
    console.log(`[Security] Path: ${pathname}`);
    console.log(`[Security] Method: ${request.method}`);
    console.log(`[Security] Time: ${new Date().toISOString()}`);
    console.log(`[Security] ===========================================`);
    return new NextResponse("Forbidden", { status: 403 });
  }

  // -------------------------------------------------------------------------
  // SECURITY CHECK 2: POST to suspicious paths is almost always an attack
  // -------------------------------------------------------------------------
  const suspiciousPaths = ["/", "/_next"];
  const isSuspiciousPath = suspiciousPaths.some(p => pathname === p || pathname.startsWith("/_next"));

  if (request.method === "POST" && isSuspiciousPath) {
    console.log(`[Security] ========== SUSPICIOUS POST DETECTED ==========`);
    console.log(`[Security] IP: ${ip}`);
    console.log(`[Security] Path: ${pathname}`);
    console.log(`[Security] Time: ${new Date().toISOString()}`);
    console.log(`[Security] Headers: ${JSON.stringify(Object.fromEntries(request.headers))}`);

    // Try to log the body (clone request to read body)
    try {
      const clonedRequest = request.clone();
      const body = await clonedRequest.text();
      if (body) {
        console.log(`[Security] Body (first 1000 chars): ${body.substring(0, 1000)}`);
      } else {
        console.log(`[Security] Body: (empty)`);
      }
    } catch (e) {
      console.log(`[Security] Could not read body: ${e}`);
    }

    console.log(`[Security] ================================================`);

    if (!checkRateLimit(ip, "post-suspicious", RATE_LIMIT_MAX_POST_ROOT)) {
      // Too many suspicious POSTs = block the IP
      blockedIPs.add(ip);
      console.log(`[Security] IP auto-blocked after repeated suspicious POST: ${ip}`);
      return new NextResponse("Forbidden", { status: 403 });
    }

    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  // -------------------------------------------------------------------------
  // SECURITY CHECK 3: Global rate limiting
  // -------------------------------------------------------------------------
  if (!checkRateLimit(ip, "global", RATE_LIMIT_MAX_REQUESTS)) {
    console.log(`[Security] Rate limit exceeded: ${ip}`);
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  // -------------------------------------------------------------------------
  // AUTHENTICATION LOGIC
  // -------------------------------------------------------------------------
  console.log(`[Middleware] Processing: ${pathname}`);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isAuthenticated = false;
  let role: string | undefined;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
      role = (payload as { role?: string })?.role;
      console.log(`[Middleware] Token valid, role: ${role}`);
    } catch (error) {
      isAuthenticated = false;
      console.log(`[Middleware] Token invalid:`, error);
    }
  }

  // Si es una ruta protegida y no está autenticado
  if (isProtectedRoute && !isAuthenticated) {
    console.log(`[Middleware] Redirecting to login`);
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Enrutamiento por rol cuando está autenticado
  if (isAuthenticated) {
    // Admin y superadmin no deben usar rutas de usuario normal
    if (pathname.startsWith("/dashboard") && (role === "admin" || role === "superadmin")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // Usuarios no admin/superadmin no deben acceder a rutas de admin
    if (pathname.startsWith("/admin") && role !== "admin" && role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Si es una ruta de auth y ya está autenticado, redirigir adecuadamente
  if (isAuthRoute && isAuthenticated) {
    const redirectTo = (role === "admin" || role === "superadmin") ? "/admin/dashboard" : "/dashboard";
    console.log(`[Middleware] Already authenticated, redirecting to ${redirectTo}`);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  console.log(`[Middleware] Allowing request to continue`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
