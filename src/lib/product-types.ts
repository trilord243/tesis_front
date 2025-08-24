import { ProductType, CreateProductTypeData, UpdateProductTypeData } from "@/types/product";

// Get all product types
export async function getAllProductTypes(): Promise<ProductType[]> {
  const response = await fetch("/api/product-types", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product types");
  }

  return response.json();
}

// Get active product types only
export async function getActiveProductTypes(): Promise<ProductType[]> {
  const response = await fetch("/api/product-types?active=true", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch active product types");
  }

  return response.json();
}

// Get product type by ID
export async function getProductTypeById(id: string): Promise<ProductType> {
  const response = await fetch(`/api/product-types/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product type");
  }

  return response.json();
}

// Get product type by name
export async function getProductTypeByName(name: string): Promise<ProductType> {
  const response = await fetch(`/api/product-types/name/${name}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product type by name");
  }

  return response.json();
}

// Create new product type
export async function createProductType(data: CreateProductTypeData): Promise<ProductType> {
  const response = await fetch("/api/product-types", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create product type");
  }

  return response.json();
}

// Update product type
export async function updateProductType(
  id: string,
  data: UpdateProductTypeData
): Promise<ProductType> {
  const response = await fetch(`/api/product-types/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update product type");
  }

  return response.json();
}

// Delete product type
export async function deleteProductType(id: string): Promise<void> {
  const response = await fetch(`/api/product-types/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete product type");
  }
}

// Add tags to product type
export async function addTagsToProductType(
  id: string,
  tags: string[]
): Promise<ProductType> {
  const response = await fetch(`/api/product-types/${id}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ tags }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add tags to product type");
  }

  return response.json();
}

// Remove tags from product type
export async function removeTagsFromProductType(
  id: string,
  tags: string[]
): Promise<ProductType> {
  const response = await fetch(`/api/product-types/${id}/tags`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ tags }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to remove tags from product type");
  }

  return response.json();
}