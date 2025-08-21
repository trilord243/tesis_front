# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Centro Mundo X Equipment Management System - A comprehensive full-stack solution for managing high-end VR equipment and research facilities. The system integrates RFID tracking, smart cabinet control, label printing, and user access management.

### System Components

- **client-backup**: Next.js 15 frontend with React 19, TypeScript, Tailwind CSS v4
- **centromundox-api-reservas**: NestJS backend API with MongoDB, JWT auth, RFID tracking
- **fx9600-control-**: RFID cabinet controller embedded on FX9600 reader
- **demo-impresion**: ZPL label printing service for RFID tags
- **CC600-entranceFront**: React 19 + Vite frontend for entrance authentication (EnterpriseBrowser kiosk app)

## Architecture

```
/home/trilord243/tesis/
├── client-backup/              # Main Web Client (Next.js 15)
│   ├── src/app/               # App Router pages
│   ├── src/components/        # React components
│   └── middleware.ts          # Route protection
├── centromundox-api-reservas/  # Main API (NestJS)
│   ├── src/auth/              # JWT authentication
│   ├── src/products/          # Equipment inventory
│   ├── src/cabinet/           # Cabinet tracking
│   └── src/zones/             # Zone management
├── fx9600-control-/           # RFID Cabinet Controller
│   ├── index.js              # Main server entry
│   ├── main.js               # Door control & RFID
│   └── mongo.js              # MongoDB connection
├── demo-impresion/            # Label Printing Service
│   ├── printer.js            # TCP printer connection
│   └── server.js             # EPC generation API
└── CC600-entranceFront/       # Entrance Frontend (React)
```

## Development Commands

### Full Stack Development

```bash
# Start all services (from centromundox-api-reservas)
cd centromundox-api-reservas
npm run dev:all              # Starts API + Client

# Individual services
cd client-backup && npm run dev        # Client on :3001
cd centromundox-api-reservas && npm run start:dev  # API on :3000
cd fx9600-control- && npm start        # Cabinet controller
cd demo-impresion && npm run server    # Print service on :3000
cd CC600-entranceFront && npm run dev  # Entrance UI (Vite on :5173)
```

### Code Quality (ALWAYS run after changes)

```bash
# Client (Next.js)
cd client-backup
npm run lint

# API (NestJS)
cd centromundox-api-reservas
npm run lint
npm run format

# Entrance Frontend (Vite)
cd CC600-entranceFront
npm run lint
```

### Testing

```bash
# API Tests
cd centromundox-api-reservas
npm run test              # Unit tests
npm run test:e2e         # End-to-end tests
npm run test:cov         # Coverage report

# Manual API Testing
# Use .http files in centromundox-api-reservas/
# Available test files:
# - auth-examples.http
# - admin-product-examples.http
# - reservations-examples.http
# - test-lens-request-email.http
# - test-user-registration.http
```

### Building for Production

```bash
# Client (Next.js)
cd client-backup
npm run build            # Creates .next/ production build
npm start                # Runs production server

# Entrance Frontend (Vite)
cd CC600-entranceFront
npm run build            # Creates dist/ production build
npm run preview          # Preview production build
```

### Admin Operations

```bash
cd centromundox-api-reservas
npm run create-admin     # Create admin user
```

## System Integration Flow

### Equipment Check-out/Check-in

1. **User Authentication** (client-backup → centromundox-api-reservas)
   - JWT-based login with role management
   - Access code generation with expiration

2. **Cabinet Access** (fx9600-control)
   - User enters access code → Door unlocks
   - RFID scans on door close → Inventory update
   - Automatic check-out/check-in detection

3. **Label Printing** (demo-impresion)
   - Generate GIAI-96 EPC codes for new equipment
   - Print RFID labels via TCP to Zebra printers

4. **Real-time Tracking** (centromundox-api-reservas)
   - Cabinet inventory synchronization
   - Zone assignment tracking
   - User equipment reservations

## Key Technologies

### Frontend Stack
- **Next.js 15**: App Router with Server Components
- **React 19**: Latest features including useActionState
- **TypeScript**: Strict mode with interfaces
- **Tailwind CSS v4**: Design tokens system
- **Shadcn UI**: Component library

### Backend Stack
- **NestJS**: Modular architecture with decorators
- **MongoDB**: Document database with TypeORM
- **JWT**: Bearer token authentication
- **Swagger**: Auto-generated API documentation

### Hardware Integration
- **FX9600 RFID Reader**: Real-time tag scanning
- **Zebra Printers**: ZPL command printing
- **GPIO Control**: Door locks and sensors
- **GIAI-96 EPC**: RFID tag encoding standard

