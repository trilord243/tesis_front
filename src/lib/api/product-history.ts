import {
  ProductHistoryEvent,
  ProductHistoryResponse,
  ProductHistoryStats,
  ProductHistoryFilters,
  CreateHistoryEventDto
} from "@/types/product-history";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class ProductHistoryService {
  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Obtener historial completo de un producto con filtros opcionales
   */
  async getProductHistory(
    productId: string,
    filters?: ProductHistoryFilters
  ): Promise<ProductHistoryResponse> {
    const searchParams = new URLSearchParams();

    if (filters?.eventTypes && filters.eventTypes.length > 0) {
      searchParams.append('eventTypes', filters.eventTypes.join(','));
    }

    if (filters?.severity && filters.severity.length > 0) {
      searchParams.append('severity', filters.severity.join(','));
    }

    if (filters?.startDate) {
      searchParams.append('startDate', filters.startDate);
    }

    if (filters?.endDate) {
      searchParams.append('endDate', filters.endDate);
    }

    if (filters?.userId) {
      searchParams.append('userId', filters.userId);
    }

    if (filters?.limit) {
      searchParams.append('limit', filters.limit.toString());
    }

    if (filters?.offset) {
      searchParams.append('offset', filters.offset.toString());
    }

    const queryString = searchParams.toString();
    const url = `/products/${productId}/history${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<ProductHistoryResponse>(url);
  }

  /**
   * Obtener estadísticas del historial de un producto
   */
  async getProductHistoryStats(productId: string): Promise<ProductHistoryStats> {
    return this.makeRequest<ProductHistoryStats>(`/products/${productId}/history/stats`);
  }

  /**
   * Crear un nuevo evento en el historial
   */
  async createHistoryEvent(
    productId: string,
    eventData: CreateHistoryEventDto
  ): Promise<ProductHistoryEvent> {
    return this.makeRequest<ProductHistoryEvent>(`/products/${productId}/history/event`, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  /**
   * Obtener eventos recientes del sistema (todos los productos)
   */
  async getRecentEvents(limit: number = 50): Promise<ProductHistoryEvent[]> {
    // Esta funcionalidad requerirá un endpoint adicional en el backend
    // Por ahora retornamos un array vacío
    return [];
  }

  /**
   * Obtener eventos por tipo
   */
  async getEventsByType(eventType: string, limit: number = 50): Promise<ProductHistoryEvent[]> {
    // Esta funcionalidad requerirá un endpoint adicional en el backend
    // Por ahora retornamos un array vacío
    return [];
  }
}

export const productHistoryService = new ProductHistoryService();
export default productHistoryService;