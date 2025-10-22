# Fix 401 Authentication Errors in Analytics - Summary

## 🔴 Problema Identificado

**Error**: `Error al cargar solicitudes: 401` en:
1. Vista Rápida: Préstamos
2. Tab de Préstamos
3. Historial de productos

**Causa Raíz**: Los componentes estaban llamando **directamente al backend** en lugar de usar las **rutas proxy de Next.js**.

### ¿Por qué esto causaba 401?

```typescript
// ❌ ANTES (Incorrecto) - Llamada directa al backend
fetch(`http://localhost:3000/lens-requests/admin`, {
  credentials: "include",
  headers: { "Content-Type": "application/json" }
})
```

**Problemas**:
1. ❌ Las cookies httpOnly **no se envían** en llamadas cross-origin desde el cliente
2. ❌ El token JWT está en una cookie httpOnly que el navegador protege
3. ❌ CORS puede bloquear las cookies incluso con `credentials: "include"`
4. ❌ El backend no recibe el token → responde 401 Unauthorized

---

## ✅ Solución Aplicada

### Patrón Correcto: API Routes Proxy

```typescript
// ✅ AHORA (Correcto) - A través del proxy de Next.js
fetch("/api/admin/lens-requests", {
  credentials: "include",
  headers: { "Content-Type": "application/json" }
})
```

**Ventajas**:
1. ✅ Next.js maneja las cookies automáticamente (server-side)
2. ✅ El proxy extrae el token de las cookies httpOnly
3. ✅ Agrega el header `Authorization: Bearer {token}` al backend
4. ✅ Sin problemas de CORS (misma origin)
5. ✅ Verificación de rol admin en el servidor

---

## 📂 Archivos Modificados

### 1. Componentes Cliente

#### `src/components/admin/simple-loan-frequency-analytics.tsx`
```typescript
// ANTES
fetch(`${process.env.NEXT_PUBLIC_API_URL}/lens-requests/admin`, ...)

// AHORA
fetch("/api/admin/lens-requests", ...)
```

#### `src/components/admin/cabinet-analytics.tsx`
```typescript
// ANTES
const status = await UsageAnalyticsService.getCabinetStatus();

// AHORA
const response = await fetch("/api/analytics/cabinet-status", {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
});
const status = await response.json();
```

### 2. Servicio de Analytics

#### `src/lib/api/usage-analytics.ts`
```typescript
// ANTES
async getProductUsageStats(productId: string) {
  return fetchWithAuth(`${API_BASE_URL}/products/${productId}/usage-statistics`);
}

// AHORA
async getProductUsageStats(productId: string) {
  return fetchWithAuth(`/api/products/${productId}/usage-statistics`);
}

// ANTES
async getCabinetStatus() {
  return fetchWithAuth(`${API_BASE_URL}/api/analytics/cabinet-status`);
}

