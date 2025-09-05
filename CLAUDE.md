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
│   └── demo-reserva/     # Demo reservation process
├── components/
│   ├── auth/            # Auth forms and buttons
│   ├── admin/           # Admin-specific components
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
# Development
npm run dev              # Runs on http://localhost:3001 with Turbopack

# Production
npm run build           # Creates .next/ production build  
npm start               # Runs production server (PORT env var supported)

# Code Quality (ALWAYS run after making changes)
npm run lint            # Next.js linting with ESLint 9

# UI Components
npm run ui:add [component]  # Add Shadcn UI component via CLI
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
- Path aliases: `@/*` → `./src/*`

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
4. **API Proxy Pattern**: Never call backend directly from client components - use `/api/*` routes
5. **Turbopack**: Development uses `--turbopack` flag for faster builds
6. **React 19**: Use `useActionState` instead of deprecated `useFormState`
7. **Server Components Default**: Use Server Components unless client interactivity needed
8. **Port Configuration**: Development runs on 3001 to avoid conflict with API (3000)
9. **Production API**: Configured for Heroku backend deployment

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

### User Dashboard (`/dashboard`)
- **Profile Management**: User information and settings
- **Equipment Requests**: Submit and track lens requests
- **QR Code Access**: Display access codes for cabinet
- **Reservation History**: View past and current reservations

### Admin Interface (`/admin`)
- **Asset Management** (`/admin/activos`): Complete inventory CRUD
- **Request Approval** (`/admin/solicitudes`): Review and approve lens requests
- **User Management** (`/admin/usuarios`): User administration
- **Product Types** (`/admin/tipos-activos`): Category and tag management
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
- **Navbar**: Responsive with role-based menu items
- **Footer**: Brand information and links
- **LoginForm/RegisterForm**: Authentication forms
- **QRCodeDisplay**: Access code visualization
- **ProductCard**: Equipment display cards

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

## Additional Documentation

- `DOCUMENTACION-FRONTEND.md` - Spanish frontend documentation
- `SISTEMA-AUTH-IMPLEMENTADO.md` - Authentication system details
- `DEMO-INTERACTIVO-RESERVAS.md` - Demo reservation flow
- `LANDING-BRAND-GUIDE.md` - Brand implementation guide
- `MODELO-ACTIVOS.md` - Asset management model
- `API-ENDPOINTS.md` - Complete API reference
- `EMAIL_VERIFICATION_API_DOCS.md` - Email verification flow