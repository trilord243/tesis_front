# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CentroMundoX Frontend** - Next.js 15 application for VR/AR equipment reservation management at Centro Mundo X research facility. Features RFID tracking, admin dashboards, lab reservations, product history audit trails, and analytics.

Connects to NestJS backend at `../centromundox-api-reservas` (port 3000).

## Development Commands

```bash
# Development (use PORT=3001 to avoid conflict with backend on 3000)
npm run dev                  # Start with Turbopack
PORT=3001 npm run dev        # Linux/macOS
set PORT=3001 && npm run dev # Windows

# Production
npm run build               # Build for production
npm start                   # Run production server

# Linting - ALWAYS run after changes
npm run lint

# Add Shadcn UI component
npm run ui:add [component]
```

**Requirements**: Node.js 22.x, npm 10.x

## Environment Setup

```bash
# .env.local (create for local development)
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-secret  # Must match backend
```

## Architecture

### Tech Stack
- **Next.js 15.4.4** with App Router, React 19.1.0, TypeScript 5 (strict)
- **Tailwind CSS v4** with Shadcn UI (Radix primitives)
- **Jose** for JWT middleware, **nuqs** for URL state
- **react-big-calendar** for lab reservations, **driver.js** for onboarding tours

### Core Pattern: API Proxy

**NEVER call backend directly from client components.** All requests go through:

1. **API Routes** (`src/app/api/*`) - Proxy to backend with auth headers
2. **Server Actions** (`src/lib/actions/*`) - Form handling with cookies

```typescript
// API Route pattern (src/app/api/example/route.ts)
export async function POST(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const response = await fetch(`${API_BASE_URL}/endpoint`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return NextResponse.json(await response.json());
}
```

### Authentication Flow
- JWT stored in httpOnly cookie (`auth-token`, 1 hour expiry)
- `middleware.ts` (root level) validates JWT with jose, handles role-based routing
- Roles: `user` → `/dashboard/*`, `admin`/`superadmin` → `/admin/*`

### Next.js 15 Async APIs
Always await runtime APIs:
```typescript
const cookieStore = await cookies();
const headersList = await headers();
const params = await props.params;
const searchParams = await props.searchParams;
```

## TypeScript Configuration

Strict mode with extra checks enabled:
- `noUncheckedIndexedAccess` - array/object access may be undefined
- `exactOptionalPropertyTypes` - undefined must be explicit
- `noImplicitReturns` - all code paths must return
- `noFallthroughCasesInSwitch` - switch cases must break/return

### Path Aliases
```typescript
import { Button } from "@/components/ui/button";  // @/* → ./src/*
import { User } from "@/types";                    // @/types/*
import { cn } from "@/lib/utils";                  // @/lib/*
```

### Type Safety Patterns
```typescript
// Use satisfies for type validation without widening
const config = { key: 'value' } satisfies ConfigType;

// Prefer interfaces over types for object shapes
interface User { id: string; name: string; }

// Use const maps instead of enums
const STATUS = { PENDING: 'pending', APPROVED: 'approved' } as const;
```

## Code Style

### React & TypeScript
- **Server Components by default** - minimize `'use client'`
- Use `useActionState` (not deprecated `useFormState`)
- Prefer interfaces over types, const maps over enums
- Descriptive names: `isLoading`, `hasError`, `handleSubmit`

### Component Structure
```
exports → subcomponents → helpers → types
```

### Directory Convention
Lowercase with dashes: `components/auth-wizard`

## Key Directories

