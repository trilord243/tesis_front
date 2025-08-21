// Core application interfaces
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Reservation {
  readonly id: string;
  readonly userId: string;
  readonly productId: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly status: ReservationStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly isAvailable: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Using const maps instead of enums as per front.mdc rules
export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export type ReservationStatus = typeof RESERVATION_STATUS[keyof typeof RESERVATION_STATUS];

// Component props interfaces
export interface ButtonProps {
  readonly children: React.ReactNode;
  readonly variant?: 'primary' | 'secondary' | 'outline';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly isLoading?: boolean;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
  readonly type?: 'button' | 'submit' | 'reset';
}

export interface NavItemProps {
  readonly href: string;
  readonly children: React.ReactNode;
  readonly isActive?: boolean;
} 