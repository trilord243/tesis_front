"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface PendingBadgeProps {
  className?: string;
}

export function PendingBadge({ className }: PendingBadgeProps) {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        // Fetch pending lab reservations
        const labResponse = await fetch("/api/lab-reservations?status=pending");
        const labData = await labResponse.json();
        const labPending = Array.isArray(labData) ? labData.length : 0;

        // Fetch pending lens requests
        const lensResponse = await fetch("/api/lens-requests?status=pendiente");
        const lensData = await lensResponse.json();
        const lensPending = Array.isArray(lensData) ? lensData.length : 0;

        // Fetch pending metaverse reservations
        const metaverseResponse = await fetch("/api/metaverse-reservations?status=pending");
        const metaverseData = await metaverseResponse.json();
        const metaversePending = Array.isArray(metaverseData) ? metaverseData.length : 0;

        setPendingCount(labPending + lensPending + metaversePending);
      } catch (error) {
        console.error("Error fetching pending count:", error);
        setPendingCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || pendingCount === 0) {
    return null;
  }

  return (
    <Badge
      className={`absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center px-1.5 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse ${className}`}
    >
      {pendingCount > 99 ? "99+" : pendingCount}
    </Badge>
  );
}
