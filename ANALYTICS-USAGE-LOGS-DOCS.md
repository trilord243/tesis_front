# Sistema de Analytics y Usage Logs - Documentación

## 📊 Descripción General

Sistema completo de analytics, logs de uso y métricas para administradores de CentroMundoX. Permite visualizar y analizar el uso de equipos, frecuencia de préstamos, estado del gabinete, y patrones de utilización.

---

## 🎯 Funcionalidades Implementadas

### 1. **Product Usage Logs** (Logs de Uso por Producto)

**Componente:** `product-usage-logs.tsx`
**Ubicación:** `src/components/admin/product-usage-logs.tsx`

**Características:**
- ✅ Resumen de uso total (horas, días, sesiones)
- ✅ Duración promedio de préstamo
- ✅ Estado actual (en uso / disponible)
- ✅ Uso por usuario con ranking
- ✅ Historial completo de checkouts y retornos
- ✅ Timeline con usuarios, fechas y duraciones
- ✅ Sesión más larga y más corta
- ✅ Notas de cada sesión

**Datos Mostrados:**
```typescript
- Uso Total: Horas y días acumulados
- Sesiones Totales: Cantidad de préstamos
- Duración Promedio: Tiempo promedio por sesión
- Estado Actual: En uso o disponible
- Usuario Actual: Si está prestado
- Ranking de Usuarios: Top usuarios por tiempo de uso
- Historial Detallado: Todos los checkouts con fechas
```

---

### 2. **Cabinet Analytics** (Analytics del Gabinete)

**Componente:** `cabinet-analytics.tsx`
**Ubicación:** `src/components/admin/cabinet-analytics.tsx`

**Características:**
- ✅ Total de productos en el sistema
- ✅ Productos en gabinete vs fuera
- ✅ Productos en uso activo
- ✅ Productos en mantenimiento
- ✅ Productos disponibles
- ✅ Tasa de ocupación del gabinete
- ✅ Lista detallada de productos en gabinete
- ✅ Lista detallada de productos fuera con usuarios
- ✅ Botón de actualización en tiempo real

**Métricas Principales:**
```typescript
- Total Productos: Inventario completo
- En Gabinete: Cantidad y porcentaje
- Fuera: Cantidad y porcentaje prestado
- En Uso: Productos activamente utilizados
- Mantenimiento: Equipos en reparación
- Disponibles: Listos para préstamo
- Ocupación: Tasa de ocupación del gabinete
```

---

### 3. **Loan Frequency Analytics** (Analytics de Frecuencia de Préstamos)

**Componente:** `loan-frequency-analytics.tsx`
**Ubicación:** `src/components/admin/loan-frequency-analytics.tsx`

**Características:**
- ✅ Total de solicitudes de préstamo
- ✅ Solicitudes aprobadas, rechazadas, pendientes
- ✅ Tasa de aprobación y rechazo
- ✅ Total de checkouts y retornos
- ✅ Préstamos activos actuales
- ✅ Duración promedio de préstamos
- ✅ Productos más solicitados (top 10)
- ✅ Productos más usados (top 10)
- ✅ Usuarios más activos (top 10)
- ✅ Productos menos utilizados
- ✅ Solicitudes por usuario con desglose
- ✅ Días pico de solicitudes

**Analytics Disponibles:**

**Solicitudes:**
```typescript
- Total Solicitudes: Todas las solicitudes históricas
- Aprobadas: Cantidad y tasa porcentual
- Rechazadas: Cantidad y tasa porcentual
- Pendientes: Solicitudes sin procesar
```

**Patrones de Uso:**
```typescript
- Total Checkouts: Préstamos completados
- Total Retornos: Equipos devueltos
- Préstamos Activos: Equipos actualmente prestados
- Duración Promedio: Tiempo promedio de préstamo
```

**Rankings:**
```typescript
- Productos Más Solicitados: Por cantidad de solicitudes
- Productos Más Usados: Por checkouts y horas
- Usuarios Más Activos: Por score de actividad
- Productos Menos Usados: Por días sin uso
```