- `src/app/api/*` - API route proxies (auth, products, lab-reservations, lab-config, computers, zones, users, analytics)
- `src/app/admin/*` - Admin pages (activos, analytics, solicitudes, usuarios, config-laboratorio)
- `src/app/dashboard/*` - User pages (reservas, perfil, qr, reservar-lab, mis-reservas-lab)
- `src/lib/actions/*` - Server actions by feature
- `src/lib/api/*` - API client services
- `src/components/admin/*` - Admin components (30+ specialized)
- `src/components/lab-reservations/*` - Lab booking components
- `src/components/ui/*` - Shadcn UI components
- `src/types/*` - TypeScript interfaces (auth, product, lab-reservation, lab-config, usage-analytics)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port conflict | Use `PORT=3001 npm run dev` (Linux/macOS) or `set PORT=3001 && npm run dev` (Windows) |
| CORS errors | Check backend `FRONTEND_URL` env var |
| Auth issues | Clear cookies, verify JWT_SECRET matches backend |
| Type errors with array access | Use optional chaining: `arr[0]?.prop` (noUncheckedIndexedAccess) |

## Brand Colors

- Primary Blue: `#1859A9`
- Primary Orange: `#FF8200`
- Secondary Blue: `#003087`
- Secondary Orange: `#F68629`

---

## Metaverse Laboratory Reservation System

Sistema completo para reservar el laboratorio de metaverso. Implementado en Noviembre 2025.

### System Overview

| Ruta | Acceso | Propósito |
|------|--------|-----------|
| `/laboratorio` | Usuarios autenticados | Crear reservas del laboratorio |
| `/calendar` | Público (sin login) | Ver eventos aprobados (solo lectura) |
| `/admin/reservas-metaverso` | Solo admins | Aprobar/rechazar reservas |

### Key Business Rules

1. **Múltiples eventos por día**: Se permiten varios eventos el mismo día siempre que NO usen el mismo bloque horario
2. **Auto-aprobación para admins**: Si un admin crea una reserva, se aprueba automáticamente
3. **Usuarios requieren aprobación**: Las reservas de usuarios quedan en estado `pending`
4. **Bloques se bloquean al aprobar**: Solo las reservas APPROVED ocupan bloques

### Time Blocks (6 bloques de 1h 45min)

```typescript
const METAVERSE_TIME_BLOCKS = [
  { value: "block_1", label: "Bloque 1", startTime: "07:00", endTime: "08:45" },
  { value: "block_2", label: "Bloque 2", startTime: "08:45", endTime: "10:30" },
  { value: "block_3", label: "Bloque 3", startTime: "10:30", endTime: "12:15" },
  { value: "block_4", label: "Bloque 4", startTime: "12:15", endTime: "14:00" },
  { value: "block_5", label: "Bloque 5", startTime: "14:00", endTime: "15:45" },
  { value: "block_6", label: "Bloque 6", startTime: "15:45", endTime: "17:30" },
];
```

### Frontend Pages

#### `/laboratorio` (Authenticated)
- **File**: `src/app/laboratorio/page.tsx`
- Calendario interactivo con colores de disponibilidad:
  - 🟢 **Verde**: Todos los bloques libres
  - 🟡 **Amarillo**: Algunos bloques ocupados, otros disponibles
  - 🟠 **Naranja**: Todos los bloques ocupados
  - ⬜ **Gris**: No disponible (fin de semana/pasado)
- Formulario con:
  - Datos del solicitante (nombre, email, teléfono, organización)
  - Información del evento (título, descripción, propósito, asistentes)
  - Selección de bloques horarios (los ocupados aparecen deshabilitados)
  - Opción de recurrencia semanal (hasta 8 semanas)

#### `/calendar` (Public)
- **File**: `src/app/calendar/page.tsx`
- Solo muestra eventos APPROVED
- Calendario de solo lectura
- Click en día con eventos muestra detalles
- Muestra "X eventos" si hay múltiples en un día

#### `/admin/reservas-metaverso` (Admin)
- **File**: `src/app/admin/reservas-metaverso/page.tsx`
- Lista todas las reservas con filtros por estado
- Acciones: Aprobar (con verificación de conflictos), Rechazar (requiere razón)
- Detalles completos del evento y solicitante

### API Routes

