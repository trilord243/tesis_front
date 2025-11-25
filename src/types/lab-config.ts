// Lab Configuration Types for Dynamic Management

export interface UserTypeConfig {
  _id: string;
  key: string;
  label: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SoftwareConfig {
  _id: string;
  key: string;
  label: string;
  isActive: boolean;
  isFixed: boolean; // true for "otro" - cannot be deleted
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurposeConfig {
  _id: string;
  key: string;
  label: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ComputerConfig {
  _id: string;
  number: number;
  position?: string; // e.g., "A9", "B6"
  name: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  software: string[];
  specialization: string;
  description: string;
  isAvailable: boolean;
  maintenanceNotes: string;
  accessLevel: "normal" | "special";
  createdAt: string;
  updatedAt: string;
}

// DTOs for creating/updating
export interface CreateUserTypeDto {
  key: string;
  label: string;
  isActive?: boolean;
  order?: number;
}

export interface CreateSoftwareDto {
  key: string;
  label: string;
  isActive?: boolean;
  isFixed?: boolean;
  order?: number;
}

export interface CreatePurposeDto {
  key: string;
  label: string;
  isActive?: boolean;
  order?: number;
}

export interface CreateComputerDto {
  number: number;
  position?: string;
  name: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  software: string[];
  specialization: string;
  description: string;
  isAvailable?: boolean;
  maintenanceNotes?: string;
  accessLevel?: "normal" | "special";
}

export type UpdateUserTypeDto = Partial<CreateUserTypeDto>;
export type UpdateSoftwareDto = Partial<CreateSoftwareDto>;
export type UpdatePurposeDto = Partial<CreatePurposeDto>;
export type UpdateComputerDto = Partial<CreateComputerDto>;
