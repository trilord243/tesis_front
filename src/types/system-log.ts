export type LogActionType =
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "reject"
  | "login"
  | "logout";

export type LogTargetType =
  | "reservation"
  | "metaverse_reservation"
  | "user"
  | "product"
  | "config"
  | "system"
  | "computer";

export interface SystemLog {
  _id: string;
  action: string;
  actionType: LogActionType;
  targetType: LogTargetType;
  targetId?: string;
  userId: string;
  userName: string;
  userRole: string;
  details?: string;
  metadata?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface SystemLogFilters {
  actionType?: LogActionType;
  targetType?: LogTargetType;
  userId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface SystemLogResponse {
  logs: SystemLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SystemLogStats {
  totalLogs: number;
  todayLogs: number;
  byActionType: Record<LogActionType, number>;
  byTargetType: Record<LogTargetType, number>;
}
