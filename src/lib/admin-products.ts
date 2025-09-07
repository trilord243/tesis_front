"use server";

import { getAuthToken } from "@/lib/auth";
import { UserWithEquipment } from "@/types/admin-products";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getProductsByLocation(location: string) {
  try {
    const token = await getAuthToken();
    if (!token) return [];

    const response = await fetch(
      `${API_BASE_URL}/products/location/${encodeURIComponent(location)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store', // Always get fresh data
      }
    );

    if (!response.ok) {
      console.error("Error fetching products by location:", response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getProductsByLocation:", error);
    return [];
  }
}

export async function searchProductsByLocation(query: string) {
  try {
    const token = await getAuthToken();
    if (!token) return [];

    const response = await fetch(
      `${API_BASE_URL}/products/search/location?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error("Error searching products by location:", response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error in searchProductsByLocation:", error);
    return [];
  }
}

export async function getUserProducts(userCode: string) {
  try {
    const token = await getAuthToken();
    if (!token) return [];

    const response = await fetch(
      `${API_BASE_URL}/products/user/${userCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error("Error fetching user products:", response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getUserProducts:", error);
    return [];
  }
}

export async function getLocationSummary() {
  try {
    const token = await getAuthToken();
    if (!token) return [];

    const response = await fetch(
      `${API_BASE_URL}/products/location-summary`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error("Error fetching location summary:", response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getLocationSummary:", error);
    return [];
  }
}

export async function getProductUser(productId: string) {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error("Error fetching product user:", response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getProductUser:", error);
    return null;
  }
}

export async function getAllUsersWithEquipment() {
  try {
    const token = await getAuthToken();
    if (!token) return [];

    // Primero obtenemos todos los usuarios
    const usersResponse = await fetch(
      `${API_BASE_URL}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store',
      }
    );

    if (!usersResponse.ok) {
      console.error("Error fetching users:", usersResponse.statusText);
      return [];
    }

    const users = await usersResponse.json();

    // Para cada usuario que tiene equipos reservados, obtener los detalles
    const usersWithEquipment = await Promise.all(
      users.map(async (user: UserWithEquipment) => {
        if (user.equipos_reservados && user.equipos_reservados.length > 0) {
          try {
            // Obtener los productos de este usuario usando su código de acceso
            const userProducts = await getUserProducts(user.codigo_acceso);
            return {
              ...user,
              equipment: userProducts || []
            };
          } catch (error) {
            console.error(`Error fetching equipment for user ${user.codigo_acceso}:`, error);
            return {
              ...user,
              equipment: []
            };
          }
        }
        return {
          ...user,
          equipment: []
        };
      })
    );

    return usersWithEquipment;
  } catch (error) {
    console.error("Error in getAllUsersWithEquipment:", error);
    return [];
  }
}