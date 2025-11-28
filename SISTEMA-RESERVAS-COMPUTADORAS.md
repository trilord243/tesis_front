# Sistema de Reservas de Computadoras de Laboratorio

## 📋 Resumen del Sistema

Sistema completo para gestionar reservas de computadoras de alto rendimiento en el laboratorio CentroMundoX. Permite a usuarios (profesores, estudiantes) solicitar bloques horarios específicos y a administradores aprobar/rechazar solicitudes. **Los bloques solo se bloquean cuando el administrador aprueba la reserva.**

---

## 🎯 Características Principales

### Para Usuarios:
1. **Formulario Multi-Paso** de reserva con 5 pasos:
   - Tipo de usuario (Profesor, Estudiante, Otro)
   - Software requerido (Unity, Autodesk, Blender, Ansys, Otro)
   - Propósito (Tesis, Clases, Trabajo Industrial, Minor)
   - Descripción del proyecto (mínimo 20 caracteres)
   - Calendario con selección de fechas y bloques

2. **Calendario Interactivo**:
   - Solo permite seleccionar días válidos (Lunes, Martes, Jueves, Viernes)
   - Muestra disponibilidad en tiempo real
   - Máximo 2 bloques por día
   - Validación de conflictos

3. **Historial de Reservas**:
   - Ver todas las solicitudes (pendientes, aprobadas, rechazadas)
   - Información detallada de cada reserva
   - Estados visuales con colores

### Para Administradores:
1. **Dashboard Completo**:
   - Estadísticas (Total, Pendientes, Aprobadas, Rechazadas)
   - Filtros por estado y búsqueda por usuario
   - Vista de todas las solicitudes

2. **Gestión de Solicitudes**:
   - Revisar detalles completos
   - Aprobar o rechazar con razón
   - **Al aprobar: los bloques se bloquean automáticamente**

---

## 📅 Bloques Horarios

| Bloque | Hora Inicio | Hora Fin  | Duración |
|--------|-------------|-----------|----------|
| 1      | 07:00 AM    | 08:45 AM  | 1h 45min |
| 2      | 08:45 AM    | 10:30 AM  | 1h 45min |
| 3      | 10:30 AM    | 12:15 PM  | 1h 45min |
| 4      | 12:15 PM    | 02:00 PM  | 1h 45min |
| 5      | 02:00 PM    | 03:45 PM  | 1h 45min |
| 6      | 03:45 PM    | 05:30 PM  | 1h 45min |

**Días Válidos**: Lunes, Martes, Jueves, Viernes
**Límite por Usuario**: Máximo 2 bloques por día

---

## 🔒 Sistema de Bloqueo (IMPORTANTE)

### ✅ Regla de Disponibilidad:

**Los bloques SOLO se bloquean cuando un administrador APRUEBA una reserva.**

#### Flujo Completo:

```
1. Usuario A solicita: Viernes 13 Oct, Bloque 1 (7:00-8:45)
   → Estado: PENDING
   → Bloque 1 sigue DISPONIBLE para otros usuarios

2. Usuario B solicita: Viernes 13 Oct, Bloque 1 (7:00-8:45)
   → Estado: PENDING
   → ✅ PERMITIDO (ambos en PENDING)

3. Admin aprueba solicitud de Usuario A
   → Estado Usuario A: APPROVED
   → ❌ Bloque 1 del Viernes 13 BLOQUEADO

4. Admin intenta aprobar solicitud de Usuario B
   → ❌ ERROR: "El bloque 07:00-08:45 en la fecha 2025-10-13 ya está reservado"
   → Debe rechazarla

5. Usuario C intenta reservar Viernes 13, Bloque 1
   → ❌ ERROR: No disponible (ya aprobado para Usuario A)

6. Usuario C intenta reservar Viernes 13, Bloque 2
   → ✅ PERMITIDO (Bloque 2 aún disponible)
```

