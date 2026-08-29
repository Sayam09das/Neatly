"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { subscribeCustomerCacheClear } from "@/lib/customer/cache";
import { countUnreadCustomerNotifications } from "@/lib/customer/notifications";
import {
  type CustomerRealtimeEvent,
  shouldToastCustomerEvent,
} from "@/lib/realtime/customer-event";
import {
  type CustomerRealtimeStatus,
  connectCustomerNotificationStream,
} from "@/lib/realtime/customer-notification-stream";
import { toast } from "@/lib/toast";

export interface CustomerRealtimeContextValue {
  refreshUnread: () => void;
  status: CustomerRealtimeStatus;
  unreadCount: number;
}

const CustomerRealtimeContext =
  createContext<CustomerRealtimeContextValue | null>(null);

interface CustomerRealtimeProviderProps {
  children: ReactNode;
}

export function CustomerRealtimeProvider({
  children,
}: CustomerRealtimeProviderProps): ReactElement {
  const router = useRouter();
  const [status, setStatus] = useState<CustomerRealtimeStatus>("connecting");
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnread = useCallback((): void => {
    void countUnreadCustomerNotifications().then((result): void => {
      if (result.ok) {
        setUnreadCount(result.data.count);
      }
    });
  }, []);

  useEffect((): (() => void) => {
    const unsubscribe = subscribeCustomerCacheClear((): void => {
      setUnreadCount(0);
    });

    refreshUnread();

    if (typeof EventSource === "undefined") {
      setStatus("disconnected");
      return unsubscribe;
    }

    const stream = connectCustomerNotificationStream({
      onEvent: (event: CustomerRealtimeEvent): void => {
        refreshUnread();
        router.refresh();

        if (shouldToastCustomerEvent(event)) {
          toast.info({
            description: event.message,
            title: event.title,
          });
        }
      },
      onOpen: (): void => {
        refreshUnread();
        router.refresh();
      },
      onStatus: setStatus,
    });

    return (): void => {
      unsubscribe();
      stream.close();
    };
  }, [refreshUnread, router]);

  const value = useMemo(
    (): CustomerRealtimeContextValue => ({
      refreshUnread,
      status,
      unreadCount,
    }),
    [refreshUnread, status, unreadCount],
  );

  return (
    <CustomerRealtimeContext.Provider value={value}>
      {children}
    </CustomerRealtimeContext.Provider>
  );
}

export function useOptionalCustomerRealtime(): CustomerRealtimeContextValue | null {
  return useContext(CustomerRealtimeContext);
}
