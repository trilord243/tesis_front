# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CentroMundoX Equipment Management System Frontend** - A modern Next.js 15 application with React 19 for managing high-end VR/AR equipment reservations at a research facility. Features RFID tracking integration, real-time analytics, administrative dashboards, product history audit trails, location tracking, and an interactive landing page.

This frontend connects to the **centromundox-api-reservas** NestJS backend API located at `~\Documents\personal\tesis\centromundox-api-reservas`.

## Architecture

### Tech Stack
- **Next.js 15.4.4** with App Router and Server Components
- **React 19.1.0** with latest hooks (useActionState)
- **TypeScript 5** with strict mode enabled
- **Tailwind CSS v4** with design tokens
- **Shadcn UI** components (Radix UI primitives)
- **Jose** for JWT verification in middleware
- **QRCode** for access code generation
- **Driver.js** for interactive tours

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers (proxy to backend)
│   │   ├── auth/         # Authentication endpoints (login, logout)
│   │   ├── admin/        # Admin-only endpoints
│   │   ├── lens-request/ # Equipment request endpoints
│   │   ├── products/     # Product management endpoints
│   │   ├── product-types/# Product type management
│   │   ├── users/        # User management endpoints
│   │   └── zones/        # Zone management endpoints
│   ├── auth/             # Auth pages (login, register, verify-email)
│   ├── dashboard/        # User dashboard pages
│   ├── admin/            # Admin dashboard pages
│   │   ├── activos/     # Asset management
│   │   ├── analytics/   # Analytics dashboard (NEW)
│   │   ├── dashboard/   # Admin overview
│   │   ├── inventario-ubicacion/ # Location tracking
│   │   ├── mis-equipos/ # Admin equipment view
│   │   ├── productos-usuarios/ # Products by user view
│   │   ├── qr/         # QR code management
│   │   ├── solicitudes/ # Lens request approval
│   │   ├── tipos-activos/ # Product types
│   │   ├── usuarios/    # User management
│   │   └── usuarios-equipos/ # Users by equipment view
│   ├── demo-reserva/     # Demo reservation process
│   └── page.tsx          # Landing page
├── components/
│   ├── auth/            # Auth forms and buttons
│   ├── admin/           # Admin-specific components (30+ components)
│   │   ├── *-form.tsx  # Form components for CRUD
│   │   ├── *-list.tsx  # List/table components
│   │   ├── *-dialog.tsx # Modal dialogs
│   │   ├── *-analytics.tsx # Analytics components (NEW)
│   │   └── product-history-*.tsx # History tracking
│   ├── dashboard/       # Dashboard components
│   ├── layout/          # Navbar, footer
│   ├── sections/        # Landing page sections
│   └── ui/             # Shadcn UI components
├── lib/
│   ├── actions/        # Server actions by feature
│   ├── api/           # API client services
│   │   ├── product-history.ts # Product history API
│   │   └── usage-analytics.ts # Analytics API (NEW)
│   ├── auth.ts        # Auth utilities
│   └── utils.ts       # Helper functions (cn, formatters)
├── types/              # TypeScript interfaces
│   ├── auth.ts
│   ├── product.ts
│   ├── product-history.ts
│   ├── usage-analytics.ts # Analytics types (NEW)
│   └── index.ts
└── middleware.ts       # JWT auth middleware with role-based routing
```

## Development Commands

```bash
# Development (runs on port 3000 by default, use 3001 to avoid backend conflict)
npm run dev              # Start with Turbopack hot reload
PORT=3001 npm run dev    # Start on custom port (recommended for local dev)

# Production
npm run build           # Creates .next/ production build
npm start               # Runs production server (PORT env var supported)

# Code Quality - ALWAYS run after making changes
npm run lint            # Next.js linting with ESLint 9