```
POST   /api/metaverse-reservations           # Crear reserva
GET    /api/metaverse-reservations           # Listar todas (admin)
GET    /api/metaverse-reservations/approved  # Solo aprobadas (público)
GET    /api/metaverse-reservations/availability?startDate=X&endDate=Y
PATCH  /api/metaverse-reservations/:id       # Aprobar/rechazar (admin)
DELETE /api/metaverse-reservations/:id       # Eliminar (admin)
```

### Availability Response Format

```typescript
// GET /api/metaverse-reservations/availability
{
  "2025-12-01": {
    "available": true,
    "occupiedBlocks": ["block_1", "block_3"],
    "availableBlocks": ["block_2", "block_4", "block_5", "block_6"]
  },
  "2025-12-02": {
    "available": false,  // Todos los bloques ocupados
    "occupiedBlocks": ["block_1", "block_2", "block_3", "block_4", "block_5", "block_6"],
    "availableBlocks": []
  }
}
```

### Types

**File**: `src/types/metaverse-reservation.ts`

```typescript
interface MetaverseReservation {
  _id: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  organization?: string;
  eventTitle: string;
  eventDescription: string;
  purpose: string;
  expectedAttendees?: number;
  reservationDate: string;  // "YYYY-MM-DD"
  timeBlocks: string[];     // ["block_1", "block_2"]
  status: "pending" | "approved" | "rejected" | "cancelled";
  userId: string;
  isRecurring: boolean;
  recurrenceGroupId?: string;
  recurrenceWeeks?: number;
  recurrenceDays?: number[];
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Dashboard Cards

Los accesos al sistema están en los dashboards:

- **Admin Dashboard** (`src/components/admin/admin-dashboard-content.tsx`):
  - "Reservar Laboratorio Metaverso" → `/laboratorio`
  - "Gestionar Reservas Metaverso" → `/admin/reservas-metaverso`

- **User Dashboard**: Card para reservar laboratorio → `/laboratorio`

### Middleware Protection

**File**: `middleware.ts`

```typescript
const protectedRoutes = ["/dashboard", "/admin", "/laboratorio"];
```

### Component Notes

⚠️ **NO usar shadcn Checkbox** en esta página. Causa errores de propagación de eventos.
Se usan checkboxes custom con divs:

```tsx
<div
  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
    isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
  }`}
  onClick={() => handleToggle()}
>
  {isSelected && <CheckIcon />}
</div>
```

### Backend Module

**Path**: `../centromundox-api-reservas/src/metaverse-reservations/`

#### Files Structure

```
src/metaverse-reservations/
├── metaverse-reservation.entity.ts      # Entidad MongoDB con TypeORM
├── metaverse-reservations.service.ts    # Lógica de negocio
├── metaverse-reservations.controller.ts # Endpoints REST
├── metaverse-reservations.module.ts     # Módulo NestJS
└── dto/
    ├── create-metaverse-reservation.dto.ts
    ├── update-metaverse-reservation.dto.ts
    └── filter-metaverse-reservation.dto.ts
```

#### Entity (metaverse-reservation.entity.ts)

