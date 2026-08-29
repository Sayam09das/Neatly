import { CUSTOMER_API_PATHS } from "@/config/customer";
import {
  type CustomerRealtimeEvent,
  createEventIdDedupe,
  parseCustomerRealtimeEvent,
} from "@/lib/realtime/customer-event";

export type CustomerRealtimeStatus =
  | "connected"
  | "connecting"
  | "disconnected"
  | "reconnecting";

export interface CustomerNotificationStreamOptions {
  onEvent: (event: CustomerRealtimeEvent) => void;
  onOpen?: () => void;
  onStatus?: (status: CustomerRealtimeStatus) => void;
  url?: string;
}

const BACKOFF_MS = [1000, 2000, 4000, 8000, 16_000] as const;

export interface CustomerNotificationStream {
  close: () => void;
}

export function connectCustomerNotificationStream(
  options: CustomerNotificationStreamOptions,
): CustomerNotificationStream {
  const url = options.url ?? CUSTOMER_API_PATHS.notificationsStream;
  const dedupe = createEventIdDedupe();
  let closed = false;
  let source: EventSource | null = null;
  let retryAttempt = 0;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  const setStatus = (status: CustomerRealtimeStatus): void => {
    options.onStatus?.(status);
  };

  const handleMessage = (data: string): void => {
    let parsed: unknown;

    try {
      parsed = JSON.parse(data) as unknown;
    } catch {
      return;
    }

    const event = parseCustomerRealtimeEvent(parsed);

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

    source.addEventListener(
      "customer",
      (message: MessageEvent<string>): void => {
        retryAttempt = 0;
        setStatus("connected");
        handleMessage(message.data);
      },
    );

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
