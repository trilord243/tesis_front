# Documentación de Endpoints - CentroMundoX API

Esta documentación describe todos los endpoints disponibles en la API de CentroMundoX, incluyendo los cuerpos de las peticiones, respuestas y ejemplos de uso.

**Base URL:** `http://localhost:3000`
**Documentación Swagger:** `http://localhost:3000/api/docs`

---

## 🔐 Authentication Endpoints

### POST `/auth/login`
**Descripción:** Iniciar sesión con email y contraseña  
**Autenticación:** Ninguna (público)  
**Método:** POST

#### Request Body
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

#### Response (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Errores Comunes
- `401 Unauthorized`: Credenciales inválidas
- `401 Unauthorized`: Código de acceso expirado (solo usuarios normales)

---

## 👤 User Management Endpoints

### GET `/users`
**Descripción:** Obtener todos los usuarios  
**Autenticación:** JWT Bearer Token requerido  
**Método:** GET

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Juan",
    "lastName": "Pérez",
    "email": "juan@ejemplo.com",
    "cedula": "12345678",
    "equipos_reservados": [],
    "codigo_acceso": "ABC123",
    "expectedTags": [],
    "missingTags": [],
    "presentTags": [],
    "registrationDate": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "role": "user",
    "accessCodeExpiresAt": "2025-12-31T23:59:59.000Z"
  }
]
```

### GET `/users/:id`
**Descripción:** Obtener usuario específico por ID  
**Autenticación:** JWT Bearer Token requerido  
**Método:** GET

#### Response (200 OK)
```json
{
  "email": "juan@ejemplo.com",
  "lastName": "Pérez"
}
```

### POST `/users`
**Descripción:** Crear un nuevo usuario (registro público)  
**Autenticación:** Ninguna (público)  
**Método:** POST

#### Request Body
```json
{
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan@ejemplo.com",
  "cedula": "12345678",
  "password": "contraseña123",
  "equipos_reservados": [],
  "expectedTags": [],
  "missingTags": [],
  "presentTags": []
}
```

#### Response (201 Created)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan@ejemplo.com",
  "cedula": "12345678",
  "equipos_reservados": [],
  "codigo_acceso": "",
  "expectedTags": [],
  "missingTags": [],
  "presentTags": [],
  "registrationDate": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "role": "user"
}
```

### DELETE `/users/:id`
**Descripción:** Eliminar usuario por ID  
**Autenticación:** JWT Bearer Token requerido  
**Método:** DELETE

#### Response (200 OK)
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

---

## 🛡️ Admin Endpoints

### PATCH `/admin/users/:id/access-expiration`
**Descripción:** Establecer fecha de expiración del código de acceso para un usuario  
**Autenticación:** JWT Bearer Token + Rol Admin requeridos  
**Método:** PATCH

#### Request Body
```json
{
  "days": 30,
  "weeks": 4,
  "months": 2,
  "accessCode": "CUSTOM123"
}
```

#### Response (200 OK)
```json
{
  "message": "Expiración de código de acceso actualizada",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "accessCodeExpiresAt": "2025-03-15T23:59:59.000Z",
    "codigo_acceso": "CUSTOM123"
  }
}
```

---

## 📦 Product Management Endpoints

### GET `/products`
**Descripción:** Obtener todos los productos  
**Autenticación:** Ninguna (público)  
**Método:** GET

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "MetaQuest 3",
    "serialNumber": "MQ3-12345",
    "hexValue": "340ED438683005F43C937791",
    "type": "headset",
    "isAvailable": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "codigo": "MQ001"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Controller Izquierdo MQ3",
    "serialNumber": "CTRL-L-67890",
    "hexValue": "340ED438683005F43C937792",
    "type": "controller",
    "headsetId": "507f1f77bcf86cd799439011",
    "isAvailable": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### GET `/products/cabinet-inventory`
