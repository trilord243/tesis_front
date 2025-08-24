export interface Product {
  _id: string;
  name: string;
  serialNumber: string;
  hexValue: string;
  type: "headset" | "controller";
  codigo: string;
  isAvailable: boolean;
  headsetId?: string;
  createdAt: string;
  updatedAt: string;
  productTypeId?: string;
  tags: string[];
  allTags: string[];
}

export interface CreateProductData {
  name: string;
  serialNumber: string;
  type: "headset" | "controller";
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