---

## 🗂️ Estructura del Código

### Backend (NestJS)

```
centromundox-api-reservas/src/lab-reservations/
├── lab-reservation.entity.ts       # Entidad MongoDB
├── lab-reservations.service.ts     # Lógica de negocio
├── lab-reservations.controller.ts  # Endpoints API
├── lab-reservations.module.ts      # Módulo NestJS
└── dto/
    ├── create-lab-reservation.dto.ts
    ├── update-lab-reservation.dto.ts
    └── filter-lab-reservation.dto.ts
```

**Importado en**: `app.module.ts` línea 53

### Frontend (Next.js)

```
tesis_front/src/
├── types/
│   └── lab-reservation.ts                  # Tipos TypeScript
├── app/
│   ├── api/lab-reservations/
│   │   ├── route.ts                        # CRUD principal
│   │   ├── my-reservations/route.ts        # Mis reservas
│   │   └── availability/[date]/route.ts    # Disponibilidad
│   ├── dashboard/
│   │   ├── reservar-lab/page.tsx           # Crear reserva (USUARIO)
│   │   └── mis-reservas-lab/page.tsx       # Historial (USUARIO)
│   └── admin/
│       └── reservas-lab/page.tsx           # Dashboard (ADMIN)
└── components/lab-reservations/
    ├── lab-calendar-selector.tsx           # Calendario interactivo
    ├── lab-reservation-form.tsx            # Formulario multi-paso
    └── admin-reservation-dialog.tsx        # Modal admin
```

---

## 🌐 Endpoints de API

### Backend (http://localhost:3000)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/lab-reservations` | Crear reserva | User |
| GET | `/lab-reservations` | Listar todas (con filtros) | Admin |
| GET | `/lab-reservations/my-reservations` | Mis reservas | User |
| GET | `/lab-reservations/availability/:date` | Ver disponibilidad | User |
| PATCH | `/lab-reservations/:id` | Aprobar/Rechazar | Admin |
| DELETE | `/lab-reservations/:id` | Eliminar | Admin |

### Frontend API Routes (http://localhost:3001)

| Endpoint | Descripción |
|----------|-------------|
| `/api/lab-reservations` | Proxy a backend (CRUD) |
| `/api/lab-reservations/my-reservations` | Mis reservas |
| `/api/lab-reservations/availability/[date]` | Disponibilidad |

---

## 🚀 Cómo Usar el Sistema

### Para Usuarios:

1. **Acceder a la página de reservas**:
   ```
   http://localhost:3001/dashboard/reservar-lab
   ```

2. **Completar el formulario** (5 pasos):
   - Paso 1: Seleccionar tipo de usuario
   - Paso 2: Seleccionar software(s) necesarios
   - Paso 3: Indicar propósito
   - Paso 4: Escribir descripción (mínimo 20 caracteres)
   - Paso 5: Seleccionar fechas y bloques con el calendario

3. **Ver historial de reservas**:
   ```
   http://localhost:3001/dashboard/mis-reservas-lab
   ```

### Para Administradores:

1. **Acceder al dashboard admin**:
   ```
   http://localhost:3001/admin/reservas-lab
   ```

2. **Filtrar solicitudes**:
   - Por estado (Pendientes, Aprobadas, Rechazadas)
   - Por nombre/email del usuario

3. **Revisar y aprobar/rechazar**:
   - Click en una solicitud
   - Ver todos los detalles
   - Aprobar (bloquea los bloques) o Rechazar (con razón)

---

## ⚙️ Validaciones Implementadas

### En el Backend (lab-reservations.service.ts):

1. **Validación de Días**:
   - Solo Lunes, Martes, Jueves, Viernes
   - Verifica que el día de la semana coincida con la fecha

2. **Validación de Bloques**:
   - Máximo 2 bloques por día
   - Bloques válidos (1-6)

