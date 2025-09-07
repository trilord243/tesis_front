export interface Product {
  _id: string;
  name: string;
  serialNumber: string;
  hexValue: string;
  type: "headset" | "controller" | "tracker" | "accessory" | "other";
  ubicacionFisica: string;
  estadoUbicacion: "available" | "in_use" | "maintenance" | "authorized_out" | "retired";
  currentUser?: string;
  lastCheckoutUser?: string;
  lastCheckoutTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LocationSummary {
  location: string;
  count: number;
}

export interface ProductUserResponse {
  product: Product;
  user: {
    _id: string;
    name: string;
    email: string;
    codigo_acceso: string;
    role: "admin" | "user";
  } | null;
  message: string;
}

export type EstadoUbicacion = 
  | "available"        // Disponible en cabinet
  | "in_use"          // En uso dentro del metaverso
  | "maintenance"     // En mantenimiento
  | "authorized_out"  // Autorizado fuera del metaverso
  | "retired";        // Dado de baja

export const estadoLabels: Record<EstadoUbicacion, { label: string; color: string; bgColor: string }> = {
  available: { label: "Disponible", color: "text-green-800", bgColor: "bg-green-100" },
  in_use: { label: "En Uso", color: "text-blue-800", bgColor: "bg-blue-100" },
  maintenance: { label: "Mantenimiento", color: "text-orange-800", bgColor: "bg-orange-100" },
  authorized_out: { label: "Fuera (Autorizado)", color: "text-purple-800", bgColor: "bg-purple-100" },
  retired: { label: "Dado de Baja", color: "text-red-800", bgColor: "bg-red-100" }
};

export interface UserWithEquipment {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  cedula: string;
  codigo_acceso: string;
  role: "admin" | "user";
  equipos_reservados: string[];
  equipment?: Product[];
  registrationDate: string;
  emailVerified: boolean;
}