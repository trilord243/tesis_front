"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  LayoutGrid,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  CalendarCheck,
} from "lucide-react";

interface StatsDashboardProps {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  className?: string;
}

export function StatsDashboard({
  total,
  pending,
  approved,
  rejected,
  className = "",
}: StatsDashboardProps) {
  // Calculate percentages for visual indicators
  const stats = useMemo(() => {
    const processed = approved + rejected;
    const approvalRate = processed > 0 ? Math.round((approved / processed) * 100) : 0;

    return {
      total,
      pending,
      approved,
      rejected,
      approvalRate,
      pendingPercent: total > 0 ? Math.round((pending / total) * 100) : 0,
    };
  }, [total, pending, approved, rejected]);

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Total */}
      <Card className="relative overflow-hidden p-5 bg-gradient-to-br from-slate-50 to-white border-slate-200 group hover:shadow-lg transition-shadow">
        <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
          <div className="w-full h-full rounded-full bg-slate-100 opacity-50" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-slate-100">
              <LayoutGrid className="h-4 w-4 text-slate-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800 tabular-nums">
              {stats.total}
            </span>
            <span className="text-sm text-slate-500">solicitudes</span>
          </div>
        </div>
      </Card>

      {/* Pending */}
      <Card className="relative overflow-hidden p-5 bg-gradient-to-br from-amber-50 to-white border-amber-200 group hover:shadow-lg hover:shadow-amber-100 transition-shadow">
        <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
          <div className="w-full h-full rounded-full bg-amber-100 opacity-50" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Pendientes
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-700 tabular-nums">
              {stats.pending}
            </span>
            {stats.pending > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium animate-pulse">
                Requieren acción
              </span>
            )}
          </div>

          {/* Progress indicator */}
          {stats.total > 0 && (
            <div className="mt-3">
              <div className="h-1.5 w-full bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.pendingPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-amber-600 mt-1 block">
                {stats.pendingPercent}% del total
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Approved */}
      <Card className="relative overflow-hidden p-5 bg-gradient-to-br from-emerald-50 to-white border-emerald-200 group hover:shadow-lg hover:shadow-emerald-100 transition-shadow">
        <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
          <div className="w-full h-full rounded-full bg-emerald-100 opacity-50" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Aprobadas
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700 tabular-nums">
              {stats.approved}
            </span>
          </div>

          {/* Approval rate indicator */}
          {(stats.approved + stats.rejected) > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">
                {stats.approvalRate}% tasa de aprobación
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Rejected */}
      <Card className="relative overflow-hidden p-5 bg-gradient-to-br from-rose-50 to-white border-rose-200 group hover:shadow-lg hover:shadow-rose-100 transition-shadow">
        <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
          <div className="w-full h-full rounded-full bg-rose-100 opacity-50" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-rose-100">
              <XCircle className="h-4 w-4 text-rose-600" />
            </div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Rechazadas
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-700 tabular-nums">
              {stats.rejected}
            </span>
          </div>

          {stats.rejected === 0 && stats.approved > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <CalendarCheck className="h-3.5 w-3.5 text-rose-400" />
              <span className="text-xs text-rose-400 font-medium">
                Sin rechazos
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