3. **Validación de Fechas**:
   - Solo fechas futuras
   - Formato YYYY-MM-DD

4. **Validación de Disponibilidad**:
   - Busca reservas APROBADAS para la fecha
   - Detecta conflictos por bloque específico
   - Bloquea solo si hay una reserva APROBADA

5. **Validación de Usuario**:
   - Usuario debe existir en la base de datos
   - Email válido

### En el Frontend:

1. **Calendario**:
   - Deshabilita días no válidos
   - Deshabilita fechas pasadas
   - Muestra disponibilidad en tiempo real

2. **Formulario**:
   - Validación paso a paso
   - No permite avanzar sin completar
   - Descripción mínimo 20 caracteres
   - Al menos 1 software seleccionado
   - Al menos 1 slot de tiempo

---

## 💾 Modelo de Datos

### Entidad LabReservation

```typescript
{
  _id: ObjectId,
  userId: string,
  userName: string,
  userEmail: string,
  userType: "profesor" | "estudiante" | "otro",
  software: ["unity", "autodesk", "blender", "ansys", "otro"],
  otherSoftware?: string,
  purpose: "tesis" | "clases" | "trabajo_industrial" | "minor",
  description: string,
  requestedSlots: [
    {
      date: "2025-11-13",  // YYYY-MM-DD
      dayOfWeek: "viernes",
      blocks: ["07:00-08:45", "08:45-10:30"]
    }
  ],
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled",
  approvedBy?: string,
  approvedAt?: Date,
  rejectionReason?: string,
  rejectedBy?: string,
  rejectedAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 UI/UX

### Componentes Principales:

1. **LabCalendarSelector**:
   - Calendario con react-day-picker
   - Muestra disponibilidad por bloque
   - Checkboxes para selección de bloques
   - Vista de resumen de slots seleccionados

2. **LabReservationForm**:
   - Progress indicator (5 pasos)
   - Navegación paso a paso
   - Validación en tiempo real
   - Feedback visual

3. **AdminReservationDialog**:
   - Modal completo con detalles
   - Botones de Aprobar/Rechazar
   - Campo de razón de rechazo
   - Alertas de advertencia

### Estados Visuales:

| Estado | Color | Badge |
|--------|-------|-------|
| Pending | Amarillo | `bg-yellow-100 text-yellow-800` |
| Approved | Verde | `bg-green-100 text-green-800` |
| Rejected | Rojo | `bg-red-100 text-red-800` |
| Completed | Azul | `bg-blue-100 text-blue-800` |
| Cancelled | Gris | `bg-gray-100 text-gray-800` |

---

## 🧪 Testing del Sistema

### Escenario 1: Usuario Crea Reserva

```bash
# Iniciar backend
cd centromundox-api-reservas
npm run start:dev

# Iniciar frontend
cd tesis_front
PORT=3001 npm run dev

# Navegar a:
http://localhost:3001/dashboard/reservar-lab

# Completar formulario:
1. Tipo: Estudiante
2. Software: Unity, Blender
3. Propósito: Tesis
4. Descripción: "Desarrollo de aplicación VR para mi tesis de grado..."
5. Calendario: Seleccionar Lunes 11 Nov, Bloques 1 y 2
```

### Escenario 2: Admin Aprueba Reserva

```bash
# Navegar a:
http://localhost:3001/admin/reservas-lab

# Pasos:
1. Ver lista de solicitudes pendientes
2. Click en una solicitud
3. Revisar detalles
4. Click en "Aprobar"
5. ✅ Bloque queda BLOQUEADO
```

### Escenario 3: Verificar Bloqueo

```bash
# Usuario 2 intenta reservar mismo bloque:
http://localhost:3001/dashboard/reservar-lab

# Seleccionar: Lunes 11 Nov, Bloque 1
# Resultado: ❌ "No Disponible" (en rojo, no se puede seleccionar)

