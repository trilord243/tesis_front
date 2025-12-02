// Enums matching backend
export enum UserType {
  PROFESOR = 'profesor',
  ESTUDIANTE = 'estudiante',
  CFD = 'cfd',
  ESTUDIANTE_CENTRO_MUNDO_X = 'estudiante_centro_mundo_x',
  OTRO = 'otro',
}

export enum UserGroup {
  NORMAL = 'normal',
  CENTROMUNDOX = 'centromundox',
  CFD = 'cfd',
}

export enum Software {
  UNITY = 'unity',
  AUTODESK = 'autodesk',
  BLENDER = 'blender',
  ANSYS = 'ansys',
  OTRO = 'otro',
}

export enum Purpose {
  TESIS = 'tesis',
  CLASES = 'clases',
  TRABAJO_INDUSTRIAL = 'trabajo_industrial',
  MINOR = 'minor',
}

// Bloques horarios disponibles (1h 45min cada uno)
export enum TimeBlock {
  BLOCK_1 = '07:00-08:45',
  BLOCK_2 = '08:45-10:30',
  BLOCK_3 = '10:30-12:15',
  BLOCK_4 = '12:15-14:00',
  BLOCK_5 = '14:00-15:45',
  BLOCK_6 = '15:45-17:30',
}

export const VALID_TIME_BLOCKS = Object.values(TimeBlock);

export enum DayOfWeek {
  LUNES = 1,
  MARTES = 2,
  MIERCOLES = 3,
  JUEVES = 4,
  VIERNES = 5,
}

export const VALID_DAYS = [DayOfWeek.LUNES, DayOfWeek.MARTES, DayOfWeek.MIERCOLES, DayOfWeek.JUEVES, DayOfWeek.VIERNES] as const;

// TimeSlot represents a specific date with selected time blocks
export interface TimeSlot {
  readonly date: string; // YYYY-MM-DD
  readonly dayOfWeek: DayOfWeek;
  readonly blocks: TimeBlock[];
}

export enum ReservationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Interfaces
export interface Computer {
  readonly _id: string;
  readonly number: number; // 1-9
  readonly name: string;
  readonly cpu: string;
  readonly gpu: string;
  readonly ram: string;
  readonly storage: string;
  readonly software: readonly string[];
  readonly specialization: string;
  readonly description: string;
  readonly isAvailable: boolean;
  readonly maintenanceNotes: string;
  readonly accessLevel: 'normal' | 'special'; // DEPRECATED: Use allowedUserTypes instead
  readonly allowedUserTypes: readonly string[]; // Lista de tipos de usuario permitidos. Si está vacío, todos pueden acceder
  readonly gridRow: number; // Posición en el plano: fila (0 = arriba)
  readonly gridCol: number; // Posición en el plano: columna (0 = izquierda)
  readonly createdAt: string;
  readonly updatedAt: string;
}

// Patrón de recurrencia para reservas semanales
export interface RecurrencePattern {
  readonly startDate: string; // YYYY-MM-DD - Fecha de inicio
  readonly daysOfWeek: readonly number[]; // [1, 3, 5] = Lunes, Miércoles, Viernes (1=Lun, 5=Vie)
  readonly numberOfWeeks: number; // Máximo 4 semanas
}

