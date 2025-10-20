# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Centro Mundo X Equipment Management System Frontend - A modern Next.js 15 application with React 19 for managing high-end VR/AR equipment reservations, featuring RFID tracking integration, real-time status updates, administrative dashboards, and an interactive landing page for the research facility.

## Architecture

### Tech Stack
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
│   │   ├── auth/         # Authentication endpoints
│   │   ├── admin/        # Admin-only endpoints
│   │   ├── lens-request/ # Equipment request endpoints
│   │   ├── product-types/# Product type management
│   │   └── zones/        # Zone management
│   ├── auth/             # Auth pages (login, register)
│   ├── dashboard/        # User dashboard pages
│   ├── admin/            # Admin dashboard pages
│   │   ├── activos/     # Asset management
│   │   ├── solicitudes/ # Lens request approval
│   │   ├── usuarios/    # User management
│   │   ├── tipos-activos/ # Product types
│   │   ├── inventario-ubicacion/ # Location tracking
│   │   └── dashboard/   # Admin overview
│   └── demo-reserva/     # Demo reservation process
├── components/
│   ├── auth/            # Auth forms and buttons
│   ├── admin/           # Admin-specific components (50+ components)
│   │   ├── *-form.tsx  # Form components for CRUD
│   │   ├── *-list.tsx  # List/table components
│   │   ├── *-dialog.tsx # Modal dialogs
│   │   └── product-history-*.tsx # History tracking
│   ├── dashboard/       # Dashboard components
│   ├── layout/          # Navbar, footer
│   ├── sections/        # Landing page sections
│   └── ui/             # Shadcn UI components
├── lib/
│   ├── actions/        # Server actions by feature
│   ├── api/           # API client services
│   ├── auth.ts        # Auth utilities
│   └── utils.ts       # Helper functions (cn, formatters)
├── types/              # TypeScript interfaces
└── middleware.ts       # JWT auth middleware with role-based routing
```

## Development Commands

```bash
# Development
npm run dev              # Runs on http://localhost:3001 with Turbopack

# Production
npm run build           # Creates .next/ production build
npm start               # Runs production server (PORT env var supported)

# Code Quality - ALWAYS run after making changes
npm run lint            # Next.js linting with ESLint 9

# UI Components
npm run ui:add [component]  # Add Shadcn UI component via CLI
```

## Running with Backend

```bash
# From API directory (centromundox-api-reservas)
npm run dev:all         # Starts both API (3000) and client (3001) in parallel
npm run client:dev      # Start only client from API directory

# Or start services independently
cd /home/trilord243/tesis/centromundox-api-reservas && npm run start:dev  # API
cd /home/trilord243/tesis/client-backup && npm run dev                     # Client
```

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=https://centromundox-backend-947baa9d183e.herokuapp.com
JWT_SECRET=changeme_secret_key  # Must match backend
```

## Authentication Flow

1. **API Routes as Proxy**: All `/api/*` routes proxy to backend
2. **JWT Storage**: Tokens stored in httpOnly cookies (`auth-token`)
3. **Middleware Protection**: Routes protected via `middleware.ts`
4. **Role-based Routing**:
   - Admin users → `/admin/dashboard`
   - Regular users → `/dashboard`

## Code Patterns

### Server Components (Default)
```tsx
export default async function Page() {
  // Direct data fetching
  return <div>...</div>;
}
```

### Client Components (When Needed)
```tsx
"use client"; // Only when using hooks/browser APIs
```

### Server Actions (in src/lib/actions/)
```ts
"use server";

export async function actionName(data: FormData) {
  const result = await fetch(`${API_BASE_URL}/endpoint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return result.json();
}
```

### API Route Handler
```ts
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

## TypeScript Configuration

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- **Path aliases**:
  - `@/*` → `./src/*`
  - `@/components/*` → `./src/components/*`
  - `@/lib/*` → `./src/lib/*`
  - `@/types/*` → `./src/types/*`

## Styling System

### Design Tokens (Tailwind CSS v4)
Located in `globals.css`:
- Brand colors: `--brand-primary: #1859A9`, `--brand-orange: #FF8200`
- Typography: Roboto, Roboto Condensed
- Spacing: `--spacing-*`
- Border radius: `--radius-*`

