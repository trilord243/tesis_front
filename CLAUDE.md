# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CentroMundoX Frontend** - Next.js 15 application for VR/AR equipment reservation management at Centro Mundo X research facility. Features RFID tracking, admin dashboards, lab reservations, metaverse lab booking, product history audit trails, and analytics.

Connects to NestJS backend at `../centromundox-api-reservas` (port 3000).

## Development Commands

```bash
# Development (use PORT=3001 to avoid conflict with backend on 3000)
PORT=3001 npm run dev        # Linux/macOS
$env:PORT=3001; npm run dev  # Windows PowerShell

# Production
npm run build
npm start

# Linting - ALWAYS run after changes
npm run lint

# Add Shadcn UI component
npm run ui:add [component]
```

**Requirements**: Node.js 22.x, npm 10.x

## Environment Setup

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-secret  # Must match backend
```

## Architecture

### Tech Stack
- **Next.js 15.4.4** with App Router, React 19.1.0, TypeScript 5 (strict)
- **Tailwind CSS v4** with Shadcn UI (Radix primitives)
- **Jose** for JWT middleware, **nuqs** for URL state
- **react-big-calendar** for lab reservations, **driver.js** for onboarding tours
- **react-unity-webgl** for metaverse WebGL integration

### Core Pattern: API Proxy

**NEVER call backend directly from client components.** All requests go through API routes:

```typescript
// src/app/api/example/route.ts
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
- Protected routes: `/dashboard`, `/admin`, `/laboratorio`
- Admins accessing `/dashboard` are auto-redirected to `/admin/dashboard`
- Non-admins accessing `/admin` are redirected to `/dashboard`

### Role Checks in API Routes
When checking admin access, **always include both `admin` and `superadmin`**:
```typescript
// ✅ Correct
if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
  return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
}

// ❌ Wrong - excludes superadmin
if (!user || user.role !== "admin") { ... }
```

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
```

### Type Safety Patterns
```typescript
// Use satisfies for type validation without widening
const config = { key: 'value' } satisfies ConfigType;

// Prefer interfaces over types, const maps over enums
interface User { id: string; name: string; }
const STATUS = { PENDING: 'pending', APPROVED: 'approved' } as const;

// For exactOptionalPropertyTypes: spread conditionally instead of undefined
// ✅ Correct
resource: {
  ...(item.optional !== undefined && { optional: item.optional }),
}
// ❌ Wrong - undefined not allowed for optional property
resource: { optional: item.optional }

// For readonly arrays in function parameters
// ✅ Correct
const formatBlocks = (blocks: readonly string[]): string => { ... }
// ❌ Wrong - readonly array can't be passed to mutable param
const formatBlocks = (blocks: string[]): string => { ... }
```

## Code Style

- **Server Components by default** - minimize `'use client'`
- Use `useActionState` (not deprecated `useFormState`)
- Descriptive names: `isLoading`, `hasError`, `handleSubmit`
- Component structure: `exports → subcomponents → helpers → types`
- Directory convention: lowercase with dashes (`components/auth-wizard`)

### Button Component Variants
Custom Button with specific variants (NOT shadcn default):
- **Variants**: `primary`, `secondary`, `outline`, `ghost`, `destructive`
- **Sizes**: `sm`, `md`, `lg` (no `icon` size - use `sm` with `p-0` instead)
- Do NOT use `variant="default"` - use `variant="primary"` instead

## Key Directories

```
src/
├── app/
│   ├── api/                    # API route proxies to backend
│   │   ├── auth/               # Login, register, logout, user, update-profile
│   │   ├── admin/              # Admin-only: users, lens-requests, access-codes
│   │   ├── products/           # Equipment CRUD, usage-statistics
│   │   ├── product-types/      # Product type management with tags
│   │   ├── lab-reservations/   # Computer lab bookings, availability
│   │   ├── metaverse-reservations/  # Metaverse lab: bookings, availability, approval
│   │   ├── lab-config/         # Lab config: computers, software, purposes, user-types
│   │   ├── computers/          # Computer CRUD with seed endpoint
│   │   ├── analytics/          # Cabinet status analytics
│   │   ├── system-logs/        # System logging with stats
│   │   ├── users/              # User management, email verification
│   │   ├── zones/              # Zone/area management
│   │   └── lens-request/       # VR lens requests
│   ├── admin/                  # Admin pages
│   │   ├── dashboard/          # Admin home
│   │   ├── activos/            # Equipment management
│   │   ├── solicitudes/        # Access requests
│   │   ├── usuarios/           # User management
│   │   ├── analytics/          # Usage analytics
│   │   ├── reservas-lab/       # Computer lab reservations
│   │   ├── reservas-metaverso/ # Metaverse lab reservations
│   │   └── config-laboratorio/ # Lab configuration
│   ├── dashboard/              # User pages
│   │   ├── reservas/           # Equipment reservations
│   │   ├── reservar-lab/       # Book computer lab
│   │   ├── mis-reservas-lab/   # My lab reservations
│   │   └── perfil/, qr/        # Profile, QR code
│   ├── laboratorio/            # Metaverse lab booking (authenticated)
│   └── calendar/               # Public calendar (approved events)
├── components/
│   ├── admin/                  # Admin components
│   ├── lab-reservations/       # Lab booking components
│   ├── ui/                     # Shadcn UI components
│   └── layout/                 # Navbar, footer
├── lib/
│   ├── actions/                # Server actions (e.g., whatsapp-actions.ts)
│   └── utils.ts                # Utilities (cn helper)
├── middleware.ts               # JWT auth & role-based routing (root level)
└── types/                      # TypeScript interfaces
    ├── auth.ts
    ├── product.ts
    ├── lab-reservation.ts
    ├── lab-config.ts
    └── metaverse-reservation.ts