**Descripción:** Obtener productos disponibles en el gabinete  
**Autenticación:** Ninguna (público)  
**Método:** GET

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "MetaQuest 3",
    "serialNumber": "MQ3-12345",
    "hexValue": "340ED438683005F43C937791",
    "type": "headset",
    "isAvailable": true
  }
]
```

### POST `/products`
**Descripción:** Crear un producto individual  
**Autenticación:** JWT Bearer Token + Rol Admin requeridos  
**Método:** POST

#### Request Body - Headset
```json
{
  "name": "MetaQuest 3",
  "serialNumber": "MQ3-12345",
  "type": "headset"
}
```

#### Request Body - Controller
```json
{
  "name": "Controller derecho MQ3",
  "serialNumber": "CTRL-R-67890",
  "type": "controller",
  "headsetId": "507f1f77bcf86cd799439011"
}
```

#### Response (201 Created)
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "MetaQuest 3",
  "serialNumber": "MQ3-12345",
  "hexValue": "340ED438683005F43C937793",
  "type": "headset",
  "isAvailable": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### POST `/products/metaquest-set`
**Descripción:** Crear un set completo MetaQuest (headset + 2 controllers)  
**Autenticación:** JWT Bearer Token + Rol Admin requeridos  
**Método:** POST

#### Request Body
```json
{
  "headsetName": "MetaQuest 3",
  "headsetSerialNumber": "MQ3-12345",
  "controllers": [
    {
      "serialNumber": "CTRL-L-67890"
    },
    {
      "serialNumber": "CTRL-R-67891"
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "headset": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "MetaQuest 3",
    "serialNumber": "MQ3-12345",
    "type": "headset",
    "hexValue": "340ED438683005F43C937794",
    "isAvailable": true
  },
  "controllers": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "name": "Controller Izquierdo MQ3-12345",
      "serialNumber": "CTRL-L-67890",
      "type": "controller",
      "headsetId": "507f1f77bcf86cd799439014",
      "hexValue": "340ED438683005F43C937795"
    },
    {
      "_id": "507f1f77bcf86cd799439016",
      "name": "Controller Derecho MQ3-12345",
      "serialNumber": "CTRL-R-67891",
      "type": "controller",
      "headsetId": "507f1f77bcf86cd799439014",
      "hexValue": "340ED438683005F43C937796"
    }
  ]
}
```

### GET `/products/hex/:value`
**Descripción:** Buscar producto por valor hexadecimal EPC  
**Autenticación:** Ninguna (público)  
**Método:** GET

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "MetaQuest 3",
  "serialNumber": "MQ3-12345",
  "hexValue": "340ED438683005F43C937791",
  "type": "headset",
  "isAvailable": true
}
```

---

## 🥽 Lens Request Endpoints

### POST `/lens-requests`
**Descripción:** Crear una nueva solicitud de lentes  
**Autenticación:** JWT Bearer Token requerido  
**Método:** POST

#### Request Body
```json
{
  "requestReason": "Necesito los lentes para mi proyecto de investigación en realidad virtual"
}
```

#### Response (201 Created)
```json
{
  "_id": "507f1f77bcf86cd799439017",
  "userId": "507f1f77bcf86cd799439011",
  "userName": "Juan Pérez",
  "userEmail": "juan@ejemplo.com",
  "requestReason": "Necesito los lentes para mi proyecto de investigación en realidad virtual",
  "status": "pending",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### GET `/lens-requests/my-requests`
**Descripción:** Obtener todas las solicitudes del usuario autenticado  
**Autenticación:** JWT Bearer Token requerido  
**Método:** GET

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439017",
    "userId": "507f1f77bcf86cd799439011",
    "userName": "Juan Pérez",
    "userEmail": "juan@ejemplo.com",
    "requestReason": "Necesito los lentes para mi proyecto de investigación",
    "status": "approved",
    "accessCode": "XYZ123",
    "expiresAt": "2025-02-01T23:59:59.000Z",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z",
    "processedAt": "2025-01-01T12:00:00.000Z",
    "processedBy": "admin@ejemplo.com"
  }
]
```

### GET `/lens-requests/admin`
**Descripción:** Obtener todas las solicitudes (solo administradores)  
**Autenticación:** JWT Bearer Token + Rol Admin requeridos  
**Método:** GET  
**Query Parameters:** `status` (opcional), `userId` (opcional)

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439017",
    "userId": "507f1f77bcf86cd799439011",
    "userName": "Juan Pérez",
    "userEmail": "juan@ejemplo.com",
    "requestReason": "Necesito los lentes para mi proyecto de investigación",
    "status": "pending",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### GET `/lens-requests/:id`