## API Endpoints

### Main API (centromundox-api-reservas)

```
Base URL: http://localhost:3000
Swagger: http://localhost:3000/api/docs

Authentication:
POST /auth/login              # Get JWT token
GET /users                    # List users (auth required)

Equipment:
GET /products                 # List all equipment
POST /products/metaquest-set  # Create VR set (admin)
GET /products/hex/:value      # Find by RFID tag

Access Requests:
POST /lens-requests           # Request equipment access
PATCH /lens-requests/:id      # Approve/reject (admin)

Cabinet:
GET /cabinet/status           # Current inventory
POST /cabinet/sync            # Update inventory
```

### Cabinet Controller (fx9600-control-)

```
POST /login                   # Authenticate & open door
POST /return                  # Initialize return process
GET /status                   # Cabinet inventory
POST /confirm                 # Manual check-out
```

### Print Service (demo-impresion)

```
POST /generate-epc            # Generate & print label
POST /generate-epc-only       # Generate code only
```

## Database Schema

### Core Collections

**Users** (MongoDB)
- Authentication credentials
- Role (admin/user)
- Access codes with expiration
- Equipment reservations
- RFID tag expectations

**Products** (MongoDB)
- VR headsets and controllers
- RFID tags (hexValue in GIAI-96)
- Serial numbers
- Availability status
- Zone assignments

**Cabinet** (MongoDB)
- Real-time tag inventory
- Version control for updates
- Products inside/outside tracking

## Security Configuration

### JWT Authentication
```env
JWT_SECRET=your-secret-key    # Strong secret required
```

### CORS Configuration
- localhost:3000 (API)
- localhost:3001 (Client dev)

### Cookie Settings
- httpOnly: true
- secure: true (production)
- sameSite: 'lax'

## Code Style Guidelines

### TypeScript/JavaScript
- Prefer interfaces over types
- Use const maps instead of enums
- Descriptive names with auxiliary verbs (isLoading, hasError)
- Event handlers prefixed with "handle"
- Modern async/await patterns

### React/Next.js
- Server Components by default
- Minimize "use client" directives
- Use async runtime APIs (cookies, headers, params)
- useActionState instead of deprecated useFormState
- Error boundaries for production stability

### NestJS
- Modular architecture with clear separation
- Custom decorators and interceptors
- DTOs with class-validator
- Guard-based authorization
- One export per file

## Brand Guidelines

### Centro Mundo X Colors
- Primary Blue: `#1859A9`
- Primary Orange: `#FF8200`
- Secondary Blue: `#003087`
- Secondary Orange: `#F68629`

### Typography
- Roboto (body text)
- Roboto Condensed (headings)

## Environment Variables

### Client (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

### API (.env)
```env
PORT=3000
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb+srv://...
NODE_ENV=development
```

## Common Tasks

### Adding New API Endpoints
1. Create DTO with validation decorators
2. Add controller method with guards
3. Implement service layer
4. Add Swagger documentation
5. Update client server actions
6. Test with .http files

### Adding UI Components
1. Use Shadcn CLI: `npm run ui:add [component]`
2. Follow Server Component patterns
3. Add TypeScript interfaces
4. Test responsive behavior

### RFID Tag Management
1. Generate EPC with demo-impresion service
2. Print label on Zebra printer
3. Register in products collection
4. Assign to zone if needed
5. Track in cabinet inventory

## Troubleshooting

### Common Issues
- **CORS Errors**: Check API CORS configuration
- **JWT Expiration**: Verify token expiration logic
- **MongoDB Connection**: Check connection string
- **RFID Reader**: Ensure FX9600 is accessible
- **Printer Connection**: Verify IP and port 9100

### Debug Tools
- Swagger UI: `/api/docs`
- HTTP test files in API directory
- NestJS logger for all environments
- Middleware debug logs for auth state

## Important Notes

1. **Always run linting** after code changes before considering tasks complete
2. **ReservationsModule** in API is implemented but not active - add to AppModule imports if needed
3. **Token blacklisting** uses in-memory storage - implement Redis for production
4. **MongoDB URIs** are hardcoded in some modules - should be moved to environment variables
5. **RFID scanning** operates in 5-second windows for tag accumulation
6. **Door control**: LOW = open, HIGH = locked
7. **CC600-entranceFront** runs on EnterpriseBrowser kiosk with Config.xml configuration
8. **Vite proxy** configured for Shelly device at 10.105.1.198 in CC600-entranceFront
9. **Build outputs**: 
   - client-backup: `.next/` directory
   - CC600-entranceFront: `dist/` directory