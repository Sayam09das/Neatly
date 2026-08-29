import { afterEach, describe, expect, it, vi } from "vitest";
import {
  publishAdminRefresh,
  refreshKeysForAdminEvent,
  subscribeAdminRefresh,
} from "@/lib/admin/refresh-bus";
import {
  createEventIdDedupe,
  parseAdminRealtimeEvent,
  shouldToastAdminEvent,
} from "@/lib/realtime/admin-event";
import { connectAdminNotificationStream } from "@/lib/realtime/admin-notification-stream";

const validEvent = {
  actorId: "admin-1",
  entityId: "booking-1",
  eventId: "evt-1",
  message: "A new booking requires attention.",
  notificationId: "notif-1",
  relatedHref: "/admin/bookings",
  timestamp: "2026-08-29T00:00:00.000Z",
  title: "New booking",
  type: "BOOKING_CREATED",
} as const;

class FakeEventSource {
  public static instances: FakeEventSource[] = [];
  public onerror: (() => void) | null = null;
  public readonly url: string;
  private readonly listeners = new Map<
    string,
    ((event: MessageEvent<string>) => void)[]
  >();

  public constructor(url: string) {
    this.url = url;
    FakeEventSource.instances.push(this);
  }

  public addEventListener(
    type: string,
    listener: (event: MessageEvent<string>) => void,
  ): void {
    const current = this.listeners.get(type) ?? [];
    current.push(listener);
    this.listeners.set(type, current);
  }

  public close(): void {}

  public emit(type: string, data = ""): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener({ data } as MessageEvent<string>);
    }
  }

  public fail(): void {
    this.onerror?.();
  }
}

describe("Admin realtime client", (): void => {
  afterEach((): void => {
    FakeEventSource.instances = [];
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("parses valid events and ignores malformed or duplicate ids", (): void => {
    expect(parseAdminRealtimeEvent(validEvent)).toEqual(validEvent);
    expect(parseAdminRealtimeEvent({ type: "BOOKING_CREATED" })).toBeNull();
    expect(parseAdminRealtimeEvent("not-json")).toBeNull();

    const dedupe = createEventIdDedupe(2);
    expect(dedupe.take("evt-1")).toBe(true);
    expect(dedupe.take("evt-1")).toBe(false);
    expect(dedupe.take("evt-2")).toBe(true);
    expect(dedupe.take("evt-3")).toBe(true);
    expect(dedupe.take("evt-1")).toBe(true);
  });

  it("toasts persisted important events only", (): void => {
    expect(shouldToastAdminEvent(validEvent)).toBe(true);
    expect(
      shouldToastAdminEvent({
        ...validEvent,
        notificationId: null,
      }),
    ).toBe(false);
    expect(
      shouldToastAdminEvent({
        ...validEvent,
        type: "CUSTOMER_UPDATED",
      }),
    ).toBe(false);
  });

  it("maps events to targeted refresh keys", (): void => {
    expect(refreshKeysForAdminEvent("BOOKING_CREATED")).toEqual([
      "bookings",
      "dashboard",
      "notifications",
    ]);
    expect(refreshKeysForAdminEvent("SERVICE_UPDATED")).toEqual([
      "services",
      "notifications",
    ]);

    const listener = vi.fn();
    const unsubscribe = subscribeAdminRefresh("bookings", listener);
    publishAdminRefresh(["bookings", "bookings"]);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    publishAdminRefresh(["bookings"]);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("reconnects with backoff and ignores duplicate stream events", (): void => {
    vi.useFakeTimers();
    vi.stubGlobal("EventSource", FakeEventSource);
    const onEvent = vi.fn();
    const onStatus = vi.fn();
    const stream = connectAdminNotificationStream({
      onEvent,
      onStatus,
      url: "/api/v1/admin/notifications/stream",
    });

    expect(FakeEventSource.instances).toHaveLength(1);
    FakeEventSource.instances[0]?.emit("ready");
    FakeEventSource.instances[0]?.emit("admin", JSON.stringify(validEvent));
    FakeEventSource.instances[0]?.emit("admin", JSON.stringify(validEvent));
    FakeEventSource.instances[0]?.emit("admin", "{not-json");
    expect(onEvent).toHaveBeenCalledTimes(1);

    FakeEventSource.instances[0]?.fail();
    vi.advanceTimersByTime(1000);
    expect(FakeEventSource.instances).toHaveLength(2);
    expect(onStatus).toHaveBeenCalledWith("reconnecting");

    stream.close();
    expect(onStatus).toHaveBeenCalledWith("disconnected");
  });
});