**Descripción:** Obtener una solicitud por ID  
**Autenticación:** JWT Bearer Token requerido  
**Método:** GET

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439017",
  "userId": "507f1f77bcf86cd799439011",
  "userName": "Juan Pérez",
  "userEmail": "juan@ejemplo.com",
  "requestReason": "Necesito los lentes para mi proyecto de investigación",
  "status": "approved",
  "accessCode": "XYZ123",
  "expiresAt": "2025-02-01T23:59:59.000Z",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z",
  "processedAt": "2025-01-01T12:00:00.000Z",
  "processedBy": "admin@ejemplo.com"
}
```

### PATCH `/lens-requests/:id`
**Descripción:** Actualizar una solicitud (solo administradores)  
**Autenticación:** JWT Bearer Token + Rol Admin requeridos  
**Método:** PATCH

#### Request Body - Aprobar Solicitud
```json
{
  "status": "approved",
  "accessCode": "CUSTOM123",
  "expiration": {
    "days": 30,
    "weeks": 0,
    "months": 0
  }
}
```

#### Request Body - Rechazar Solicitud
```json
{
  "status": "rejected",
  "rejectionReason": "Falta información en la solicitud"
}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439017",
  "status": "approved",
  "accessCode": "CUSTOM123",
  "expiresAt": "2025-01-31T23:59:59.000Z",
  "processedAt": "2025-01-01T12:00:00.000Z",
  "processedBy": "admin@ejemplo.com"
}
```

### DELETE `/lens-requests/:id`
**Descripción:** Eliminar una solicitud (solo administradores)  
**Autenticación:** JWT Bearer Token + Rol Admin requeridos  
**Método:** DELETE

#### Response (200 OK)
```json
{
  "message": "Solicitud eliminada exitosamente"
}
```

---

## 📅 Reservation Endpoints (⚠️ NO ACTIVOS)
*Nota: Estos endpoints están implementados pero el ReservationsModule no está importado en AppModule, por lo que no están disponibles actualmente.*

### POST `/reservations`
**Descripción:** Crear una nueva reserva  
**Autenticación:** JWT Bearer Token requerido  
**Método:** POST

#### Request Body - Reserva en Sala
```json
{
  "productCode": "340ED438683005F43C937791",
  "type": "in_room",
  "requestReason": "Necesito usar el equipo para mi proyecto de tesis",
  "requestedDate": "2025-01-25T09:00:00.000Z"
}
```

#### Request Body - Reserva Externa
```json
{
  "productCode": "340ED438683005F43C937791",
  "type": "external",
  "requestReason": "Presentación en conferencia externa de la universidad",
  "requestedDate": "2025-01-25T08:00:00.000Z",
  "expectedReturnDate": "2025-01-25T18:00:00.000Z"
}
```

### GET `/reservations`
**Descripción:** Obtener todas las reservas (solo administradores)  
**Autenticación:** JWT Bearer Token + Rol Admin requeridos  
**Método:** GET  
**Query Parameters:** `status`, `type`, `userId`, `productCode` (todos opcionales)

### GET `/reservations/my-reservations`
**Descripción:** Obtener mis reservas  
**Autenticación:** JWT Bearer Token requerido  
**Método:** GET

### GET `/reservations/:id`
**Descripción:** Obtener una reserva por ID  
**Autenticación:** JWT Bearer Token requerido  
**Método:** GET

### PATCH `/reservations/:id`
**Descripción:** Actualizar una reserva (solo administradores)  
**Autenticación:** JWT Bearer Token + Rol Admin requeridos  
**Método:** PATCH

#### Request Body - Aprobar Reserva
```json
{
  "status": "approved",
  "startDate": "2025-01-25T09:00:00.000Z",
  "expectedReturnDate": "2025-01-25T17:00:00.000Z"
}
```

#### Request Body - Completar Reserva
```json
{
  "status": "completed",
  "actualReturnDate": "2025-01-25T16:45:00.000Z"
}
```

### DELETE `/reservations/:id`
**Descripción:** Eliminar una reserva (solo administradores)  
**Autenticación:** JWT Bearer Token + Rol Admin requeridos  
**Método:** DELETE

---

## 🏠 General Endpoints

### GET `/`
**Descripción:** Endpoint de salud de la aplicación  
**Autenticación:** Ninguna (público)  
**Método:** GET

#### Response (200 OK)
```json
"Hello World!"
```

---

## 🔒 Autenticación

### Bearer Token
La mayoría de endpoints requieren autenticación mediante JWT Bearer Token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles
- **user**: Usuario normal con acceso limitado
- **admin**: Administrador con acceso completo

---

## 📝 Notas Importantes

1. **Códigos de Estado HTTP Comunes:**
   - `200 OK`: Operación exitosa
   - `201 Created`: Recurso creado exitosamente
   - `400 Bad Request`: Datos de entrada inválidos
   - `401 Unauthorized`: Token JWT inválido o faltante
   - `403 Forbidden`: Sin permisos suficientes (rol inadecuado)
   - `404 Not Found`: Recurso no encontrado
   - `500 Internal Server Error`: Error interno del servidor

2. **Fechas:** Todas las fechas utilizan formato ISO 8601 (ejemplo: `2025-01-25T09:00:00.000Z`)

3. **IDs de MongoDB:** Utilizan formato ObjectId de MongoDB (ejemplo: `507f1f77bcf86cd799439011`)

4. **Validaciones:**
   - Longitudes mínimas en campos de texto
   - Validación de enums para status y tipos
   - Validación de formatos de email y fechas

5. **Módulos Inactivos:** El módulo de Reservations está completamente implementado pero no activo en la aplicación actual.

6. **Documentación Swagger:** Para una exploración interactiva de la API, visita `http://localhost:3000/api/docs`