## Important Implementation Details

1. **Cookie-based Auth**: JWT stored in httpOnly cookies (`auth-token`), not localStorage
2. **Middleware Logging**: Debug logs in middleware.ts for auth flow troubleshooting
3. **Error Boundaries**: Global error boundary in root layout
4. **API Proxy Pattern**: Never call backend directly from client components - use `/api/*` routes or server actions
5. **Turbopack**: Development uses `--turbopack` flag for faster builds
6. **React 19**: Use `useActionState` instead of deprecated `useFormState`
7. **Server Components Default**: Use Server Components unless client interactivity needed
8. **Port Configuration**: Development runs on 3001 to avoid conflict with API (3000)
9. **Production API**: Configured for Heroku backend deployment
10. **Server Actions**: Located in `src/lib/actions/` with specific modules for different features
11. **Product History**: Complete audit trail system with 30+ event types for equipment tracking
12. **Location Tracking**: Real-time equipment location management via admin dashboard
13. **Maintenance Workflow**: Track equipment maintenance status, repairs, and costs

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

## Key Features

### Public Landing Page
- **Hero Section**: Video background with reservation CTA
- **Values Section**: Research center core values
- **About Section**: Equipment showcase and capabilities
- **Demo Reservation**: Interactive reservation flow (`/demo-reserva`)

### Product History & Audit System
- **Complete Audit Trail**: 30+ event types tracking all equipment activity
- **Timeline View**: Visual timeline with icons, filters, and date ranges
- **Statistics Dashboard**: Distribution analysis, usage patterns, active users
- **Automatic Tracking**: Check-out/in, location changes, maintenance, updates
- **Event Severity**: INFO, WARNING, ERROR, CRITICAL, SUCCESS levels
- **Export Capabilities**: Ready for PDF/Excel exports (future enhancement)
- See `PRODUCT-HISTORY-SYSTEM.md` for complete documentation

### User Dashboard (`/dashboard`)
- **Profile Management**: User information and settings
- **Equipment Requests**: Submit and track lens requests
- **QR Code Access**: Display access codes for cabinet
- **Reservation History**: View past and current reservations

### Admin Interface (`/admin`)
- **Asset Management** (`/admin/activos`): Complete inventory CRUD with RFID printing
- **Request Approval** (`/admin/solicitudes`): Review and approve lens requests
- **User Management** (`/admin/usuarios`): User administration and access codes
- **User Equipment** (`/admin/usuarios-equipos`, `/admin/productos-usuarios`): Equipment assignments
- **Product Types** (`/admin/tipos-activos`): Category and tag management
- **Location Tracking** (`/admin/inventario-ubicacion`): Real-time equipment location
- **Product History**: Complete audit trail with timeline and statistics
- **Maintenance Management**: Track equipment maintenance status and repairs
- **Dashboard** (`/admin/dashboard`): Overview and statistics

### Authentication Pages (`/auth`)
- **Login**: Email/password authentication
- **Register**: New user registration with email verification
- **Email Verification**: Account verification flow

## API Integration

### Proxy Architecture
All API calls go through Next.js API routes that proxy to the backend:

```typescript
// Example: /api/auth/login/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  
  // Set httpOnly cookie if login successful
  if (response.ok) {
    const data = await response.json();
    const response = NextResponse.json(data);
    response.cookies.set("auth-token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return response;
  }
  
  return NextResponse.json(await response.json(), { status: response.status });
}
```

### Key API Routes
- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product management
- `/api/lens-request/*` - Equipment requests
- `/api/admin/*` - Admin-only operations
- `/api/zones/*` - Zone management
- `/api/product-types/*` - Product type operations

## UI Component System

### Shadcn UI Components
Pre-configured components in `src/components/ui/`:
- **Forms**: Input, Button, Label, Checkbox
- **Layout**: Card, Separator, Tabs
- **Feedback**: Toast, Tooltip, Dialog
- **Navigation**: NavigationMenu, DropdownMenu
- **Display**: Badge, Table, Command (cmdk)

### Custom Components

**Layout & Navigation**
- **Navbar**: Responsive with role-based menu items
- **Footer**: Brand information and links

**Authentication**
- **LoginForm/RegisterForm**: Authentication forms
- **QRCodeDisplay**: Access code visualization

