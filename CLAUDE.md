# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 client for Centro Mundo X Equipment Management System - Frontend application for managing VR equipment reservations with RFID tracking integration and administrative functions. Features comprehensive product management, lens request processing, user administration, and equipment tracking with printing capabilities. Uses React 19, TypeScript with strict mode, and Tailwind CSS v4.

## Architecture

### Frontend Stack
- **Next.js 15.4.4** with App Router and Server Components
- **React 19.1.0** with latest hooks (useActionState)
- **TypeScript 5** with strict mode enabled
- **Tailwind CSS v4** with design tokens
- **Shadcn UI** components
- **Jose** for JWT verification in middleware

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers (proxy to backend)
│   │   ├── auth/         # Authentication endpoints (login, register, user)
│   │   ├── admin/        # Admin-only endpoints (users, lens-requests)
│   │   ├── lens-request/ # Equipment request endpoints
│   │   └── product-types/# Product type management API
│   ├── auth/             # Auth pages (login, register)
│   ├── dashboard/        # User dashboard pages
│   │   ├── mis-reservas/ # User reservations
│   │   ├── perfil/       # User profile
│   │   ├── qr/          # QR code display
│   │   └── reservas/    # Reservation system
│   ├── admin/            # Admin dashboard pages
│   │   ├── activos/     # Asset management
│   │   ├── dashboard/   # Admin main dashboard
│   │   ├── productos/   # Product management
│   │   ├── solicitudes/ # Lens request management
│   │   ├── tipos-productos/ # Product types
│   │   └── usuarios/    # User administration
│   ├── demo-reserva/    # Demo reservation process
│   └── layout.tsx       # Root layout with error boundary
├── components/
│   ├── auth/            # Auth forms and buttons
│   ├── admin/           # Admin-specific components (forms, dialogs, tables)
│   ├── dashboard/       # Dashboard components
│   ├── layout/          # Navbar, footer
│   ├── sections/        # Landing page sections
│   └── ui/             # Shadcn UI components
├── lib/                 # Server actions and utilities
├── types/              # TypeScript interfaces
└── middleware.ts       # JWT auth middleware with role-based routing
```

## Development Commands

```bash
# Development (with Turbopack)
npm run dev              # Runs on http://localhost:3001 (default port per package.json)

# Production build
npm run build           # Creates .next/ production build
npm start               # Runs production server (PORT env var supported)

# Code quality (ALWAYS run before committing)
npm run lint            # Next.js linting with ESLint 9

# UI Components
npm run ui:add [component]  # Add Shadcn UI component
```

## Authentication Flow

1. **API Routes as Proxy**: All `/api/*` routes proxy to backend at `http://localhost:3000`
2. **JWT Storage**: Tokens stored in httpOnly cookies (`auth-token`)
3. **Middleware Protection**: Routes protected via `middleware.ts`
4. **Role-based Routing**:
   - Admin users: Redirected to `/admin/dashboard`
   - Regular users: Redirected to `/dashboard`
   - Protected routes require valid JWT

## API Integration Pattern

All backend calls go through Next.js API routes which:
1. Receive client requests
2. Forward to NestJS backend (port 3000)
3. Handle JWT token in cookies
4. Return formatted responses

Example flow:
```
Client → /api/auth/login → Backend /auth/login → JWT in cookie → Response
```

## TypeScript Configuration

### Strict Mode Settings
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitReturns: true`

### Path Aliases
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/lib/*` → `./src/lib/*`
- `@/types/*` → `./src/types/*`

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000  # Backend API URL
JWT_SECRET=your-secret-key                 # Must match backend
```

## Styling System

### Design Tokens (Tailwind CSS v4)
Located in `globals.css`:
- Brand colors: `--color-primary-blue`, `--color-primary-orange`
- Typography scales: `--font-size-*`, `--line-height-*`
- Spacing: `--spacing-*`
- Border radius: `--radius-*`

### Brand Colors
- Primary Blue: `#1859A9`
- Primary Orange: `#FF8200`
- Secondary Blue: `#003087`
- Secondary Orange: `#F68629`

## Code Patterns

### Server Components (Default)
```tsx
// Pages are async Server Components by default
export default async function Page() {
  // Direct data fetching
  return <div>...</div>;
}
```

### Client Components (When Needed)
```tsx
"use client"; // Only when using hooks/browser APIs

export default function Component() {
  // Can use useState, useEffect, etc.
}
```

### API Route Handler
```ts
// src/app/api/*/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const response = await fetch(`${API_BASE_URL}/endpoint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  
  return NextResponse.json(await response.json());
}
```

## Common Tasks

### Adding New Pages
1. Create directory in `src/app/`
2. Add `page.tsx` (Server Component by default)
3. Update navigation in `src/components/layout/navbar.tsx`
4. Add to middleware if authentication required

### Adding API Endpoints
1. Create route handler in `src/app/api/*/route.ts`
2. Implement HTTP methods (GET, POST, etc.)
3. Proxy to backend with proper headers
4. Handle JWT token from cookies

### Creating Forms
1. Use controlled components with useState
2. Add client-side validation
3. Call API routes (not backend directly)
4. Handle loading and error states
5. Use Shadcn UI form components

## Important Implementation Details

1. **Cookie-based Auth**: JWT stored in httpOnly cookies, not localStorage
2. **Middleware Logging**: Debug logs in middleware.ts for auth flow
3. **Error Boundaries**: Global error boundary in root layout
4. **Responsive Design**: All forms use responsive grid layouts
5. **Admin Routes**: `/admin/*` paths require admin role in JWT
6. **API Proxy Pattern**: Never call backend directly from client components
7. **Turbopack**: Development uses `--turbopack` flag for faster builds
8. **React 19**: Use `useActionState` instead of deprecated `useFormState`

## Testing Approach

Currently no test configuration. To add testing:
1. Install Jest/Vitest + React Testing Library
2. Add test scripts to package.json
3. Create `__tests__` directories
4. Follow Next.js testing guidelines

## Deployment Notes

- Build output: `.next/` directory
- Static assets optimized automatically
- Environment variables required in production
- Ensure JWT_SECRET matches backend
- Set NODE_ENV=production for secure cookies

## Related Services

This client connects to:
- **centromundox-api-reservas**: Main NestJS backend (port 3000)
- **fx9600-control**: RFID cabinet controller (hardware integration)
- **demo-impresion**: Label printing service (equipment tags)

For full system documentation, see `/home/trilord243/tesis/CLAUDE.md`