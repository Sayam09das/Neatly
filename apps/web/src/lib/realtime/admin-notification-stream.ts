import { ADMIN_API_PATHS } from "@/config/admin-api";
import {
  type AdminRealtimeEvent,
  createEventIdDedupe,
  parseAdminRealtimeEvent,
} from "@/lib/realtime/admin-event";

export type AdminRealtimeStatus =
  | "connected"
  | "connecting"
  | "disconnected"
  | "reconnecting";

export interface AdminNotificationStreamOptions {
  onEvent: (event: AdminRealtimeEvent) => void;
  onOpen?: () => void;
  onStatus?: (status: AdminRealtimeStatus) => void;
  url?: string;
}

const BACKOFF_MS = [1000, 2000, 4000, 8000, 16_000] as const;

export interface AdminNotificationStream {
  close: () => void;
}

export function connectAdminNotificationStream(
  options: AdminNotificationStreamOptions,
): AdminNotificationStream {
  const url = options.url ?? ADMIN_API_PATHS.notificationStream;
  const dedupe = createEventIdDedupe();
  let closed = false;
  let source: EventSource | null = null;
  let retryAttempt = 0;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  const setStatus = (status: AdminRealtimeStatus): void => {
    options.onStatus?.(status);
  };

  const handleMessage = (data: string): void => {
    let parsed: unknown;

    try {
      parsed = JSON.parse(data) as unknown;
    } catch {
      return;
    }

    const event = parseAdminRealtimeEvent(parsed);

    if (event === null) {
      return;
    }

    if (!dedupe.take(event.eventId)) {
      return;
    }

    options.onEvent(event);
  };

  if (typeof EventSource === "undefined") {
    setStatus("disconnected");
    return {
      close: (): void => {
        closed = true;
        setStatus("disconnected");
      },
    };
  }

  const connect = (): void => {
    if (closed) {
      return;
    }

    setStatus(retryAttempt === 0 ? "connecting" : "reconnecting");
    source = new EventSource(url);

    source.addEventListener("ready", (): void => {
      retryAttempt = 0;
      setStatus("connected");
      options.onOpen?.();
    });

    source.addEventListener("admin", (message: MessageEvent<string>): void => {
      retryAttempt = 0;
      setStatus("connected");
      handleMessage(message.data);
    });

    source.onerror = (): void => {
      source?.close();
      source = null;

      if (closed) {
        return;
      }

      const delay = BACKOFF_MS[Math.min(retryAttempt, BACKOFF_MS.length - 1)];
      retryAttempt += 1;
      setStatus("reconnecting");
      retryTimer = setTimeout(connect, delay);
    };
  };

  connect();

  return {
    close: (): void => {
      closed = true;

      if (retryTimer !== null) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }

      source?.close();
      source = null;
      setStatus("disconnected");
    },
  };
}