---

### 4. **System Analytics Dashboard** (Dashboard Principal)

**Componente:** `system-analytics-dashboard.tsx`
**Ubicación:** `src/components/admin/system-analytics-dashboard.tsx`

**Características:**
- ✅ Interfaz con tabs (Vista General, Gabinete, Préstamos)
- ✅ Resumen rápido del período de análisis
- ✅ Acciones rápidas para navegación
- ✅ Vista combinada de gabinete y préstamos
- ✅ Botones de exportación (CSV, Excel) - preparados para implementación futura

**Tabs Disponibles:**
1. **Vista General:** Resumen ejecutivo con vistas rápidas
2. **Gabinete:** Analytics completo del gabinete RFID
3. **Préstamos:** Frecuencia y patrones de préstamos

---

## 🔧 Servicios API

### Analytics API Service

**Archivo:** `src/lib/api/usage-analytics.ts`

**Endpoints Implementados:**

```typescript
// Estadísticas de uso por producto
UsageAnalyticsService.getProductUsageStats(productId: string)
// GET /products/{productId}/usage-statistics

// Estadísticas de todos los productos
UsageAnalyticsService.getAllProductsUsageStats()
// GET /products/usage-statistics/all

// Estado del gabinete
UsageAnalyticsService.getCabinetStatus()
// GET /cabinet/status

// Analytics de frecuencia de préstamos
UsageAnalyticsService.getLoanFrequencyAnalytics(filters?: AnalyticsFilters)
// GET /analytics/loan-frequency

// Patrones de uso
UsageAnalyticsService.getUsagePatterns(filters?: AnalyticsFilters)
// GET /analytics/usage-patterns

// Analytics del sistema completo
UsageAnalyticsService.getSystemAnalytics(filters?: AnalyticsFilters)
// GET /analytics/system

// Métricas de utilización
UsageAnalyticsService.getProductUtilization(productId?: string)
// GET /analytics/utilization/{productId}
// GET /analytics/utilization

// Analytics de mantenimiento
UsageAnalyticsService.getMaintenanceAnalytics(filters?: AnalyticsFilters)
// GET /analytics/maintenance

// Tracking de checkout
UsageAnalyticsService.trackCheckout(productId, userId, notes?)
// POST /products/{productId}/track-checkout

// Tracking de retorno
UsageAnalyticsService.trackReturn(productId, userId, notes?)
// POST /products/{productId}/track-return

// Productos en gabinete
UsageAnalyticsService.getProductsInCabinet()
// Wrapper sobre getCabinetStatus()

// Productos fuera del gabinete
UsageAnalyticsService.getProductsOutsideCabinet()
// Wrapper sobre getCabinetStatus()

// Exportación (preparado para implementación futura)
UsageAnalyticsService.exportAnalytics(format: 'csv' | 'excel' | 'pdf', filters?)
// GET /analytics/export
```

---

## 📝 Tipos TypeScript

### Archivo: `src/types/usage-analytics.ts`

**Interfaces Principales:**