# UI Components
npm run ui:add [component]  # Add Shadcn UI component via CLI
```

## Running with Backend

The frontend requires the backend API to be running. They communicate via HTTP requests.

**Backend location**: `C:\Users\FelipeEscalona\Documents\personal\tesis\centromundox-api-reservas`

```bash
# Terminal 1: Start backend API (runs on port 3000)
cd ~/Documents/personal/tesis/centromundox-api-reservas
npm run start:dev

# Terminal 2: Start frontend (run on port 3001 to avoid conflict)
cd ~/Documents/personal/tesis/tesis_front
PORT=3001 npm run dev

# Alternative: Run both from backend directory
cd ~/Documents/personal/tesis/centromundox-api-reservas
npm run dev:all         # Starts both API (3000) and client (3001) in parallel
```

## Environment Variables

```env
# .env (checked into repo - production values)
JWT_SECRET=changeme_secret_key  # Must match backend
NEXT_PUBLIC_API_URL=https://centromundox-backend-947baa9d183e.herokuapp.com

# .env.local (create for local development - not in repo)
NEXT_PUBLIC_API_URL=http://localhost:3000  # Local backend
```

## Authentication Flow

1. **API Routes as Proxy**: All `/api/*` routes proxy requests to backend
2. **JWT Storage**: Tokens stored in httpOnly cookies (`auth-token`)
3. **Middleware Protection**: Routes protected via `middleware.ts` in project root
4. **Role-based Routing**:
   - Admin users → `/admin/dashboard`
   - Regular users → `/dashboard`
5. **Automatic Redirects**: Middleware handles auth state and redirects appropriately

### Middleware Configuration

File: `middleware.ts` (project root)

- Uses `jose` library for JWT verification
- Protected routes: `/dashboard/*`, `/admin/*`
- Auth-only routes: `/auth/login`, `/auth/register`
- Console logging for debugging auth flow
- Role-based access control (admin vs user)

## Code Patterns

### Server Components (Default)
```tsx
// Server Component - default, use for data fetching
export default async function Page() {
  const data = await fetch('...');
  return <div>{data}</div>;
}
```

### Client Components (When Needed)
```tsx
"use client"; // Only when using hooks/browser APIs

import { useState } from "react";

export function Component() {
  const [state, setState] = useState();
  return <div>Interactive content</div>;
}
```

### Server Actions (in src/lib/actions/)
```ts
"use server";

import { cookies } from "next/headers";

export async function actionName(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  const result = await fetch(`${API_BASE_URL}/endpoint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  return result.json();
}
```

### API Route Handler (in src/app/api/)
```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = request.cookies.get("auth-token")?.value;

  const response = await fetch(`${API_BASE_URL}/endpoint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });

  return NextResponse.json(await response.json(), {
    status: response.status
  });
}
```

## TypeScript Configuration

Strict mode enabled with additional safety checks:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

**Path aliases**:
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/lib/*` → `./src/lib/*`
- `@/types/*` → `./src/types/*`

## Styling System

### Design Tokens (Tailwind CSS v4)
Located in `src/app/globals.css`:

```css
/* Brand colors from CentroMundoX manual */
--brand-primary: #1859A9;    /* Primary Blue */
--brand-orange: #FF8200;      /* Primary Orange */
--brand-secondary: #003087;   /* Secondary Blue */
--brand-orange-secondary: #F68629; /* Secondary Orange */

/* Spacing tokens */
--spacing-xs: 0.5rem;
--spacing-sm: 1rem;
--spacing-md: 1.5rem;
--spacing-lg: 2rem;
--spacing-xl: 3rem;