export interface LabReservation {
  readonly _id: string;
  readonly userId: string;
  readonly userName: string;
  readonly userEmail: string;
  // Ahora es string para aceptar valores dinámicos de lab-config
  readonly userType: string;
  readonly software: readonly string[];
  readonly otherSoftware?: string;
  readonly purpose: string;
  readonly description: string;
  // Campos de reserva
  readonly reservationDate: string; // YYYY-MM-DD
  readonly computerNumber: number; // 1-9
  readonly timeBlocks: readonly string[]; // ["07:00-08:45", "08:45-10:30"] - máx 3
  readonly recurrenceGroupId?: string; // UUID para agrupar reservas del mismo patrón
  // Estado
  readonly status: ReservationStatus;
  readonly approvedBy?: string;
  readonly approvedAt?: string;
  readonly rejectionReason?: string;
  readonly rejectedBy?: string;
  readonly rejectedAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// DTOs
export interface CreateLabReservationDto {
  // Ahora acepta valores dinámicos configurados en lab-config
  readonly userType: string;
  readonly software: readonly string[];
  readonly otherSoftware?: string;
  readonly purpose: string;
  readonly description: string;
  readonly computerNumber: number; // 1-9
  readonly timeBlocks: readonly string[]; // Bloques seleccionados (máx 3)
  // Opción A: Fechas específicas (para reservas puntuales o múltiples fechas)
  readonly dates?: readonly string[]; // ["2025-12-02", "2025-12-04"]
  // Opción B: Patrón recurrente (para reservas semanales)
  readonly recurrence?: RecurrencePattern;
}

export interface UpdateLabReservationDto {
  readonly status?: ReservationStatus;
  readonly rejectionReason?: string;
}

export interface FilterLabReservationDto {
  readonly status?: ReservationStatus;
  readonly userId?: string;
  readonly date?: string; // YYYY-MM-DD format
}

// Response types
export interface LabReservationResponse {
  readonly success: boolean;
  readonly data?: LabReservation | readonly LabReservation[];
  readonly error?: string;
  readonly message?: string;
}

// Disponibilidad por bloque horario
export interface BlockAvailability {
  readonly block: string; // "07:00-08:45"
  readonly availableComputers: readonly number[]; // [1,2,3,4,5,6,7,8,9] - computadoras disponibles
  readonly occupiedComputers: readonly number[]; // [3] - computadoras ocupadas
}

export interface AvailabilityResponse {
  readonly date: string;
  readonly dayName: string;
  readonly dayOfWeek: number; // 1-5 (Lun-Vie)
  readonly isValidDay: boolean;
  readonly blocks: readonly BlockAvailability[];
}

export interface BulkAvailabilityResponse {
  readonly [date: string]: AvailabilityResponse;
}

// Helper types for UI
export interface TimeBlockOption {
  readonly value: TimeBlock;
  readonly label: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly duration: string;
}

export interface DayOption {
  readonly value: DayOfWeek;
  readonly label: string;
  readonly shortLabel: string;
}

// Para el preview de fechas generadas
export interface GeneratedDatePreview {
  readonly date: string; // YYYY-MM-DD
  readonly dayName: string; // "Lunes"
  readonly formattedDate: string; // "2 Dic 2025"
  readonly timeBlocksLabel: string; // "08:45 - 12:15 (2 bloques)"
}

// Constants
export const TIME_BLOCKS: readonly TimeBlockOption[] = [
  {
    value: TimeBlock.BLOCK_1,
    label: 'Bloque 1',
    startTime: '07:00',
    endTime: '08:45',
    duration: '1h 45min',
  },
  {
    value: TimeBlock.BLOCK_2,
    label: 'Bloque 2',
    startTime: '08:45',
    endTime: '10:30',
    duration: '1h 45min',
  },
  {
    value: TimeBlock.BLOCK_3,
    label: 'Bloque 3',
    startTime: '10:30',
    endTime: '12:15',
    duration: '1h 45min',
  },
  {
    value: TimeBlock.BLOCK_4,
    label: 'Bloque 4',
    startTime: '12:15',
    endTime: '14:00',
    duration: '1h 45min',
  },
  {
    value: TimeBlock.BLOCK_5,
    label: 'Bloque 5',
    startTime: '14:00',
    endTime: '15:45',
    duration: '1h 45min',
  },
  {
    value: TimeBlock.BLOCK_6,
    label: 'Bloque 6',
    startTime: '15:45',
    endTime: '17:30',
    duration: '1h 45min',
  },
] as const;

export const DAY_OPTIONS: readonly DayOption[] = [
  { value: DayOfWeek.LUNES, label: 'Lunes', shortLabel: 'Lun' },
  { value: DayOfWeek.MARTES, label: 'Martes', shortLabel: 'Mar' },
  { value: DayOfWeek.MIERCOLES, label: 'Miércoles', shortLabel: 'Mié' },
  { value: DayOfWeek.JUEVES, label: 'Jueves', shortLabel: 'Jue' },
  { value: DayOfWeek.VIERNES, label: 'Viernes', shortLabel: 'Vie' },
] as const;

export const WEEKS_OPTIONS = [
  { value: 1, label: '1 semana' },
  { value: 2, label: '2 semanas' },
  { value: 3, label: '3 semanas' },
  { value: 4, label: '4 semanas' },
] as const;

// Ahora usan Record<string, string> para aceptar valores dinámicos de lab-config
export const USER_TYPE_LABELS: Record<string, string> = {
  [UserType.PROFESOR]: 'Profesor',
  [UserType.ESTUDIANTE]: 'Estudiante',
  [UserType.CFD]: 'CFD',
  [UserType.ESTUDIANTE_CENTRO_MUNDO_X]: 'Estudiante Centro Mundo X',
  [UserType.OTRO]: 'Otro',
};

export const USER_GROUP_LABELS: Record<string, string> = {
  [UserGroup.NORMAL]: 'Usuario Normal',
  [UserGroup.CENTROMUNDOX]: 'Centro Mundo X',
  [UserGroup.CFD]: 'CFD',
};

export const SOFTWARE_LABELS: Record<string, string> = {
  [Software.UNITY]: 'Unity',
  [Software.AUTODESK]: 'Autodesk',
  [Software.BLENDER]: 'Blender',
  [Software.ANSYS]: 'Ansys',
  [Software.OTRO]: 'Otro',
};

export const PURPOSE_LABELS: Record<string, string> = {
  [Purpose.TESIS]: 'Tesis',
  [Purpose.CLASES]: 'Clases',
  [Purpose.TRABAJO_INDUSTRIAL]: 'Trabajo Industrial',
  [Purpose.MINOR]: 'Minor',
};

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'Pendiente',
  [ReservationStatus.APPROVED]: 'Aprobada',
  [ReservationStatus.REJECTED]: 'Rechazada',
  [ReservationStatus.COMPLETED]: 'Completada',
  [ReservationStatus.CANCELLED]: 'Cancelada',
};