```typescript
// Sesión de uso individual
interface UsageSession {
  userId: string
  userEmail: string
  userName?: string
  checkoutTime: string
  returnTime?: string
  durationMinutes?: number
  notes?: string
}

// Estadísticas de uso de un producto
interface ProductUsageStatistics {
  productId: string
  productName: string
  serialNumber: string
  totalUsageMinutes: number
  totalUsageHours: number
  totalUsageDays: number
  sessionCount: number
  currentlyCheckedOut: boolean
  lastCheckoutTime?: string
  lastCheckoutUser?: { id, email, name }
  usageHistory: UsageSession[]
  usageByUser: Array<{ userId, userEmail, userName, totalMinutes, sessionCount }>
  averageSessionDuration: number
  longestSession?: UsageSession
  shortestSession?: UsageSession
}

// Estado del gabinete
interface CabinetStatus {
  totalProducts: number
  productsInCabinet: number
  productsOutside: number
  productsInUse: number
  productsMaintenance: number
  productsAvailable: number
  cabinetOccupancyRate: number
  productsInCabinetList: Product[]
  productsOutsideList: Product[]
}

// Analytics de frecuencia de préstamos
interface LoanFrequencyAnalytics {
  totalLoanRequests: number
  approvedRequests: number
  rejectedRequests: number
  pendingRequests: number
  approvalRate: number
  rejectionRate: number
  requestsByProduct: Array<{ productId, productName, requestCount, approvedCount, rejectedCount }>
  requestsByUser: Array<{ userId, userEmail, userName, requestCount, approvedCount, rejectedCount }>
  requestsByTimeRange: Array<{ date, count, approved, rejected }>
  averageApprovalTime?: number
  peakRequestDays: string[]
  mostRequestedProducts: Array<{ productId, productName, count }>
}

// Patrones de uso
interface UsagePatterns {
  totalCheckouts: number
  totalReturns: number
  activeLoans: number
  averageLoanDuration: number
  checkoutsByDay: Array<{ day, count }>
  checkoutsByHour: Array<{ hour, count }>
  checkoutsByProduct: Array<{ productId, productName, checkoutCount, totalUsageHours, utilizationRate }>
  checkoutsByUser: Array<{ userId, userEmail, userName, checkoutCount, totalUsageHours }>
  mostActiveUsers: Array<{ userId, userEmail, userName, activityScore }>
  leastUsedProducts: Array<{ productId, productName, lastUsed, daysSinceLastUse }>
  mostUsedProducts: Array<{ productId, productName, totalCheckouts, totalHours }>
}

// Analytics del sistema completo
interface SystemAnalytics {
  overview: { totalProducts, totalUsers, totalLoanRequests, totalCheckouts, activeLoans, productsInMaintenance }
  timeRange: { startDate, endDate }
  cabinetStatus: CabinetStatus
  usagePatterns: UsagePatterns
  loanFrequency: LoanFrequencyAnalytics
  topMetrics: { mostPopularProduct, mostActiveUser, averageLoanDuration, equipmentUtilizationRate }
}

// Filtros de analytics
interface AnalyticsFilters {
  dateRange?: { startDate: string, endDate: string }
  productIds?: string[]
  userIds?: string[]
  includeCompleted?: boolean
  includeActive?: boolean
  includeCancelled?: boolean
}

// Métrica de utilización de producto
interface ProductUtilizationMetric {
  productId: string
  productName: string
  totalAvailableHours: number
  totalUsedHours: number
  utilizationPercentage: number
  idleTime: number
  maintenanceTime: number
  checkoutCount: number
  averageSessionLength: number
}

// Analytics de mantenimiento
interface MaintenanceAnalytics {
  totalMaintenanceEvents: number
  averageMaintenanceDuration: number
  totalMaintenanceCost: number
  maintenanceByType: Array<{ type, count, averageCost, averageDuration }>
  productsInMaintenance: number
  upcomingMaintenanceCount: number
  mostMaintenedProducts: Array<{ productId, productName, maintenanceCount, totalCost }>
}
```

---

## 🚀 Cómo Usar

### Para Administradores:

#### 1. **Ver Analytics del Sistema**
```
Navegación: Admin Menu → Analytics
URL: /admin/analytics
```

**Tabs Disponibles:**
- **Vista General**: Resumen ejecutivo con accesos rápidos
- **Gabinete**: Estado del inventario en tiempo real
- **Préstamos**: Análisis de frecuencia y patrones

#### 2. **Ver Usage Logs de un Producto**
```
1. Ir a: Admin Menu → Activos
2. Hacer clic en "Ver Detalles" (ícono de ojo) en cualquier producto
3. En el modal, seleccionar la pestaña "Uso y Logs"
```

**Información Disponible:**
- Resumen de uso (horas totales, sesiones, duración promedio)
- Estado actual del equipo
- Ranking de usuarios por tiempo de uso
- Historial completo de préstamos con fechas y usuarios
- Sesiones más larga y más corta

