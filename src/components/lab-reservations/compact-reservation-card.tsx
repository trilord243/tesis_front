"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  LabReservation,
  ReservationStatus,
  STATUS_LABELS,
  USER_TYPE_LABELS,
  formatTimeBlocksRange,
} from "@/types/lab-reservation";
import {
  Calendar,
  Clock,
  Computer,
  User,
  CheckCircle,
  XCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { formatReservationDate } from "@/lib/utils";

interface CompactReservationCardProps {
  reservation: LabReservation;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onViewDetails: (reservation: LabReservation) => void;
  onQuickApprove?: (reservation: LabReservation) => Promise<void>;
  onQuickReject?: (reservation: LabReservation) => Promise<void>;
  showSelectionCheckbox?: boolean;
}

export function CompactReservationCard({
  reservation,
  isSelected = false,
  onSelect,
  onViewDetails,
  onQuickApprove,
  onQuickReject,
  showSelectionCheckbox = true,
}: CompactReservationCardProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const isPending = reservation.status === ReservationStatus.PENDING;
  const displayComputerNumber = reservation.computerNumber ?? "N/A";

  const handleQuickApprove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onQuickApprove) return;
    setIsApproving(true);
    try {
      await onQuickApprove(reservation);
    } finally {
      setIsApproving(false);
    }
  };

  const handleQuickReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onQuickReject) return;
    setIsRejecting(true);
    try {
      await onQuickReject(reservation);
    } finally {
      setIsRejecting(false);
    }
  };

  // Status colors with brand alignment
  const statusStyles: Record<ReservationStatus, string> = {
    [ReservationStatus.PENDING]: "bg-amber-50 border-amber-200 hover:border-amber-400",
    [ReservationStatus.APPROVED]: "bg-emerald-50 border-emerald-200 hover:border-emerald-300",
    [ReservationStatus.REJECTED]: "bg-rose-50 border-rose-200 hover:border-rose-300",
    [ReservationStatus.COMPLETED]: "bg-blue-50 border-blue-200 hover:border-blue-300",
    [ReservationStatus.CANCELLED]: "bg-gray-50 border-gray-200 hover:border-gray-300",
  };

  const statusBadgeStyles: Record<ReservationStatus, string> = {
    [ReservationStatus.PENDING]: "bg-amber-100 text-amber-800 border-amber-300",
    [ReservationStatus.APPROVED]: "bg-emerald-100 text-emerald-800 border-emerald-300",
    [ReservationStatus.REJECTED]: "bg-rose-100 text-rose-800 border-rose-300",
    [ReservationStatus.COMPLETED]: "bg-blue-100 text-blue-800 border-blue-300",
    [ReservationStatus.CANCELLED]: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <div
      className={`
        group relative flex items-stretch gap-0
        rounded-xl border-2 transition-all duration-200 cursor-pointer
        ${statusStyles[reservation.status]}
        ${isSelected ? "ring-2 ring-[#1859A9] ring-offset-2" : ""}
        hover:shadow-md
      `}
      onClick={() => onViewDetails(reservation)}
    >
      {/* Selection Checkbox */}
      {showSelectionCheckbox && isPending && (
        <div
          className="flex items-center justify-center px-3 border-r border-inherit bg-white/50"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect?.(reservation._id, !!checked)}
            className="h-5 w-5 border-2 data-[state=checked]:bg-[#1859A9] data-[state=checked]:border-[#1859A9]"
          />
        </div>
      )}

      {/* Left accent bar */}
      <div
        className={`w-1.5 shrink-0 rounded-l-lg ${
          reservation.status === ReservationStatus.PENDING ? "bg-amber-400" :
          reservation.status === ReservationStatus.APPROVED ? "bg-emerald-500" :
          reservation.status === ReservationStatus.REJECTED ? "bg-rose-400" :
          reservation.status === ReservationStatus.COMPLETED ? "bg-blue-500" :
          "bg-gray-400"
        }`}
      />

      {/* Main content */}
      <div className="flex-1 py-3 px-4 min-w-0">
        <div className="flex items-start justify-between gap-4">
          {/* Left side - User and request info */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Top row: Status, Computer, User */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={`${statusBadgeStyles[reservation.status]} font-semibold text-xs px-2 py-0.5`}
              >
                {STATUS_LABELS[reservation.status]}
              </Badge>

              <Badge
                variant="outline"
                className="bg-[#1859A9]/10 text-[#1859A9] border-[#1859A9]/30 font-mono font-bold"
              >
                <Computer className="h-3 w-3 mr-1" />
                #{displayComputerNumber}
              </Badge>

              <span className="text-sm font-semibold text-gray-900 truncate">
                {reservation.userName}
              </span>
            </div>

            {/* Bottom row: Date, Time, Type */}
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-medium">
                  {formatReservationDate(reservation.reservationDate)}
                </span>
              </div>

              {reservation.timeBlocks && reservation.timeBlocks.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#FF8200]" />
                  <span className="font-semibold text-[#FF8200]">
                    {formatTimeBlocksRange(reservation.timeBlocks)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-gray-400" />
                <span>{USER_TYPE_LABELS[reservation.userType]}</span>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick actions for pending */}
            {isPending && onQuickApprove && onQuickReject && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                  onClick={handleQuickApprove}
                  disabled={isApproving || isRejecting}
                  title="Aprobar"
                >
                  {isApproving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700"
                  onClick={handleQuickReject}
                  disabled={isApproving || isRejecting}
                  title="Rechazar"
                >
                  {isRejecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}

            {/* View details arrow */}
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#1859A9] transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
