export interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  cedula: string;
  phone?: string;
  equipos_reservados: string[];
  codigo_acceso?: string;
  expectedTags?: string[];
  missingTags?: string[];
  presentTags?: string[];
  registrationDate: Date;
  updatedAt: Date;
  role: "superadmin" | "admin" | "user";
  accessCodeExpiresAt?: Date;
  emailVerified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  cedula: string;
  password: string;
  equipos_reservados?: string[];
  expectedTags?: string[];
  missingTags?: string[];
  presentTags?: string[];
}

export interface AuthResponse {
  access_token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
