// Usage Analytics Types for CentroMundoX

export interface UsageSession {
  userId: string;
  userEmail: string;
  userName?: string;
  checkoutTime: string;
  returnTime?: string;
  durationMinutes?: number;
  notes?: string;
}

export interface ProductUsageStatistics {
  productId: string;
  productName: string;
  serialNumber: string;
  totalUsageMinutes: number;
  totalUsageHours: number;
  totalUsageDays: number;
  sessionCount: number;
  currentlyCheckedOut: boolean;
  lastCheckoutTime?: string;
  lastCheckoutUser?: {
    id: string;
    email: string;
    name?: string;
  };
  usageHistory: UsageSession[];
  usageByUser: Array<{
    userId: string;
    userEmail: string;
    userName?: string;
    totalMinutes: number;
    sessionCount: number;
  }>;
  averageSessionDuration: number;
  longestSession?: UsageSession;
  shortestSession?: UsageSession;
}

export interface CabinetStatus {
  totalProducts: number;
  productsInCabinet: number;
  productsOutside: number;
  productsInUse: number;
  productsMaintenance: number;
  productsAvailable: number;
  cabinetOccupancyRate: number;
  productsInCabinetList: Array<{
    _id: string;
    nombre: string;
    serialNumber: string;
    codigoActivo: string;
    hexValue?: string;
    estadoUbicacion: string;
  }>;
  productsOutsideList: Array<{
    _id: string;
    nombre: string;
    serialNumber: string;
    codigoActivo: string;
    estadoUbicacion: string;
    currentUser?: {
      id: string;
      email: string;
      name?: string;
    };
  }>;
}

export interface LoanFrequencyAnalytics {
  totalLoanRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  approvalRate: number;
  rejectionRate: number;
  requestsByProduct: Array<{
    productId: string;
    productName: string;
    requestCount: number;
    approvedCount: number;
    rejectedCount: number;
  }>;
  requestsByUser: Array<{
    userId: string;
    userEmail: string;
    userName?: string;
    requestCount: number;
    approvedCount: number;
    rejectedCount: number;
  }>;
  requestsByTimeRange: Array<{
    date: string;
    count: number;
    approved: number;
    rejected: number;
  }>;
  averageApprovalTime?: number; // in hours
  peakRequestDays: string[];
  mostRequestedProducts: Array<{
    productId: string;
    productName: string;
    count: number;
  }>;
}

export interface UsagePatterns {
  totalCheckouts: number;
  totalReturns: number;
  activeLoans: number;
  averageLoanDuration: number; // in hours
  checkoutsByDay: Array<{
    day: string;
    count: number;
  }>;
  checkoutsByHour: Array<{
    hour: number;
    count: number;
  }>;
  checkoutsByProduct: Array<{
    productId: string;
    productName: string;
    checkoutCount: number;
    totalUsageHours: number;
    utilizationRate: number; // percentage
  }>;
  checkoutsByUser: Array<{
    userId: string;
    userEmail: string;
    userName?: string;
    checkoutCount: number;
    totalUsageHours: number;
  }>;
  mostActiveUsers: Array<{
    userId: string;
    userEmail: string;
    userName?: string;
    activityScore: number;
  }>;
  leastUsedProducts: Array<{
    productId: string;
    productName: string;
    lastUsed?: string;
    daysSinceLastUse?: number;
  }>;
  mostUsedProducts: Array<{
    productId: string;
    productName: string;
    totalCheckouts: number;
    totalHours: number;
  }>;
}

export interface SystemAnalytics {
  overview: {
    totalProducts: number;
    totalUsers: number;
    totalLoanRequests: number;
    totalCheckouts: number;
    activeLoans: number;
    productsInMaintenance: number;
  };
  timeRange: {
    startDate: string;
    endDate: string;
  };
  cabinetStatus: CabinetStatus;
  usagePatterns: UsagePatterns;
  loanFrequency: LoanFrequencyAnalytics;
  topMetrics: {
    mostPopularProduct: {
      id: string;
      name: string;
      checkouts: number;
    };
    mostActiveUser: {
      id: string;
      email: string;
      name?: string;
      checkouts: number;
    };
    averageLoanDuration: number;
    equipmentUtilizationRate: number;
  };
}

export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

export interface AnalyticsFilters {
  dateRange?: DateRangeFilter;
  productIds?: string[];
  userIds?: string[];
  includeCompleted?: boolean;
  includeActive?: boolean;
  includeCancelled?: boolean;
}

export interface ProductUtilizationMetric {
  productId: string;
  productName: string;
  totalAvailableHours: number;
  totalUsedHours: number;
  utilizationPercentage: number;
  idleTime: number;
  maintenanceTime: number;
  checkoutCount: number;
  averageSessionLength: number;
}

export interface MaintenanceAnalytics {
  totalMaintenanceEvents: number;
  averageMaintenanceDuration: number; // in days
  totalMaintenanceCost: number;
  maintenanceByType: Array<{
    type: string;
    count: number;
    averageCost: number;
    averageDuration: number;
  }>;
  productsInMaintenance: number;
  upcomingMaintenanceCount: number;
  mostMaintenedProducts: Array<{
    productId: string;
    productName: string;
    maintenanceCount: number;
    totalCost: number;
  }>;
}
