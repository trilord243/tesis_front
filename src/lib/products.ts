"use server";

import { getAuthToken } from "@/lib/auth";
import type {
  Product,
  CreateProductData,
  CreateMetaQuestSetData,
  MetaQuestSetResponse,
  ApiError,
} from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function createProduct(productData: CreateProductData) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "No tienes autorización para realizar esta acción",
      };
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(
        Array.isArray(error.message) ? error.message.join(", ") : error.message
      );
    }

    const product: Product = await response.json();
    return { success: true, product };
  } catch (error) {
    console.error("Create product error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear producto",
    };
  }
}

export async function createMetaQuestSet(setData: CreateMetaQuestSetData) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "No tienes autorización para realizar esta acción",
      };
    }

    const response = await fetch(`${API_BASE_URL}/products/metaquest-set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(setData),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(
        Array.isArray(error.message) ? error.message.join(", ") : error.message
      );
    }

    const setResponse: MetaQuestSetResponse = await response.json();
    return { success: true, set: setResponse };
  } catch (error) {
    console.error("Create MetaQuest set error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear set MetaQuest",
    };
  }
}

export async function getProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener productos");
    }

    const products: Product[] = await response.json();
    return { success: true, products };
  } catch (error) {
    console.error("Get products error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener productos",
    };
  }
}

export async function getCabinetInventory() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/cabinet-inventory`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener inventario del gabinete");
    }

    const products: Product[] = await response.json();
    return { success: true, products };
  } catch (error) {
    console.error("Get cabinet inventory error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener inventario",
    };
  }
}