```

## Business Logic

### Metaverse Laboratory Reservations

| Route | Access | Purpose |
|-------|--------|---------|
| `/laboratorio` | Authenticated | Create reservations |
| `/calendar` | Public | View approved events |
| `/admin/reservas-metaverso` | Admin | Approve/reject |

**Time Blocks** (6 blocks × 1h 45min): 07:00-08:45, 08:45-10:30, 10:30-12:15, 12:15-14:00, 14:00-15:45, 15:45-17:30

**Business Rules**:
- Multiple events per day allowed if different time blocks
- Admin reservations auto-approved; users require approval
- Blocks only lock when APPROVED (pending = still available)

**Calendar Color Coding**:
- Green: All blocks available
- Yellow: Some blocks occupied
- Orange: All blocks occupied
- Gray: Unavailable (weekend/past)

### Computer Lab Reservations

| Route | Access | Purpose |
|-------|--------|---------|
| `/dashboard/reservar-lab` | Authenticated | Create reservations |
| `/calendario-computadoras` | Authenticated | View all approved reservations |
| `/admin/reservas-lab` | Admin | Approve/reject reservations |

**Dynamic User Type Access Control**:
```typescript
function userHasAccess(computer: Computer, userType: string): boolean {
  if (computer.accessLevel === "normal") return true;
  return computer.allowedUserTypes?.includes(userType) ?? false;
}
```

- Superadmin configures `allowedUserTypes` per computer at `/admin/config-laboratorio`
- Users only see computers their type can access

**Public vs Admin Endpoints**:
- `/api/lab-reservations/public` - All authenticated users (uses backend `/lab-reservations/approved`)
- `/api/lab-reservations` - Admin only (full CRUD access)

## Component Notes

**Metaverse Lab Page** (`/laboratorio`):
- Do NOT use shadcn Checkbox - causes event propagation errors
- Use custom div-based checkboxes:
```tsx
<div
  className={`w-4 h-4 rounded border-2 ${isSelected ? "bg-blue-600" : "border-gray-300"}`}
  onClick={handleToggle}
/>
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port conflict | Use `PORT=3001 npm run dev` |
| CORS errors | Check backend `FRONTEND_URL` env var |
| Auth issues | Clear cookies, verify JWT_SECRET matches backend |
| Type errors with array access | Use optional chaining: `arr[0]?.prop` |

## Brand Colors

- Primary Blue: `#1859A9`
- Primary Orange: `#FF8200`
- Secondary Blue: `#003087`
- Secondary Orange: `#F68629`

## Deployment

Frontend deployed to Vercel. Backend on Heroku: `https://centromundox-backend-947baa9d183e.herokuapp.com/`

```bash
# Check backend deployment
heroku releases --app centromundox-backend
heroku ps --app centromundox-backend
```