```typescript
export enum MetaverseReservationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export const VALID_METAVERSE_TIME_BLOCKS = [
  "block_1", "block_2", "block_3", "block_4", "block_5", "block_6"
] as const;

@Entity("metaverseReservations")
export class MetaverseReservation {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  requesterName: string;

  @Column()
  requesterEmail: string;

  @Column({ nullable: true })
  requesterPhone?: string;

  @Column({ nullable: true })
  organization?: string;

  @Column()
  eventTitle: string;

  @Column()
  eventDescription: string;

  @Column()
  purpose: string;

  @Column({ nullable: true })
  expectedAttendees?: number;

  @Column()
  reservationDate: string;  // "YYYY-MM-DD"

  @Column("array")
  timeBlocks: string[];

  @Column({ default: MetaverseReservationStatus.PENDING })
  status: MetaverseReservationStatus;

  @Column()
  userId: string;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  recurrenceGroupId?: string;

  @Column({ nullable: true })
  recurrencePattern?: string;

  @Column({ nullable: true })
  recurrenceWeeks?: number;

  @Column("array", { nullable: true })
  recurrenceDays?: number[];

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ nullable: true })
  approvedAt?: Date;

  @Column({ nullable: true })
  rejectedBy?: string;

  @Column({ nullable: true })
  rejectedAt?: Date;

  @Column({ nullable: true })
  rejectionReason?: string;

  @Column({ nullable: true })
  adminNotes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Service Key Methods (metaverse-reservations.service.ts)

```typescript
// Crear reserva (auto-aprueba si es admin)
async create(
  createDto: CreateMetaverseReservationDto,
  userId: string,
  isAdmin: boolean = false
): Promise<MetaverseReservation | MetaverseReservation[]>

// Verificar disponibilidad por bloques
async checkAvailability(date: string): Promise<{
  available: boolean;
  occupiedBlocks: string[];
  availableBlocks: string[];
  reservations: MetaverseReservation[];
}>

// Obtener disponibilidad para rango de fechas
async getAvailabilityRange(startDate: string, endDate: string): Promise<Record<string, {
  available: boolean;
  occupiedBlocks: string[];
  availableBlocks: string[];
}>>

// Aprobar/rechazar reserva
async update(
  id: string,
  adminUserId: string,
  updateDto: UpdateMetaverseReservationDto
): Promise<MetaverseReservation>

// Obtener solo reservas aprobadas (público)
async findApproved(): Promise<MetaverseReservation[]>
```

#### Controller Endpoints (metaverse-reservations.controller.ts)

```typescript
@Controller("metaverse-reservations")
export class MetaverseReservationsController {

  @Post()
  @UseGuards(JwtAuthGuard)  // Requiere autenticación
  async create(@Request() req, @Body() createDto) {
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
    return this.service.create(createDto, req.user.userId, isAdmin);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superadmin")  // Solo admins
  async findAll(@Query() filterDto) { ... }

  @Get("approved")
  // Sin guard - público
  async findApproved() { ... }

  @Get("availability")
  // Sin guard - público
  async getAvailability(@Query() query) { ... }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superadmin")
  async update(@Param("id") id, @Request() req, @Body() updateDto) { ... }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superadmin")
  async remove(@Param("id") id) { ... }
}
```

#### Module Registration

El módulo está registrado en `app.module.ts`:

```typescript
@Module({
  imports: [
    // ... otros módulos
    MetaverseReservationsModule,
  ],
})
export class AppModule {}
```

#### Conflict Detection Logic

Al crear o aprobar una reserva, el servicio verifica conflictos por bloque:

```typescript
// Verificar si algún bloque solicitado ya está ocupado
const existingApproved = await this.repository.find({
  where: {
    reservationDate: date,
    status: MetaverseReservationStatus.APPROVED,
  },
});

const occupiedBlocks = new Set<string>();
for (const reservation of existingApproved) {
  for (const block of reservation.timeBlocks) {
    occupiedBlocks.add(block);
  }
}

const conflictingBlocks = requestedBlocks.filter(block => occupiedBlocks.has(block));
if (conflictingBlocks.length > 0) {
  throw new ConflictException(
    `Los siguientes bloques horarios ya están ocupados: ${conflictingBlocks.join(", ")}`
  );
}
```

### Heroku Deployment

Backend desplegado en: `https://centromundox-backend-947baa9d183e.herokuapp.com/`

Para desplegar cambios del backend:
```bash
cd ../centromundox-api-reservas
git add -A && git commit -m "mensaje"
git push origin master    # GitHub
git push heroku master    # Heroku
```

Para verificar el deploy:
```bash
heroku releases --app centromundox-backend
heroku ps --app centromundox-backend
```
