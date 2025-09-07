// 🔷 Frontend TypeScript Definitions
// Tipos TypeScript para la integración del frontend con la API de productos

export interface Product {
  _id: string;
  name: string;
  serialNumber: string;
  hexValue: string;
  type: ProductType;
  
  // Campos básicos
  createdAt: Date;
  updatedAt: Date;
  isAvailable: boolean;
  codigo?: string;
  productTypeId?: string;
  tags: string[];
  allTags: string[];
  
  // Información del asset
  descripcion?: string;
  marca?: string;
  modelo?: string;
  epc?: string;
  estado: string; // nuevo, usado, reacondicionado
  
  // Ubicación y estado
  ubicacionFisica: string;
  estadoUbicacion: EstadoUbicacion;
  edificio?: string;
  piso?: string;
  oficina?: string;
  departamento?: string;
  centroCosto?: string;
  
  // Información financiera
  precioCompra: number;
  moneda: string;
  metodoDepreciacion: string;
  
  // Fechas importantes
  fechaCompra?: Date;
  tieneGarantia: boolean;
  garantiaInicio?: Date;
  garantiaFin?: Date;
  
  // Información de garantía
  garantiaTipo?: string;
  garantiaProveedor?: string;
  garantiaContacto?: string;
  garantiaTelefono?: string;
  garantiaCobertura?: string;
  
  // Información de compra
  proveedor?: string;
  numeroFactura?: string;
  numeroOrdenCompra?: string;
  metodoPago?: string;
  terminos?: string;
  
  // Documentación
  imagenPrincipal?: string;
  facturaURL?: string;
  manualURL?: string;
  
  // Usuario actual
  zone?: string;
  currentUser?: string;
  
  // Historial de mantenimiento
  maintenanceHistory: MaintenanceRecord[];
  
  // Historial de ubicaciones
  locationHistory: LocationRecord[];
  
  // Tracking de uso
  totalUsageMinutes: number;
  lastCheckoutTime?: Date;
  lastCheckoutUser?: string;
  usageHistory: UsageRecord[];
  
  // Préstamo temporal
  temporaryLoanId?: string;
  borrowerName?: string;
  borrowerInfo?: string;
  
  // Autorización
  authorizedUntil?: Date;
}

export type ProductType = 
  | "headset" 
  | "controller" 
  | "tracker" 
  | "accessory" 
  | "other";

export type EstadoUbicacion = 
  | "available"        // Disponible en cabinet
  | "in_use"          // En uso dentro del metaverso
  | "maintenance"     // En mantenimiento
  | "authorized_out"  // Autorizado fuera del metaverso
  | "retired";        // Dado de baja

export interface MaintenanceRecord {
  date: Date;
  type: string;
  description: string;
  expectedReturn?: Date | null;
  actualReturn?: Date | null;
  technician?: string;
  cost?: number;
  notes?: string;
}

export interface LocationRecord {
  date: Date;
  fromLocation: string;
  toLocation: string;
  movedBy: string;
  reason?: string;
}

export interface UsageRecord {
  userId: string;
  userEmail: string;
  checkoutTime: Date;
  returnTime?: Date;
  durationMinutes?: number;
  notes?: string;
}

// Resumen de ubicaciones
export interface LocationSummary {
  location: string;
  count: number;
}

// Usuario básico
export interface User {
  _id: string;
  name: string;
  email: string;
  codigo_acceso: string;
  role: "admin" | "user";
  equipos_reservados?: string[];
  accessCodeExpiration?: Date;
}

// Respuesta de producto con usuario
export interface ProductUserResponse {
  product: Product;
  user: User | null;
  message: string;
}

// Alertas de mantenimiento
export interface MaintenanceAlert {
  _id: string;
  type: AlertType;
  status: AlertStatus;
  severity: AlertSeverity;
  title: string;
  message: string;
  
  // Producto involucrado
  productId: string;
  productHexValue: string;
  productName: string;
  
  // Usuario involucrado
  userId: string;
  userCode: string;
  userName: string;
  
  // Metadatos
  metadata?: {
    maintenanceType?: string;
    expectedReturn?: Date;
    adminWhoAcknowledged?: string;
    resolutionNotes?: string;
    [key: string]: any;
  };
  
