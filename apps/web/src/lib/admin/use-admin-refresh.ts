"use client";

import { useEffect } from "react";
import {
  type AdminRefreshKey,
  subscribeAdminRefresh,
} from "@/lib/admin/refresh-bus";

export function useAdminRefresh(
  key: AdminRefreshKey,
  onRefresh: () => void,
): void {
  useEffect((): (() => void) => {
    return subscribeAdminRefresh(key, onRefresh);
  }, [key, onRefresh]);
}
