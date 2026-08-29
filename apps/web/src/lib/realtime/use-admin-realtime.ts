"use client";

import {
  type AdminRealtimeContextValue,
  useOptionalAdminRealtime,
} from "@/components/admin/admin-realtime-provider";

export function useAdminRealtime(): AdminRealtimeContextValue | null {
  return useOptionalAdminRealtime();
}
