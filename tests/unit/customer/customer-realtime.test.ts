import { afterEach, describe, expect, it, vi } from "vitest";
import {
  parseCustomerRealtimeEvent,
  shouldToastCustomerEvent,
} from "@/lib/realtime/customer-event";
import { connectCustomerNotificationStream } from "@/lib/realtime/customer-notification-stream";

const validEvent = {
  entityId: "booking-1",
  eventId: "evt-1",
  message: "Your booking request was received.",
  notificationId: "notif-1",
  relatedHref: "/dashboard/bookings/booking-1",
  timestamp: "2026-08-29T00:00:00.000Z",
  title: "Booking requested",
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

describe("Customer realtime client", (): void => {
  afterEach((): void => {
    FakeEventSource.instances = [];
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("parses valid events and ignores malformed or duplicate ids", (): void => {
    expect(parseCustomerRealtimeEvent(validEvent)).toEqual(validEvent);
    expect(parseCustomerRealtimeEvent({ type: "BOOKING_CREATED" })).toBeNull();
    expect(parseCustomerRealtimeEvent("not-json")).toBeNull();
    expect(
      parseCustomerRealtimeEvent({
        ...validEvent,
        recipientId: "customer-b",
        type: "BOOKING_CREATED",
      }),
    ).toEqual(validEvent);
  });

  it("toasts only persisted inbox events", (): void => {
    expect(shouldToastCustomerEvent(validEvent)).toBe(true);
    expect(
      shouldToastCustomerEvent({
        ...validEvent,
        notificationId: null,
      }),
    ).toBe(false);
  });

  it("reconnects with backoff and ignores duplicate stream events", (): void => {
    vi.useFakeTimers();
    vi.stubGlobal("EventSource", FakeEventSource);
    const onEvent = vi.fn();
    const onStatus = vi.fn();
    const stream = connectCustomerNotificationStream({
      onEvent,
      onStatus,
      url: "/api/v1/customer/notifications/stream",
    });

    expect(FakeEventSource.instances).toHaveLength(1);
    expect(FakeEventSource.instances[0]?.url).toBe(
      "/api/v1/customer/notifications/stream",
    );
    FakeEventSource.instances[0]?.emit("ready");
    FakeEventSource.instances[0]?.emit("customer", JSON.stringify(validEvent));
    FakeEventSource.instances[0]?.emit("customer", JSON.stringify(validEvent));
    FakeEventSource.instances[0]?.emit("admin", JSON.stringify(validEvent));
    FakeEventSource.instances[0]?.emit("customer", "{not-json");
    expect(onEvent).toHaveBeenCalledTimes(1);

    FakeEventSource.instances[0]?.fail();
    vi.advanceTimersByTime(1000);
    expect(FakeEventSource.instances).toHaveLength(2);
    expect(onStatus).toHaveBeenCalledWith("reconnecting");

    stream.close();
  });
});