**User Dashboard**
- **ProductCard**: Equipment display cards
- **UserProfile**: User information management

**Admin Components (50+ specialized components)**
- **Products**: ProductForm, ProductsList, ProductDetailsDialog, MetaquestSetForm
- **Product History**: ProductHistoryTimeline, ProductHistoryStats, ProductHistoryDashboard
- **Location Tracking**: AssetLocationManager, AssetLocationDialog, LocationInventoryDashboard
- **Maintenance**: CompleteMaintenanceDialog, maintenance workflow components
- **Lens Requests**: LensRequestStats, approval workflow
- **User Management**: AccessCodeManager, UsersEquipmentManager, AdminQRDisplay
- **Product Types**: ProductTypeSelector, type management forms

## Security Configuration

### Middleware Protection (`middleware.ts`)
- JWT verification using `jose` library
- Role-based route protection
- Automatic redirects based on auth state
- Debug logging for troubleshooting

### Security Headers (next.config.ts)
```javascript
{
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

## Brand Guidelines

### Colors (CSS Variables in globals.css)
```css
--brand-primary: #1859A9;    /* Primary Blue */
--brand-orange: #FF8200;      /* Primary Orange */
--brand-secondary: #003087;   /* Secondary Blue */
--brand-orange-secondary: #F68629; /* Secondary Orange */
```

### Typography
- **Headings**: Roboto Condensed
- **Body Text**: Roboto
- **Responsive Scaling**: Using clamp() for fluid typography

## Testing & Development

### Local Development Setup
1. Copy `.env.example` to `.env.local`
2. Update `NEXT_PUBLIC_API_URL` for local backend
3. Run `npm install`
4. Run `npm run dev`
5. Access at `http://localhost:3001`

### Common Issues & Solutions
- **CORS Errors**: Check backend CORS configuration
- **Auth Token Issues**: Clear cookies and re-login
- **Middleware Loops**: Check redirect logic in middleware.ts
- **Build Errors**: Run `npm run lint` to identify issues

## Related Services

This client connects to:
- **centromundox-api-reservas**: Main NestJS backend (port 3000)
- **fx9600-control**: RFID cabinet controller
- **demo-impresion**: Label printing service

For full system documentation, see `/home/trilord243/tesis/CLAUDE.md`

## Server Actions Structure

Server actions are organized in `src/lib/actions/` by feature:
- `admin-products.ts` - Admin product management actions
- `auth.ts` - Server-side authentication actions
- `client-auth.ts` - Client authentication utilities
- `dashboard-stats.ts` - Dashboard statistics fetching
- `lens-requests.ts` - Equipment request workflow
- `maintenance.ts` - Equipment maintenance operations
- `products.ts` - Product CRUD operations
- `product-suggestions.ts` - AI-powered product suggestions
- `product-types.ts` - Product type management
- `whatsapp-actions.ts` - WhatsApp integration

## Cursor Rules

The project follows Cursor rules in `.cursor/rules/new.mdc`:
- Prefer interfaces over types
- Use const maps instead of enums
- Descriptive names with auxiliary verbs (isLoading, hasError)
- Event handlers prefixed with "handle"
- Favor React Server Components (RSC)
- Use `useActionState` instead of deprecated `useFormState`
- Always use async versions of runtime APIs (cookies, headers, params)
- Implement proper error boundaries
- Optimize for Web Vitals

## Additional Documentation

- `PRODUCT-HISTORY-SYSTEM.md` - Complete product history and audit trail system
- `DOCUMENTACION-FRONTEND.md` - Spanish frontend documentation
- `SISTEMA-AUTH-IMPLEMENTADO.md` - Authentication system details
- `DEMO-INTERACTIVO-RESERVAS.md` - Demo reservation flow
- `LANDING-BRAND-GUIDE.md` - Brand implementation guide
- `MODELO-ACTIVOS.md` - Asset management model
- `API-ENDPOINTS.md` - Complete API reference
- `EMAIL_VERIFICATION_API_DOCS.md` - Email verification flow
- `FRONTEND-INTEGRATION-EXAMPLES.md` - Integration examples
- `FRONTEND-PRODUCTS-API.md` - Products API documentation
- `FRONTEND-TYPES.ts` - TypeScript type definitions