"use client";

import {
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { countUnreadAdminNotifications } from "@/lib/admin/notifications";
import {
  publishAdminRefresh,
  refreshKeysForAdminEvent,
} from "@/lib/admin/refresh-bus";
import {
  type AdminRealtimeEvent,
  shouldToastAdminEvent,
} from "@/lib/realtime/admin-event";
import {
  type AdminRealtimeStatus,
  connectAdminNotificationStream,
} from "@/lib/realtime/admin-notification-stream";
import { toast } from "@/lib/toast";

export interface AdminRealtimeContextValue {
  status: AdminRealtimeStatus;
  unreadCount: number;
}

const AdminRealtimeContext = createContext<AdminRealtimeContextValue | null>(
  null,
);

interface AdminRealtimeProviderProps {
  children: ReactNode;
}

export function AdminRealtimeProvider({
  children,
}: AdminRealtimeProviderProps): ReactElement {
  const [status, setStatus] = useState<AdminRealtimeStatus>("connecting");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect((): (() => void) | undefined => {
    if (typeof EventSource === "undefined") {
      return undefined;
    }

    const syncUnread = (): void => {
      void countUnreadAdminNotifications().then((result): void => {
        if (result.ok) {
          setUnreadCount(result.data.count);
        }
      });
    };

    const stream = connectAdminNotificationStream({
      onEvent: (event: AdminRealtimeEvent): void => {
        if (event.notificationId !== null) {
          setUnreadCount((current) => current + 1);

          if (shouldToastAdminEvent(event)) {
            toast.info({
              description: event.message,
              title: event.title,
            });
          }
        }

        publishAdminRefresh(refreshKeysForAdminEvent(event.type));
      },
      onOpen: (): void => {
        syncUnread();
        publishAdminRefresh(["notifications"]);
      },
      onStatus: setStatus,
    });

    syncUnread();

    return (): void => {
      stream.close();
    };
  }, []);

  const value = useMemo(
    (): AdminRealtimeContextValue => ({
      status,
      unreadCount,
    }),
    [status, unreadCount],
  );

  return (
    <AdminRealtimeContext.Provider value={value}>
      {children}
    </AdminRealtimeContext.Provider>
  );
}

export function useOptionalAdminRealtime(): AdminRealtimeContextValue | null {
  return useContext(AdminRealtimeContext);
}