#### 3. **Ver Historial de Producto**
```
1. Ir a: Admin Menu → Activos
2. Hacer clic en "Ver Detalles" en cualquier producto
3. En el modal, seleccionar la pestaña "Historial"
```

**Información Disponible:**
- Timeline de eventos (30+ tipos de eventos)
- Estadísticas de eventos
- Usuarios activos
- Filtros por tipo, severidad, fecha

---

## 📍 Estructura de Archivos

```
src/
├── types/
│   └── usage-analytics.ts          # Interfaces TypeScript
├── lib/
│   └── api/
│       └── usage-analytics.ts      # Servicio API
├── components/
│   └── admin/
│       ├── product-usage-logs.tsx              # Logs de uso por producto
│       ├── cabinet-analytics.tsx               # Analytics del gabinete
│       ├── loan-frequency-analytics.tsx        # Analytics de préstamos
│       ├── system-analytics-dashboard.tsx      # Dashboard principal
│       └── product-details-dialog.tsx          # Modal actualizado con tabs
├── app/
│   └── admin/
│       └── analytics/
│           └── page.tsx            # Página de analytics
└── components/
    └── layout/
        └── navbar.tsx              # Navbar actualizada con link a Analytics
```

---

## 🎨 Diseño UI/UX

### Componentes Visuales:

**Cards de Métricas:**
- Iconos coloridos representando cada métrica
- Números grandes para valores principales
- Texto secundario con contexto adicional
- Colores consistentes por categoría

**Listas de Productos/Usuarios:**
- Bordes redondeados con hover effects
- Badges para estados y valores
- Información detallada con sub-texto
- Ordenamiento por relevancia

**Timeline de Historial:**
- Iconos de calendario para cada entrada
- Separadores visuales entre entradas
- Información del usuario destacada
- Badges para duración
- Notas en itálica cuando existan

**Tabs Interface:**
- Navegación clara entre secciones
- Contenido lazy-loaded por tab
- Estados de carga uniformes
- Manejo de errores consistente

### Paleta de Colores:

```css
Azul (Información):    bg-blue-100, text-blue-600
Verde (Éxito):         bg-green-100, text-green-600
Naranja (Advertencia): bg-orange-100, text-orange-600
Rojo (Error):          bg-red-100, text-red-600
Morado (Usuarios):     bg-purple-100, text-purple-600
Emerald (Disponible):  bg-emerald-100, text-emerald-600
Amarillo (Pendiente):  bg-yellow-100, text-yellow-600
```

---

## 🔄 Flujo de Datos

```
Usuario Admin → Página Analytics
                    ↓
        SystemAnalyticsDashboard
                    ↓
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
CabinetAnalytics  LoanFrequency  (otros)
    ↓               ↓
UsageAnalyticsService (API)
    ↓
Backend Endpoints:
  - /cabinet/status
  - /analytics/loan-frequency
  - /analytics/usage-patterns
  - /products/{id}/usage-statistics
    ↓
MongoDB Collections:
  - products (usageHistory)
  - lens_requests
  - cabinet
  - product_history
```

---

## ⚠️ Requisitos del Backend

Para que estas funcionalidades trabajen correctamente, el backend debe implementar:

### Endpoints Requeridos:

```typescript
✅ Implementados (según backend existente):
- GET  /products/{id}/usage-statistics
- GET  /products/usage-statistics/all
- GET  /cabinet/status
- POST /products/{id}/track-checkout
- POST /products/{id}/track-return

❌ Por Implementar en Backend:
- GET  /analytics/loan-frequency
- GET  /analytics/usage-patterns
- GET  /analytics/system
- GET  /analytics/utilization
- GET  /analytics/utilization/{productId}
- GET  /analytics/maintenance
- GET  /analytics/export
```

### Estructura de Datos en MongoDB:

**Collection: products**
```javascript
{
  _id: ObjectId,
  nombre: string,
  serialNumber: string,
  // ... otros campos ...

  // CAMPOS DE USO (implementados en backend):
  totalUsageMinutes: number,
  lastCheckoutTime: Date,
  lastCheckoutUser: { id, email, name },
  usageHistory: [
    {
      userId: string,
      userEmail: string,
      userName: string,
      checkoutTime: Date,
      returnTime: Date,
      durationMinutes: number,
      notes: string
    }
  ]
}
```