export const STATUS_COLORS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ReservationStatus.APPROVED]: 'bg-green-100 text-green-800',
  [ReservationStatus.REJECTED]: 'bg-red-100 text-red-800',
  [ReservationStatus.COMPLETED]: 'bg-blue-100 text-blue-800',
  [ReservationStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
};

// Utility functions
export function getTimeBlockLabel(block: string): string {
  const found = TIME_BLOCKS.find((b) => b.value === block);
  return found ? `${found.startTime} - ${found.endTime}` : block;
}

export function getDayLabel(dayOfWeek: number): string {
  const found = DAY_OPTIONS.find((d) => d.value === dayOfWeek);
  return found ? found.label : `Día ${dayOfWeek}`;
}

export function formatTimeBlocksRange(blocks: readonly string[]): string {
  if (blocks.length === 0) return '';

  const sortedBlocks = [...blocks].sort();
  const first = TIME_BLOCKS.find((b) => b.value === sortedBlocks[0]);
  const last = TIME_BLOCKS.find((b) => b.value === sortedBlocks[sortedBlocks.length - 1]);

  if (!first || !last) return blocks.join(', ');

  return `${first.startTime} - ${last.endTime}`;
}

export function calculateTotalDuration(blocks: readonly string[]): string {
  const minutes = blocks.length * 105; // 1h 45min = 105 minutes
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}min`;
}
