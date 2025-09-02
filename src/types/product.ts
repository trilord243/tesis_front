export interface Product {
  _id: string;
  name: string;
  serialNumber: string;
  hexValue: string;
  type: string; // Tipo dinámico basado en ProductType
  codigo: string;
  isAvailable: boolean;
  headsetId?: string;
  createdAt: string;
  updatedAt: string;
  productTypeId?: string;
  tags: string[];
  allTags: string[];
  
  // Asset properties
  descripcion?: string;
  marca?: string;
  modelo?: string;
  epc?: string;
  estado?: string; // nuevo, usado, reacondicionado
  
  // Location and status
  ubicacionFisica?: string;
  estadoUbicacion?: string; // available, in_use, maintenance, retired
  edificio?: string;
  piso?: string;
  oficina?: string;
  departamento?: string;
  centroCosto?: string;
  
  // Financial information
  precioCompra?: number;
  moneda?: string;
  metodoDepreciacion?: string;
  fechaCompra?: string;
  
  // Warranty information
  tieneGarantia?: boolean;
  garantiaInicio?: string;
  garantiaFin?: string;
  garantiaTipo?: string;
  garantiaProveedor?: string;
  garantiaContacto?: string;
  garantiaTelefono?: string;
  garantiaCobertura?: string;
  
  // Documentation
  imagenPrincipal?: string;
  facturaURL?: string;
  manualURL?: string;
  
  // Purchase information
  proveedor?: string;
  numeroFactura?: string;
  numeroOrdenCompra?: string;
  metodoPago?: string;
  terminos?: string;
  
  // Insurance
  tieneSeguro?: boolean;
  aseguradora?: string;
  numeroPoliza?: string;
  vigenciaSeguroInicio?: string;
  vigenciaSeguroFin?: string;
  valorAsegurado?: number;
  coberturaSeguro?: string;
  
  // VR/AR specific fields
  resolucion?: string;
  campoVision?: string;
  tasaRefresco?: number;
  pesoGramos?: number;
  
  // Maintenance
  maintenanceHistory?: unknown[];
  locationHistory?: unknown[];
}

export interface CreateProductData {
  name: string;
  serialNumber: string;
  type: string; // Tipo dinámico basado en ProductType
  headsetId?: string;
  productTypeId?: string | undefined;
  tags?: string[];
}

export interface CreateMetaQuestSetData {
  headsetName: string;
  headsetSerialNumber: string;
  controllers: {
    serialNumber: string;
  }[];
}

export interface MetaQuestSetResponse {
  headset: Product;
  controllers: Product[];
}

export interface ApiError {
  message: string | string[];
  statusCode?: number;
}

// Product Types interfaces
export interface ProductType {
  _id: string;
  name: string;
  description: string;
  defaultTags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductTypeData {
  name: string;
  description: string;
  defaultTags: string[];
  isActive?: boolean;
}

export interface UpdateProductTypeData {
  name?: string;
  description?: string;
  defaultTags?: string[];
  isActive?: boolean;
}