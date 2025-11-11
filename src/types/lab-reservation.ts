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

/** @deprecated - Use computer-based reservations instead */
export enum TimeBlock {
  BLOCK_1 = '07:00-08:45',
  BLOCK_2 = '08:45-10:30',
  BLOCK_3 = '10:30-12:15',
  BLOCK_4 = '12:15-14:00',
  BLOCK_5 = '14:00-15:45',
  BLOCK_6 = '15:45-17:30',
}

/** @deprecated - Use computer-based reservations instead */
export enum DayOfWeek {
  LUNES = 'lunes',
  MARTES = 'martes',
  JUEVES = 'jueves',
  VIERNES = 'viernes',
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
  readonly accessLevel: 'normal' | 'special'; // normal = first 4, special = computers 5-9
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** @deprecated - Use computer-based reservations instead */
export interface TimeSlot {
  readonly date: string; // ISO date string (YYYY-MM-DD)
  readonly dayOfWeek: DayOfWeek;
  readonly blocks: readonly TimeBlock[]; // Array de bloques (máximo 2)
}

export interface LabReservation {
  readonly _id: string;
  readonly userId: string;
  readonly userName: string;
  readonly userEmail: string;
  readonly userType: UserType;
  readonly software: readonly Software[];
  readonly otherSoftware?: string;
  readonly purpose: Purpose;
  readonly description: string;
  // NEW: Computer-based reservation fields
  readonly reservationDate: string; // YYYY-MM-DD
  readonly computerNumber: number; // 1-9
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
  readonly userType: UserType;
  readonly software: readonly Software[];
  readonly otherSoftware?: string;
  readonly purpose: Purpose;
  readonly description: string;
  // NEW: Computer-based reservation fields
  readonly reservationDate: string; // YYYY-MM-DD
  readonly computerNumber: number; // 1-9
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

export interface AvailabilityResponse {
  readonly date: string;
  readonly dayName?: string;
  readonly available: boolean;
  readonly message?: string;
  readonly availableComputers?: readonly number[]; // Available computer numbers
  readonly occupiedComputers?: readonly number[]; // Occupied computer numbers
  readonly totalReservations?: number;
}

// Helper types for UI
export interface TimeBlockOption {
  readonly value: TimeBlock;
  readonly label: string;
  readonly startTime: string;
  readonly endTime: string;
}

export interface DayReservation {
  readonly date: string;
  readonly dayOfWeek: DayOfWeek;
  readonly selectedBlocks: TimeBlock[];
  readonly availableBlocks: TimeBlock[];
}

// Constants
export const TIME_BLOCKS: readonly TimeBlockOption[] = [
  {
    value: TimeBlock.BLOCK_1,
    label: 'Bloque 1',
    startTime: '07:00',
    endTime: '08:45',
  },
  {
    value: TimeBlock.BLOCK_2,
    label: 'Bloque 2',
    startTime: '08:45',
    endTime: '10:30',
  },
  {
    value: TimeBlock.BLOCK_3,
    label: 'Bloque 3',
    startTime: '10:30',
    endTime: '12:15',
  },
  {
    value: TimeBlock.BLOCK_4,
    label: 'Bloque 4',
    startTime: '12:15',
    endTime: '14:00',
  },
  {
    value: TimeBlock.BLOCK_5,
    label: 'Bloque 5',
    startTime: '14:00',
    endTime: '15:45',
  },
  {
    value: TimeBlock.BLOCK_6,
    label: 'Bloque 6',
    startTime: '15:45',
    endTime: '17:30',
  },
] as const;

export const VALID_DAYS = [
  DayOfWeek.LUNES,
  DayOfWeek.MARTES,
  DayOfWeek.JUEVES,
  DayOfWeek.VIERNES,
] as const;

export const USER_TYPE_LABELS: Record<UserType, string> = {
  [UserType.PROFESOR]: 'Profesor',
  [UserType.ESTUDIANTE]: 'Estudiante',
  [UserType.CFD]: 'CFD',
  [UserType.ESTUDIANTE_CENTRO_MUNDO_X]: 'Estudiante Centro Mundo X',
  [UserType.OTRO]: 'Otro',
};

export const USER_GROUP_LABELS: Record<UserGroup, string> = {
  [UserGroup.NORMAL]: 'Usuario Normal',
  [UserGroup.CENTROMUNDOX]: 'Centro Mundo X',
  [UserGroup.CFD]: 'CFD',
};

export const SOFTWARE_LABELS: Record<Software, string> = {
  [Software.UNITY]: 'Unity',
  [Software.AUTODESK]: 'Autodesk',
  [Software.BLENDER]: 'Blender',
  [Software.ANSYS]: 'Ansys',
  [Software.OTRO]: 'Otro',
};

export const PURPOSE_LABELS: Record<Purpose, string> = {
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