# Seleccionar: Lunes 11 Nov, Bloque 3
# Resultado: ✅ "Disponible" (puede reservar)
```

---

## 📊 Flujo de Estados

```
PENDING
  ├─→ APPROVED (admin aprueba) → COMPLETED (después del uso)
  └─→ REJECTED (admin rechaza con razón)
      └─→ CANCELLED (admin cancela después)
```

---

## 🔧 Configuración Requerida

### Backend:

1. MongoDB debe estar corriendo
2. Módulo `LabReservationsModule` importado en `app.module.ts`
3. JWT authentication configurado

### Frontend:

1. Variables de entorno:
   ```env
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

2. Dependencias instaladas:
   ```bash
   npm install react-day-picker date-fns
   ```

---

## 📁 Archivos Creados

### Backend (7 archivos):
1. `src/lab-reservations/lab-reservation.entity.ts`
2. `src/lab-reservations/lab-reservations.service.ts`
3. `src/lab-reservations/lab-reservations.controller.ts`
4. `src/lab-reservations/lab-reservations.module.ts`
5. `src/lab-reservations/dto/create-lab-reservation.dto.ts`
6. `src/lab-reservations/dto/update-lab-reservation.dto.ts`
7. `src/lab-reservations/dto/filter-lab-reservation.dto.ts`

### Frontend (13 archivos):
1. `src/types/lab-reservation.ts`
2. `src/app/api/lab-reservations/route.ts`
3. `src/app/api/lab-reservations/my-reservations/route.ts`
4. `src/app/api/lab-reservations/availability/[date]/route.ts`
5. `src/app/dashboard/reservar-lab/page.tsx`
6. `src/app/dashboard/mis-reservas-lab/page.tsx`
7. `src/app/admin/reservas-lab/page.tsx`
8. `src/components/lab-reservations/lab-calendar-selector.tsx`
9. `src/components/lab-reservations/lab-reservation-form.tsx`
10. `src/components/lab-reservations/admin-reservation-dialog.tsx`
11. `src/components/ui/calendar.tsx`
12. `src/components/ui/radio-group.tsx`
13. Este documento

---

## ✅ Checklist de Implementación

- [x] Backend: Entity con todos los campos
- [x] Backend: DTOs con validaciones
- [x] Backend: Service con lógica de bloqueo
- [x] Backend: Controller con endpoints
- [x] Backend: Módulo importado en AppModule
- [x] Backend: Compilación exitosa
- [x] Frontend: Tipos TypeScript completos
- [x] Frontend: API routes proxy
- [x] Frontend: Calendario interactivo
- [x] Frontend: Formulario multi-paso
- [x] Frontend: Página de usuario
- [x] Frontend: Página de historial
- [x] Frontend: Dashboard admin
- [x] Frontend: Modal de aprobación/rechazo
- [x] Validación de disponibilidad en tiempo real
- [x] Sistema de bloqueo por aprobación
- [x] Documentación completa

---

## 🎓 Próximos Pasos Sugeridos

1. **Notificaciones por Email**:
   - Enviar email cuando se aprueba/rechaza
   - Recordatorios antes del bloque reservado

2. **Integración con Calendario Google/Outlook**:
   - Exportar reservas aprobadas a calendario

3. **Dashboard de Uso**:
   - Estadísticas de uso por software
   - Usuarios más activos
   - Bloques más populares

4. **Sistema de Cancelación**:
   - Permitir al usuario cancelar reservas
   - Liberar bloques automáticamente

5. **Gestión de Recursos**:
   - Asignar computadoras específicas
   - Estado de mantenimiento

---

## 📞 Soporte

Para preguntas o problemas:
1. Revisar este documento
2. Verificar logs del backend
3. Verificar console del navegador
4. Revisar archivos CLAUDE.md en cada proyecto

---

**Sistema Creado**: 7 de Noviembre de 2025
**Versión**: 1.0.0
**Estado**: ✅ Completo y Funcional