// AHORA
async getCabinetStatus() {
  return fetchWithAuth("/api/analytics/cabinet-status");
}
```

---

## 📝 Rutas API Proxy Creadas

### 1. `/api/analytics/cabinet-status/route.ts` (NUEVO)

```typescript
export async function GET(request: NextRequest) {
  const token = await getAuthToken();
  if (!token) return 401;

  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return 403;

  const response = await fetch(`${BACKEND}/api/analytics/cabinet-status`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return NextResponse.json(await response.json());
}
```

**Flujo**:
1. Cliente → `/api/analytics/cabinet-status`
2. Proxy extrae token de cookie httpOnly
3. Proxy → Backend con `Authorization: Bearer {token}`
4. Backend verifica token y devuelve datos
5. Proxy → Cliente con datos

---

### 2. `/api/products/[id]/usage-statistics/route.ts` (NUEVO)

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getAuthToken();
  if (!token) return 401;

  const response = await fetch(
    `${BACKEND}/products/${params.id}/usage-statistics`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return NextResponse.json(await response.json());
}
```

**Uso**: Historial de uso por producto

---

### 3. `/api/admin/lens-requests/route.ts` (YA EXISTÍA)

```typescript
export async function GET(request: NextRequest) {
  const token = await getAuthToken();
  if (!token) return 401;

  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return 403;

  const response = await fetch(`${BACKEND}/lens-requests/admin`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return NextResponse.json(await response.json());
}
```

**Uso**: Analytics de préstamos

---

## 🔐 Flujo de Autenticación

### Antes (❌ Fallaba con 401)

```
Cliente (Browser)
    |
    | fetch(http://localhost:3000/lens-requests/admin)
    | credentials: "include" ❌ (cookie bloqueada por CORS)
    v
Backend (NestJS)
    |
    | ❌ No recibe Authorization header
    | ❌ JwtAuthGuard rechaza: 401 Unauthorized
```

### Ahora (✅ Funciona)

```
Cliente (Browser)
    |
    | fetch(/api/admin/lens-requests)
    | credentials: "include" ✅ (same-origin)
    v
Next.js API Route (Server-side)
    |
    | await getAuthToken() → extrae de cookie httpOnly
    | await getCurrentUser() → verifica rol admin
    | fetch(backend) + Authorization: Bearer {token}
    v
Backend (NestJS)
    |
    | ✅ Recibe Authorization header
    | ✅ JwtAuthGuard valida token
    | ✅ Devuelve datos
    v
Next.js API Route
    |
    | return NextResponse.json(data)
    v
Cliente (Browser)
    |
    | ✅ Datos recibidos correctamente
```

---

## 🧪 Cómo Probar

### 1. Reiniciar el servidor de desarrollo

```bash
cd ~/Documents/personal/tesis/tesis_front
PORT=3001 npm run dev
```

### 2. Login como admin

```
http://localhost:3001/auth/login
```

### 3. Ir a analytics

```
http://localhost:3001/admin/analytics
```

### 4. Verificar en la consola del navegador (F12)

**Tab Network** - Deberías ver:
```
✅ GET /api/admin/lens-requests → 200 OK
✅ GET /api/analytics/cabinet-status → 200 OK
✅ GET /api/products/{id}/usage-statistics → 200 OK
```

**Tab Console** - NO deberías ver:
```
❌ Error al cargar solicitudes: 401
❌ Error fetching cabinet status: 401
```

---

## 🎯 Resultados Esperados

Después de aplicar estos cambios:

### Vista Rápida: Préstamos
- ✅ Carga estadísticas de solicitudes
- ✅ Muestra total, aprobadas, rechazadas, pendientes
- ✅ Muestra productos más solicitados

### Tab Préstamos
- ✅ Carga estadísticas completas
- ✅ Muestra tasas de aprobación
- ✅ Muestra solicitudes recientes

### Tab Gabinete
- ✅ Muestra productos en gabinete
- ✅ Muestra productos fuera
- ✅ Muestra tasa de ocupación

### Historial de Productos
- ✅ Muestra logs de uso por producto
- ✅ Muestra usuarios que han usado el producto
- ✅ Muestra duración de uso

---

## 📊 Comparación de Rutas

### Rutas Directas al Backend (❌ NO USAR desde cliente)

```typescript
// ❌ Causan 401 por problemas con cookies httpOnly
http://localhost:3000/lens-requests/admin
http://localhost:3000/api/analytics/cabinet-status
http://localhost:3000/products/:id/usage-statistics
```

### Rutas Proxy de Next.js (✅ USAR desde cliente)

```typescript
// ✅ Manejan autenticación correctamente
/api/admin/lens-requests
/api/analytics/cabinet-status
/api/products/:id/usage-statistics
```

---

## 🔑 Puntos Clave

1. **httpOnly Cookies**: No son accesibles desde JavaScript del navegador
2. **Same-Origin**: Las rutas `/api/*` son same-origin, no tienen problemas de CORS
3. **Server-Side**: Next.js API routes corren en el servidor, pueden acceder a cookies
4. **Proxy Pattern**: Proxy routes extraen el token y lo agregan al header Authorization
5. **Seguridad**: El token nunca se expone al cliente, solo viaja server-to-server

---

## ⚠️ Errores Comunes

### Error: "No autorizado" (401)
**Causa**: No estás autenticado o tu sesión expiró
**Solución**: Re-login en `/auth/login`

### Error: "Acceso denegado" (403)
**Causa**: No eres admin
**Solución**: Login con cuenta de administrador

### Error: "Failed to fetch"
**Causa**: Backend no está corriendo
**Solución**: `cd backend && npm run start:dev`

---

## 📚 Referencias

- **getAuthToken()**: `src/lib/auth.ts` - Extrae token de cookies
- **getCurrentUser()**: `src/lib/auth.ts` - Decodifica token y obtiene usuario
- **JwtAuthGuard**: Backend `src/auth/guards/jwt-auth.guard.ts` - Valida tokens
- **RolesGuard**: Backend `src/auth/guards/roles.guard.ts` - Verifica roles

---

**Fecha**: 2025-10-22
**Estado**: ✅ Corregido
**Cambios**: 4 archivos modificados + 2 archivos nuevos