  // Fechas
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export type AlertType = 
  | "unauthorized_maintenance_removal"
  | "maintenance_overdue"
  | "equipment_damage";

export type AlertStatus = 
  | "active"
  | "acknowledged"
  | "resolved";

export type AlertSeverity = 
  | "low"
  | "medium"
  | "high"
  | "critical";

// DTOs para requests
export interface ProductFilters {
  location?: string;
  userCode?: string;
  status?: EstadoUbicacion;
  type?: ProductType;
  inMaintenance?: boolean;
}

export interface LocationSearchQuery {
  q: string; // Query de búsqueda
}

export interface MaintenanceAlertsQuery {
  status?: AlertStatus;
  severity?: AlertSeverity;
  type?: AlertType;
  limit?: number;
  offset?: number;
}

// Respuestas de la API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface MaintenanceAlertsResponse {
  alerts: MaintenanceAlert[];
  total: number;
  filters: any;
}

// Estados de UI
export interface UIState {
  loading: boolean;
  error: string | null;
  selectedLocation: string;
  searchQuery: string;
  userCode: string;
  filters: ProductFilters;
}

// Funciones de utilidad para tipos
export const ProductTypeLabels: Record<ProductType, string> = {
  headset: "Visor VR",
  controller: "Controlador",
  tracker: "Rastreador",
  accessory: "Accesorio",
  other: "Otro"
};

export const EstadoUbicacionLabels: Record<EstadoUbicacion, string> = {
  available: "Disponible",
  in_use: "En Uso",
  maintenance: "Mantenimiento",
  authorized_out: "Fuera (Autorizado)",
  retired: "Dado de Baja"
};

export const EstadoUbicacionColors: Record<EstadoUbicacion, { bg: string; text: string; border: string }> = {
  available: { 
    bg: "bg-green-100", 
    text: "text-green-800", 
    border: "border-green-200" 
  },
  in_use: { 
    bg: "bg-blue-100", 
    text: "text-blue-800", 
    border: "border-blue-200" 
  },
  maintenance: { 
    bg: "bg-orange-100", 
    text: "text-orange-800", 
    border: "border-orange-200" 
  },
  authorized_out: { 
    bg: "bg-purple-100", 
    text: "text-purple-800", 
    border: "border-purple-200" 
  },
  retired: { 
    bg: "bg-red-100", 
    text: "text-red-800", 
    border: "border-red-200" 
  }
};

export const AlertSeverityColors: Record<AlertSeverity, { bg: string; text: string; border: string }> = {
  low: { 
    bg: "bg-gray-100", 
    text: "text-gray-800", 
    border: "border-gray-200" 
  },
  medium: { 
    bg: "bg-yellow-100", 
    text: "text-yellow-800", 
    border: "border-yellow-200" 
  },
  high: { 
    bg: "bg-orange-100", 
    text: "text-orange-800", 
    border: "border-orange-200" 
  },
  critical: { 
    bg: "bg-red-100", 
    text: "text-red-800", 
    border: "border-red-200" 
  }
};

// Funciones de transformación
export function formatLocation(location: string): string {
  const locationMap: Record<string, string> = {
    "Cabinet - Laboratorio del Metaverso": "🏠 Cabinet Metaverso",
    "En Uso - Laboratorio del Metaverso": "🔄 En Uso Metaverso",
    "Fuera del Metaverso": "🌍 Fuera del Metaverso",
    "En Mantenimiento": "🔧 Mantenimiento"
  };
  
  return locationMap[location] || location;
}

export function getProductStatusIcon(status: EstadoUbicacion): string {
  const iconMap: Record<EstadoUbicacion, string> = {
    available: "✅",
    in_use: "🔄",
    maintenance: "🔧",
    authorized_out: "🌍",
    retired: "❌"
  };
  
  return iconMap[status] || "❓";
}

export function isProductInMaintenance(product: Product): boolean {
  if (!product.maintenanceHistory || product.maintenanceHistory.length === 0) {
    return false;
  }

  const lastMaintenance = product.maintenanceHistory
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (lastMaintenance.expectedReturn && !lastMaintenance.actualReturn) {
    const expectedReturn = new Date(lastMaintenance.expectedReturn);
    const now = new Date();
    return now <= expectedReturn;
  }

  return false;
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return 'hace unos segundos';
}

// Type guards
export function isProduct(obj: any): obj is Product {
  return obj && typeof obj._id === 'string' && typeof obj.name === 'string';
}

export function isUser(obj: any): obj is User {
  return obj && typeof obj._id === 'string' && typeof obj.email === 'string';
}

export function isMaintenanceAlert(obj: any): obj is MaintenanceAlert {
  return obj && typeof obj._id === 'string' && typeof obj.type === 'string';
}