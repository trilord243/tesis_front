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