**Collection: lens_requests**
```javascript
{
  _id: ObjectId,
  userId: string,
  products: [productId],
  estado: 'aprobado' | 'rechazado' | 'pendiente',
  createdAt: Date,
  approvedAt: Date,
  // ... otros campos ...
}
```

---

## 📊 Métricas Clave Disponibles

### Por Producto:
- ✅ Tiempo total de uso (minutos, horas, días)
- ✅ Número de sesiones/préstamos
- ✅ Duración promedio por sesión
- ✅ Usuarios que han usado el equipo
- ✅ Estado actual (disponible/en uso)
- ✅ Usuario actual (si está prestado)
- ✅ Sesión más larga registrada
- ✅ Sesión más corta registrada
- ✅ Historial completo con fechas

### Gabinete:
- ✅ Total de productos en inventario
- ✅ Cantidad en gabinete vs fuera
- ✅ Tasa de ocupación del gabinete
- ✅ Productos en uso activo
- ✅ Productos en mantenimiento
- ✅ Productos disponibles
- ✅ Listas detalladas con usuarios asignados

### Préstamos:
- ✅ Total de solicitudes históricas
- ✅ Tasas de aprobación/rechazo
- ✅ Solicitudes pendientes
- ✅ Total de checkouts realizados
- ✅ Préstamos activos actuales
- ✅ Duración promedio de préstamo
- ✅ Productos más solicitados
- ✅ Productos más usados
- ✅ Usuarios más activos
- ✅ Productos con bajo uso
- ✅ Días pico de solicitudes

---

## 🚀 Próximas Mejoras (Futuras)

### Funcionalidades por Implementar:

1. **Exportación de Datos**
   - ✅ Botones preparados en UI
   - ❌ Implementación de exportación a CSV
   - ❌ Implementación de exportación a Excel
   - ❌ Implementación de exportación a PDF

2. **Gráficos y Visualizaciones**
   - ❌ Gráfico de línea para uso a lo largo del tiempo
   - ❌ Gráfico de barras para comparación entre productos
   - ❌ Gráfico circular para distribución de uso
   - ❌ Heatmap de días/horas pico de uso

3. **Filtros Avanzados**
   - ❌ Filtro por rango de fechas personalizado
   - ❌ Filtro por productos específicos
   - ❌ Filtro por usuarios específicos
   - ❌ Filtro por estado de préstamo

4. **Alertas y Notificaciones**
   - ❌ Alerta de productos con bajo uso
   - ❌ Alerta de usuarios con préstamos vencidos
   - ❌ Notificación de productos que requieren mantenimiento
   - ❌ Alertas de ocupación del gabinete

5. **Analytics Predictivos**
   - ❌ Predicción de demanda de equipos
   - ❌ Estimación de mantenimiento futuro
   - ❌ Análisis de tendencias de uso
   - ❌ Recomendaciones de compra de equipos

---

## 📚 Referencias

- **Product History System:** Ver `PRODUCT-HISTORY-SYSTEM.md`
- **Backend API:** Ver documentación en `centromundox-api-reservas`
- **Frontend Types:** `src/types/usage-analytics.ts`
- **Componentes Admin:** `src/components/admin/`

---

## 💡 Notas Importantes

1. **Autenticación:** Todos los endpoints requieren autenticación de administrador
2. **Caché:** Los datos se actualizan en tiempo real con botón de refresh
3. **Performance:** Las listas están limitadas a top 10 para mejor rendimiento
4. **Responsive:** Todos los componentes son responsive y mobile-friendly
5. **Estados de Error:** Manejo consistente de errores con mensajes claros
6. **Loading States:** Indicadores visuales durante carga de datos

---

**Creado:** 2025-10-22
**Versión:** 1.0
**Autor:** Sistema CentroMundoX
