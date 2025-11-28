// Estados de reserva del metaverso
export enum MetaverseReservationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

// Bloques horarios disponibles
export enum MetaverseTimeBlock {
  BLOCK_1 = '07:00-08:45',
  BLOCK_2 = '08:45-10:30',
  BLOCK_3 = '10:30-12:15',
  BLOCK_4 = '12:15-14:00',
  BLOCK_5 = '14:00-15:45',
  BLOCK_6 = '15:45-17:30',
}

export const VALID_METAVERSE_TIME_BLOCKS = Object.values(MetaverseTimeBlock);

// Días de la semana
export enum DayOfWeek {
  LUNES = 1,
  MARTES = 2,
  MIERCOLES = 3,
  JUEVES = 4,
  VIERNES = 5,
}

// Interface principal
export interface MetaverseReservation {
  readonly _id: string;
  readonly userId?: string;
  readonly requesterName: string;
  readonly requesterEmail: string;
  readonly requesterPhone?: string;
  readonly organization?: string;
  readonly eventTitle: string;
  readonly eventDescription: string;
  readonly purpose: string;
  readonly expectedAttendees?: number;
  readonly reservationDate: string;
  readonly timeBlocks: readonly string[];
  readonly isRecurring: boolean;
  readonly recurrenceGroupId?: string;
  readonly recurrencePattern?: string;
  readonly recurrenceWeeks?: number;
  readonly recurrenceDays?: readonly number[];
  readonly status: MetaverseReservationStatus;
  readonly approvedBy?: string;
  readonly approvedAt?: string;
  readonly rejectionReason?: string;
  readonly rejectedBy?: string;
  readonly rejectedAt?: string;
  readonly adminNotes?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// DTO para crear reserva
export interface CreateMetaverseReservationDto {
  readonly requesterName: string;
  readonly requesterEmail: string;
  readonly requesterPhone?: string;
  readonly organization?: string;
  readonly eventTitle: string;
  readonly eventDescription: string;
  readonly purpose: string;
  readonly expectedAttendees?: number;
  readonly reservationDate: string;
  readonly timeBlocks: readonly string[];
  readonly isRecurring?: boolean;
  readonly recurrenceWeeks?: number;
  readonly recurrenceDays?: readonly number[];
}

// DTO para actualizar reserva
export interface UpdateMetaverseReservationDto {
  readonly status?: MetaverseReservationStatus;
  readonly rejectionReason?: string;
  readonly adminNotes?: string;
}

// DTO para filtrar reservas
export interface FilterMetaverseReservationDto {
  readonly status?: MetaverseReservationStatus;
  readonly date?: string;
  readonly requesterEmail?: string;
}

// Opciones de bloque horario para UI
export interface MetaverseTimeBlockOption {
  readonly value: MetaverseTimeBlock;
  readonly label: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly duration: string;
}

// Opciones de día para UI
export interface DayOption {
  readonly value: DayOfWeek;
  readonly label: string;
  readonly shortLabel: string;
}

// Constantes para UI
export const METAVERSE_TIME_BLOCKS: readonly MetaverseTimeBlockOption[] = [
  {
    value: MetaverseTimeBlock.BLOCK_1,
    label: 'Bloque 1',
    startTime: '07:00',
    endTime: '08:45',
    duration: '1h 45min',
  },
  {
    value: MetaverseTimeBlock.BLOCK_2,
    label: 'Bloque 2',
    startTime: '08:45',
    endTime: '10:30',
    duration: '1h 45min',
  },
  {
    value: MetaverseTimeBlock.BLOCK_3,
    label: 'Bloque 3',
    startTime: '10:30',
    endTime: '12:15',
    duration: '1h 45min',
  },
  {
    value: MetaverseTimeBlock.BLOCK_4,
    label: 'Bloque 4',
    startTime: '12:15',
    endTime: '14:00',
    duration: '1h 45min',
  },
  {
    value: MetaverseTimeBlock.BLOCK_5,
    label: 'Bloque 5',
    startTime: '14:00',
    endTime: '15:45',
    duration: '1h 45min',
  },
  {
    value: MetaverseTimeBlock.BLOCK_6,
    label: 'Bloque 6',
    startTime: '15:45',
    endTime: '17:30',
    duration: '1h 45min',
  },
] as const;

export const METAVERSE_DAY_OPTIONS: readonly DayOption[] = [
  { value: DayOfWeek.LUNES, label: 'Lunes', shortLabel: 'Lun' },
  { value: DayOfWeek.MARTES, label: 'Martes', shortLabel: 'Mar' },
  { value: DayOfWeek.MIERCOLES, label: 'Miércoles', shortLabel: 'Mié' },
  { value: DayOfWeek.JUEVES, label: 'Jueves', shortLabel: 'Jue' },
  { value: DayOfWeek.VIERNES, label: 'Viernes', shortLabel: 'Vie' },
] as const;

export const METAVERSE_WEEKS_OPTIONS = [
  { value: 1, label: '1 semana' },
  { value: 2, label: '2 semanas' },
  { value: 3, label: '3 semanas' },
  { value: 4, label: '4 semanas' },
  { value: 5, label: '5 semanas' },
  { value: 6, label: '6 semanas' },
  { value: 7, label: '7 semanas' },
  { value: 8, label: '8 semanas' },
] as const;

export const METAVERSE_STATUS_LABELS: Record<MetaverseReservationStatus, string> = {
  [MetaverseReservationStatus.PENDING]: 'Pendiente',
  [MetaverseReservationStatus.APPROVED]: 'Aprobada',
  [MetaverseReservationStatus.REJECTED]: 'Rechazada',
  [MetaverseReservationStatus.CANCELLED]: 'Cancelada',
};

export const METAVERSE_STATUS_COLORS: Record<MetaverseReservationStatus, string> = {
  [MetaverseReservationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [MetaverseReservationStatus.APPROVED]: 'bg-green-100 text-green-800',
  [MetaverseReservationStatus.REJECTED]: 'bg-red-100 text-red-800',
  [MetaverseReservationStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
};

// Utilidades
export function getMetaverseTimeBlockLabel(block: string): string {
  const found = METAVERSE_TIME_BLOCKS.find((b) => b.value === block);
  return found ? `${found.startTime} - ${found.endTime}` : block;
}

export function formatMetaverseTimeBlocksRange(blocks: readonly string[]): string {
  if (blocks.length === 0) return '';

  const sortedBlocks = [...blocks].sort();
  const first = METAVERSE_TIME_BLOCKS.find((b) => b.value === sortedBlocks[0]);
  const last = METAVERSE_TIME_BLOCKS.find((b) => b.value === sortedBlocks[sortedBlocks.length - 1]);

  if (!first || !last) return blocks.join(', ');

  return `${first.startTime} - ${last.endTime}`;
}

export function getDayLabel(dayOfWeek: number): string {
  const found = METAVERSE_DAY_OPTIONS.find((d) => d.value === dayOfWeek);
  return found ? found.label : `Día ${dayOfWeek}`;
}
