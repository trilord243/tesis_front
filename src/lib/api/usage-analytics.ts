import type {
  ProductUsageStatistics,
  CabinetStatus,
  LoanFrequencyAnalytics,
  UsagePatterns,
  SystemAnalytics,
  AnalyticsFilters,
  ProductUtilizationMetric,
  MaintenanceAnalytics,
} from "@/types/usage-analytics";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API request failed");
  }

  return response.json();
}

export const UsageAnalyticsService = {
  /**
   * Get usage statistics for a specific product
   */
  async getProductUsageStats(
    productId: string
  ): Promise<ProductUsageStatistics> {
    const url = `${API_BASE_URL}/products/${productId}/usage-statistics`;
    console.log("Fetching product usage stats from:", url);
    return fetchWithAuth(url);
  },

  /**
   * Get usage statistics for all products
   */
  async getAllProductsUsageStats(): Promise<ProductUsageStatistics[]> {
    return fetchWithAuth(`${API_BASE_URL}/products/usage-statistics/all`);
  },

  /**
   * Get cabinet status and inventory
   */
  async getCabinetStatus(): Promise<CabinetStatus> {
    return fetchWithAuth(`${API_BASE_URL}/api/analytics/cabinet-status`);
  },

  /**
   * Get loan frequency analytics
   */
  async getLoanFrequencyAnalytics(
    filters?: AnalyticsFilters
  ): Promise<LoanFrequencyAnalytics> {
    const params = new URLSearchParams();

    if (filters?.dateRange) {
      params.append("startDate", filters.dateRange.startDate);
      params.append("endDate", filters.dateRange.endDate);
    }

    if (filters?.productIds?.length) {
      params.append("productIds", filters.productIds.join(","));
    }

    if (filters?.userIds?.length) {
      params.append("userIds", filters.userIds.join(","));
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/analytics/loan-frequency${queryString ? `?${queryString}` : ""}`;

    return fetchWithAuth(url);
  },

  /**
   * Get usage patterns across the system
   */
  async getUsagePatterns(
    filters?: AnalyticsFilters
  ): Promise<UsagePatterns> {
    const params = new URLSearchParams();

    if (filters?.dateRange) {
      params.append("startDate", filters.dateRange.startDate);
      params.append("endDate", filters.dateRange.endDate);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/analytics/usage-patterns${queryString ? `?${queryString}` : ""}`;

    return fetchWithAuth(url);
  },

  /**
   * Get comprehensive system analytics
   */
  async getSystemAnalytics(
    filters?: AnalyticsFilters
  ): Promise<SystemAnalytics> {
    const params = new URLSearchParams();

    if (filters?.dateRange) {
      params.append("startDate", filters.dateRange.startDate);
      params.append("endDate", filters.dateRange.endDate);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/analytics/system${queryString ? `?${queryString}` : ""}`;

    return fetchWithAuth(url);
  },

  /**
   * Get product utilization metrics
   */
  async getProductUtilization(
    productId?: string
  ): Promise<ProductUtilizationMetric | ProductUtilizationMetric[]> {
    const url = productId
      ? `${API_BASE_URL}/analytics/utilization/${productId}`
      : `${API_BASE_URL}/analytics/utilization`;

    return fetchWithAuth(url);
  },

  /**
   * Get maintenance analytics
   */
  async getMaintenanceAnalytics(
    filters?: AnalyticsFilters
  ): Promise<MaintenanceAnalytics> {
    const params = new URLSearchParams();

    if (filters?.dateRange) {
      params.append("startDate", filters.dateRange.startDate);
      params.append("endDate", filters.dateRange.endDate);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/analytics/maintenance${queryString ? `?${queryString}` : ""}`;

    return fetchWithAuth(url);
  },

  /**
   * Track a product checkout
   */
  async trackCheckout(productId: string, userId: string, notes?: string): Promise<void> {
    return fetchWithAuth(`${API_BASE_URL}/products/${productId}/track-checkout`, {
      method: "POST",
      body: JSON.stringify({ userId, notes }),
    });
  },

  /**
   * Track a product return
   */
  async trackReturn(productId: string, userId: string, notes?: string): Promise<void> {
    return fetchWithAuth(`${API_BASE_URL}/products/${productId}/track-return`, {
      method: "POST",
      body: JSON.stringify({ userId, notes }),
    });
  },

  /**
   * Get products currently in cabinet
   */
  async getProductsInCabinet(): Promise<CabinetStatus["productsInCabinetList"]> {
    const status = await this.getCabinetStatus();
    return status.productsInCabinetList;
  },

  /**
   * Get products currently outside cabinet
   */
  async getProductsOutsideCabinet(): Promise<CabinetStatus["productsOutsideList"]> {
    const status = await this.getCabinetStatus();
    return status.productsOutsideList;
  },

  /**
   * Export analytics data (for future implementation)
   */
  async exportAnalytics(
    format: "csv" | "excel" | "pdf",
    filters?: AnalyticsFilters
  ): Promise<Blob> {
    const params = new URLSearchParams();
    params.append("format", format);

    if (filters?.dateRange) {
      params.append("startDate", filters.dateRange.startDate);
      params.append("endDate", filters.dateRange.endDate);
    }

    const response = await fetch(
      `${API_BASE_URL}/analytics/export?${params.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Export failed");
    }

    return response.blob();
  },
};
