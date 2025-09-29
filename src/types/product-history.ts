export enum EventType {
  // Ciclo de vida básico
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",

  // Movimientos y ubicación
  LOCATION_CHANGED = "LOCATION_CHANGED",
  ZONE_ASSIGNED = "ZONE_ASSIGNED",
  ZONE_RETURNED = "ZONE_RETURNED",
  CABINET_IN = "CABINET_IN",
  CABINET_OUT = "CABINET_OUT",

  // Reservas y préstamos
  RESERVED = "RESERVED",
  RESERVATION_CANCELLED = "RESERVATION_CANCELLED",
  CHECKED_OUT = "CHECKED_OUT",
  CHECKED_IN = "CHECKED_IN",
  LOAN_REQUESTED = "LOAN_REQUESTED",
  LOAN_APPROVED = "LOAN_APPROVED",
  LOAN_REJECTED = "LOAN_REJECTED",
  LOAN_RETURNED = "LOAN_RETURNED",

  // Mantenimiento
  MAINTENANCE_STARTED = "MAINTENANCE_STARTED",
  MAINTENANCE_COMPLETED = "MAINTENANCE_COMPLETED",
  REPAIR_REQUESTED = "REPAIR_REQUESTED",
  REPAIR_COMPLETED = "REPAIR_COMPLETED",

  // Estado y disponibilidad
  STATUS_CHANGED = "STATUS_CHANGED",
  MADE_AVAILABLE = "MADE_AVAILABLE",
  MADE_UNAVAILABLE = "MADE_UNAVAILABLE",

  // RFID y tracking
  RFID_TAG_ASSIGNED = "RFID_TAG_ASSIGNED",
  RFID_TAG_CHANGED = "RFID_TAG_CHANGED",
  RFID_DETECTED = "RFID_DETECTED",
  RFID_LOST = "RFID_LOST",

  // Seguridad
  UNAUTHORIZED_MOVEMENT = "UNAUTHORIZED_MOVEMENT",
  SECURITY_ALERT = "SECURITY_ALERT",
  AUTHORIZATION_EXPIRED = "AUTHORIZATION_EXPIRED",

  // Usuarios y asignaciones
  USER_ASSIGNED = "USER_ASSIGNED",
  USER_UNASSIGNED = "USER_UNASSIGNED",
  OWNER_CHANGED = "OWNER_CHANGED",

  // Sistema
  SYSTEM_SCAN = "SYSTEM_SCAN",
  INVENTORY_CHECK = "INVENTORY_CHECK",
  DATA_SYNC = "DATA_SYNC",

  // Otros
  NOTE_ADDED = "NOTE_ADDED",
  CUSTOM_EVENT = "CUSTOM_EVENT"
}

export enum EventSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
  SUCCESS = "SUCCESS"
}

export interface ProductHistoryEvent {
  _id: string;
  productId: string;
  eventType: EventType;
  severity: EventSeverity;
  timestamp: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  description: string;
  details?: Record<string, unknown>;
  metadata?: {
    // Información de ubicación
    previousLocation?: string;
    newLocation?: string;
    zone?: string;
    cabinet?: string;

    // Información de estado
    previousStatus?: string;
    newStatus?: string;
    previousAvailability?: boolean;
    newAvailability?: boolean;

    // Información de RFID
    rfidTag?: string;
    previousRfidTag?: string;
    detectedBy?: string;
    signalStrength?: number;

    // Información de reserva/préstamo
    reservationId?: string;
    loanRequestId?: string;
    checkoutTime?: string;
    expectedReturnTime?: string;
    actualReturnTime?: string;

    // Información de mantenimiento
    maintenanceType?: string;
    technician?: string;
    cost?: number;
    repairNotes?: string;

    // Información de seguridad
    alertType?: string;
    sourceIp?: string;
    coordinates?: { lat: number; lng: number };

    // Cambios realizados (para actualizaciones)
    changes?: Array<{
      field: string;
      oldValue: unknown;
      newValue: unknown;
    }>;

    // Cualquier otra información relevante
    [key: string]: unknown;
  };
  source?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  isSystemGenerated: boolean;
  relatedEventIds?: string[];
  tags?: string[];
}

export interface ProductHistoryResponse {
  events: ProductHistoryEvent[];
  total: number;
}

export interface ProductHistoryStats {
  totalEvents: number;
  eventsByType: Array<{ type: EventType; count: number }>;
  eventsBySeverity: Array<{ severity: EventSeverity; count: number }>;
  lastEvent?: ProductHistoryEvent;
  firstEvent?: ProductHistoryEvent;
  activeUsers: Array<{ userId: string; userName?: string; eventCount: number }>;
}

export interface ProductHistoryFilters {
  eventTypes?: EventType[];
  severity?: EventSeverity[];
  startDate?: string;
  endDate?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

// Interface para crear eventos de historial
export interface CreateHistoryEventDto {
  productId: string;
  eventType: EventType;
  severity?: EventSeverity;
  userId?: string;
  userName?: string;
  userEmail?: string;
  description: string;
  details?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
  isSystemGenerated?: boolean;
  tags?: string[];
}