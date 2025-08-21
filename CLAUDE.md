# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern Next.js 15 client application for Centro Mundo X reservation system, built with React 19, TypeScript, Tailwind CSS v4, and Shadcn UI components. The app uses server-side authentication with JWT tokens and connects to a backend API for user management, product reservations, and lens requests.

## Development Commands

```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code (run after making changes)
npm run lint

# Add Shadcn UI components
npm run ui:add [component-name]
```

**Important**: Always run `npm run lint` after making changes to ensure code quality and fix any linting issues before considering a task complete.

## Authentication Architecture

The application uses a JWT-based authentication system with Next.js middleware:

- **Server Actions**: All auth operations in `src/lib/auth.ts` use "use server" directive
- **Middleware**: Route protection in `middleware.ts` handles auth redirects
- **Cookie-based**: JWT tokens stored in secure HTTP-only cookies
- **API Integration**: Backend at `http://localhost:3000` (configurable via `NEXT_PUBLIC_API_URL`)

### Protected Routes
- `/dashboard` - Requires authentication
- `/profile` - Requires authentication  
- `/reservations` - Requires authentication

### Auth Routes (redirect to dashboard if authenticated)
- `/auth/login`
- `/auth/register`

## Key Architecture Patterns

### Server Components First
- Default to React Server Components
- Minimize "use client" usage
- Async components for data fetching
- Error boundaries with `src/components/ui/error-boundary.tsx`

### Authentication Flow
1. Login/register via server actions in `src/lib/auth.ts`
2. JWT stored in secure cookies
3. Middleware validates routes in `middleware.ts`
4. Server actions handle API communication

### Component Structure
```
src/components/
├── auth/           # Auth-related components
├── dashboard/      # Dashboard-specific components  
├── layout/         # Header, footer, navigation
├── sections/       # Landing page sections
└── ui/            # Reusable UI components (Shadcn)
```

## TypeScript Configuration

- Strict TypeScript enabled
- Interfaces preferred over types
- Server action return types defined in `src/types/auth.ts`
- Async API patterns with proper error handling

## API Integration

Backend API documented in `DOCUMENTACION-FRONTEND.md` provides:
- User management and authentication
- Product inventory and reservations
- Lens request system
- Admin functionality

Key endpoints:
- `POST /auth/login` - Authentication
- `GET /products` - Product catalog
- `POST /reservations` - Create reservations
- `POST /lens-requests` - Request lens access

## Brand Guidelines

The application strictly follows Centro Mundo X brand guidelines:
- **Primary Blue**: `#1859A9` 
- **Primary Orange**: `#FF8200`
- **Secondary Blue**: `#003087`
- **Secondary Orange**: `#F68629`
- **Fonts**: Roboto and Roboto Condensed

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3000)
- `JWT_SECRET` - JWT signing secret

## Code Style Guidelines

The project follows the conventions defined in `.cursor/rules/new.mdc`:
- Functional and declarative patterns
- Named exports for components
- Event handlers prefixed with "handle"
- Server Components where possible
- Proper TypeScript interfaces (preferred over types)
- Modern Next.js 15 patterns with async params/searchParams
- Use `useActionState` instead of deprecated `useFormState`
- Always use async versions of runtime APIs (cookies, headers, params, searchParams)
- Const maps instead of enums
- Descriptive names with auxiliary verbs (isLoading, hasError)

## Development Notes

- Uses Turbopack for faster development builds
- Error boundaries implemented for production stability
- Middleware handles authentication state management
- Server actions provide type-safe API integration
- Shadcn UI system provides consistent component library

## Critical Implementation Details

### Async API Pattern (Next.js 15)
When working with Next.js 15 runtime APIs, always use the async versions:
```typescript
// Correct - async versions
const cookieStore = await cookies();
const headersList = await headers();
const params = await props.params;
const searchParams = await props.searchParams;
```

### Authentication Implementation
- JWT tokens stored in secure HTTP-only cookies (`auth-token`)
- Middleware in `middleware.ts` protects routes and handles redirects
- Server actions in `src/lib/auth.ts` handle all auth operations
- Cookie options configured for security (httpOnly, secure in production, sameSite: lax)

## Pending Tasks

- agregar el endpoint