/* Border radius tokens */
--radius-sm: 0.375rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
```

### Typography
- **Headings**: Roboto Condensed
- **Body Text**: Roboto
- **Responsive Scaling**: Using clamp() for fluid typography

## Key Features

### 🆕 Analytics Dashboard (`/admin/analytics`)

Complete system for tracking equipment usage and patterns:

**Components**:
- `SystemAnalyticsDashboard` - Main dashboard with tabs
- `CabinetAnalytics` - Real-time cabinet inventory status
- `LoanFrequencyAnalytics` - Request and checkout patterns
- `ProductUsageLogs` - Per-product usage tracking

**Metrics Available**:
- Total equipment usage (hours, days, sessions)
- Cabinet occupancy rates
- Most/least used equipment
- Active users and rankings
- Loan approval/rejection rates
- Peak usage days and hours
- Equipment availability status

**API Service**: `src/lib/api/usage-analytics.ts`
**Types**: `src/types/usage-analytics.ts`
**Documentation**: `ANALYTICS-USAGE-LOGS-DOCS.md`

### Product History & Audit System

Complete audit trail for all equipment:

**Features**:
- 30+ event types (checkout, return, maintenance, updates, etc.)
- Visual timeline with filtering
- Event severity levels (INFO, WARNING, ERROR, CRITICAL, SUCCESS)
- Statistics dashboard with distribution analysis
- Active users tracking

**Components**:
- `ProductHistoryTimeline` - Visual event timeline
- `ProductHistoryStats` - Statistics and metrics
- `ProductHistoryDashboard` - Combined view

**Documentation**: `PRODUCT-HISTORY-SYSTEM.md`

### User Dashboard (`/dashboard`)

User-facing features:
- Profile management
- Equipment request submission
- QR code access display
- Reservation history
- Active checkout tracking

### Admin Interface (`/admin`)

Comprehensive administrative tools:

- **Asset Management** (`/admin/activos`): Complete inventory CRUD with RFID label printing
- **Analytics** (`/admin/analytics`): Usage metrics and patterns (NEW)
- **Request Approval** (`/admin/solicitudes`): Review and approve lens requests
- **User Management** (`/admin/usuarios`): User administration and access codes
- **User Equipment Views**:
  - `/admin/usuarios-equipos` - Equipment by user
  - `/admin/productos-usuarios` - Users by equipment
  - `/admin/mis-equipos` - Admin's equipment view
- **Product Types** (`/admin/tipos-activos`): Category and tag management
- **Location Tracking** (`/admin/inventario-ubicacion`): Real-time equipment location
- **QR Management** (`/admin/qr`): Access code QR generation
- **Dashboard** (`/admin/dashboard`): Overview and statistics

### Authentication Pages (`/auth`)

- **Login** (`/auth/login`): Email/password authentication
- **Register** (`/auth/register`): New user registration
- **Email Verification** (`/auth/verify-email`): Account verification flow

### Public Landing Page (`/`)

- Hero section with video background
- Research center values
- Equipment showcase
- Call-to-action for reservations
- Responsive design with brand guidelines

## API Integration

### Proxy Architecture

All API calls go through Next.js API routes (`/api/*`) that proxy to the backend. This pattern:
- Centralizes API communication
- Handles authentication headers
- Manages cookies securely
- Provides error handling

### Key API Route Groups

- `/api/auth/*` - Authentication (login, logout)
- `/api/products/*` - Product management
- `/api/lens-request/*` - Equipment requests
- `/api/admin/*` - Admin-only operations
- `/api/zones/*` - Zone management
- `/api/product-types/*` - Product type operations
- `/api/users/*` - User management

### Backend API Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://centromundox-backend-947baa9d183e.herokuapp.com`

## UI Component System

### Shadcn UI Components

Pre-configured components in `src/components/ui/`:
- **Forms**: Input, Button, Label, Checkbox
- **Layout**: Card, Separator, Tabs
- **Feedback**: Toast, Tooltip, Dialog
- **Navigation**: NavigationMenu, DropdownMenu
- **Display**: Badge, Table, Command (cmdk)

### Admin Components (30+ specialized)

**Product Management**:
- ProductForm, ProductsList, ProductDetailsDialog
- MetaquestSetForm (for VR headset + controller sets)
- ProductPrintButton (RFID label printing)
- ProductNameInput (with suggestions)

**Analytics (NEW)**:
- SystemAnalyticsDashboard
- CabinetAnalytics
- LoanFrequencyAnalytics
- ProductUsageLogs

**Product History**:
- ProductHistoryTimeline
- ProductHistoryStats
- ProductHistoryDashboard

**Location & Equipment**:
- AssetLocationManager
- AssetLocationDialog
- LocationInventoryDashboard
- UsersEquipmentManager
- UserProductsManager

**Maintenance**:
- CompleteMaintenanceDialog
- Maintenance workflow components

**Lens Requests**:
- LensRequestStats
- LensRequestTable
- LensRequestDialog
- LensRequestFilters

**User Management**:
- AccessCodeManager
- AdminQRDisplay

**Product Types**:
- ProductTypeSelector
- Type management forms

## Security Configuration

### Security Headers (next.config.ts)
```javascript
{
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "origin-when-cross-origin"
}
```

### Authentication Security
- JWT tokens in httpOnly cookies (not localStorage)
- Token blacklisting on logout (backend)
- Role-based access control
- Automatic token expiration handling
- CORS restricted to known origins

## Important Implementation Details

1. **Cookie-based Auth**: JWT stored in httpOnly cookies (`auth-token`), not localStorage - more secure against XSS
2. **Middleware Logging**: Console logs in middleware.ts for auth flow debugging
3. **Error Boundaries**: Global error boundary in root layout
4. **API Proxy Pattern**: NEVER call backend directly from client components - always use `/api/*` routes or server actions
5. **Turbopack**: Development uses `--turbopack` flag for faster builds
6. **React 19**: Use `useActionState` instead of deprecated `useFormState`
7. **Server Components Default**: Use Server Components unless client interactivity needed
8. **Port Configuration**: Use PORT=3001 for local dev to avoid conflict with backend on 3000
9. **Async Runtime APIs**: Always await `cookies()`, `headers()`, `params`, `searchParams`
10. **Product History**: Complete audit trail system with 30+ event types
11. **Analytics System**: Real-time usage tracking and pattern analysis (NEW)
12. **Location Tracking**: Zone-based equipment location management

## Common Development Tasks

### Adding New Pages
1. Create directory in `src/app/`
2. Add `page.tsx` (Server Component by default)
3. Update navigation in `src/components/layout/navbar.tsx`
4. Add to middleware protection if authentication required

### Adding API Endpoints
1. Create route handler in `src/app/api/[route]/route.ts`
2. Implement HTTP methods (GET, POST, PATCH, DELETE)
3. Proxy to backend with proper headers and auth token
4. Handle errors and return appropriate status codes

### Creating Forms
1. Use controlled components with useState (client component)
2. Add client-side validation
3. Call API routes or server actions (not backend directly)
4. Handle loading and error states
5. Use Shadcn UI form components for consistency

### Adding Analytics Features
1. Define types in `src/types/usage-analytics.ts`
2. Add API methods in `src/lib/api/usage-analytics.ts`
3. Create components in `src/components/admin/`
4. Integrate into SystemAnalyticsDashboard

## Testing & Development

### Local Development Setup
1. Ensure backend is running on port 3000
2. Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3000`
3. Run `npm install`
4. Run `PORT=3001 npm run dev`
5. Access at `http://localhost:3001`

### Common Issues & Solutions

**CORS Errors**:
- Verify backend CORS configuration includes frontend URL
- Check `FRONTEND_URL` in backend `.env`

**Auth Token Issues**:
- Clear browser cookies and re-login
- Verify `JWT_SECRET` matches between frontend and backend

**Middleware Loops**:
- Check redirect logic in `middleware.ts`
- Review protected/auth route configurations

**Build Errors**:
- Run `npm run lint` to identify issues
- Check for TypeScript errors with strict mode

**Port Already in Use**:
- Backend uses port 3000
- Run frontend on 3001: `PORT=3001 npm run dev`

## Related Services

This frontend is part of the CentroMundoX ecosystem:

- **centromundox-api-reservas**: NestJS backend API (port 3000)
  - Location: `~\Documents\personal\tesis\centromundox-api-reservas`
  - Handles authentication, database, business logic
  - MongoDB database
  - JWT authentication
  - Email/WhatsApp notifications

- **fx9600-control**: RFID reader controller (embedded)
  - Hardware integration for cabinet
  - Tag scanning and inventory sync

- **demo-impresion**: Label printing service
  - Generates RFID tags (EPC GIAI-96 format)
  - ZPL label printing

For full system documentation, see parent directory's `CLAUDE.md`

## Server Actions Structure

Server actions are organized in `src/lib/actions/` by feature:

- `admin-products.ts` - Admin product management operations
- `auth.ts` - Server-side authentication actions
- `client-auth.ts` - Client authentication utilities
- `dashboard-stats.ts` - Dashboard statistics fetching
- `lens-requests.ts` - Equipment request workflow
- `maintenance.ts` - Equipment maintenance operations
- `products.ts` - Product CRUD operations
- `product-suggestions.ts` - AI-powered product suggestions
- `product-types.ts` - Product type management
- `utils.ts` - Shared utilities

## Cursor Rules

The project follows Cursor rules in `.cursor/rules/new.mdc`:

**TypeScript Best Practices**:
- Prefer interfaces over types
- Use const maps instead of enums
- Descriptive names with auxiliary verbs (isLoading, hasError)
- Event handlers prefixed with "handle"

**React 19 & Next.js 15**:
- Favor React Server Components (RSC)
- Minimize 'use client' directives
- Use `useActionState` instead of deprecated `useFormState`
- Always use async versions of runtime APIs (cookies, headers, params)
- Implement proper error boundaries

**Code Style**:
- Write concise, readable code
- Functional and declarative patterns
- Early returns for readability
- Component structure: exports, subcomponents, helpers, types

## Additional Documentation

Comprehensive documentation available in project root:

**System Documentation**:
- `ANALYTICS-USAGE-LOGS-DOCS.md` - Analytics system complete guide
- `PRODUCT-HISTORY-SYSTEM.md` - Product history and audit trail
- `API-ENDPOINTS.md` - Complete API reference
- `DOCUMENTACION-FRONTEND.md` - Spanish frontend documentation

**Feature Documentation**:
- `SISTEMA-AUTH-IMPLEMENTADO.md` - Authentication system details
- `DEMO-INTERACTIVO-RESERVAS.md` - Demo reservation flow
- `EMAIL_VERIFICATION_API_DOCS.md` - Email verification flow
- `TOUR-RESERVAS-DRIVERJS.md` - Interactive tour system

**Design & Branding**:
- `LANDING-BRAND-GUIDE.md` - Brand implementation guide
- `CONTEXTO-CENTROMUNDOX.md` - Research center context
- `RESUMEN-CAMBIOS-RESPONSIVE.md` - Responsive design changes

**Integration Examples**:
- `FRONTEND-INTEGRATION-EXAMPLES.md` - API integration patterns
- `FRONTEND-PRODUCTS-API.md` - Products API documentation
- `BACKEND-ACTIVOS-SCHEMA.md` - Asset model schema
- `MODELO-ACTIVOS.md` - Asset management model

## Performance Optimizations

- **Image Optimization**: WebP/AVIF formats with responsive sizing
- **Code Splitting**: Automatic with Next.js App Router
- **Compression**: Enabled in production
- **Font Loading**: Optimized with next/font
- **Server Components**: Reduce client-side JavaScript
- **Turbopack**: Faster development builds

## Accessibility

- Focus styles for keyboard navigation
- Semantic HTML structure
- ARIA labels where appropriate
- Color contrast meets WCAG standards
- Responsive touch targets (minimum 44x44px)
