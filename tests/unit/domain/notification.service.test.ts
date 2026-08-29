import { describe, expect, it } from "vitest";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import {
  AuthorizationError,
  NotFoundError,
} from "../../../apps/server/src/lib/errors.ts";
import { createDomainHarness } from "./in-memory-domain.ts";

const admin: Actor = { id: "admin-1", role: "ADMIN" };
const recipient: Actor = { id: "admin-2", role: "STAFF" };
const stranger: Actor = { id: "customer-1", role: "CUSTOMER" };
const readAt = new Date("2026-08-29T00:00:00.000Z");

describe("NotificationService", (): void => {
  it("creates, lists, marks read, and deletes notifications", async (): Promise<void> => {
    const { notifications } = createDomainHarness(() => readAt);
    const created = await notifications.create(admin, {
      message: "A new quote arrived.",
      recipientId: recipient.id,
      title: "New quote",
    });

    expect(created.isRead).toBe(false);

    const listed = await notifications.list(recipient, {
      recipientId: recipient.id,
    });
    expect(listed.items).toHaveLength(1);

    const read = await notifications.markRead(recipient, created.id);
    expect(read.isRead).toBe(true);
    expect(read.readAt).toEqual(readAt);

    const second = await notifications.create(admin, {
      message: "Booking assigned.",
      recipientId: recipient.id,
      title: "Assigned",
    });
    const marked = await notifications.markAllRead(admin, recipient.id);
    expect(marked).toBe(1);

    await notifications.remove(recipient, second.id);
    const remaining = await notifications.list(admin, {
      recipientId: recipient.id,
    });
    expect(remaining.items).toHaveLength(1);
  });

  it("blocks other recipients from reading another inbox", async (): Promise<void> => {
    const { notifications } = createDomainHarness();
    const created = await notifications.create(admin, {
      message: "Private",
      recipientId: recipient.id,
      title: "Notice",
    });

    await expect(
      notifications.list(stranger, { recipientId: recipient.id }),
    ).rejects.toBeInstanceOf(AuthorizationError);
    await expect(
      notifications.markRead(stranger, created.id),
    ).rejects.toBeInstanceOf(AuthorizationError);
    await expect(
      notifications.create(stranger, {
        message: "Nope",
        recipientId: recipient.id,
        title: "Nope",
      }),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("lists and marks only the session customer's inbox", async (): Promise<void> => {
    const { notifications } = createDomainHarness(() => readAt);
    const identity = {
      email: "ada@neatly.example",
      id: "customer-a",
      name: "Ada",
    };
    const own = await notifications.record({
      message: "Your booking request was received.",
      recipientId: identity.id,
      relatedHref: "/dashboard/bookings/clbooking0000000000000001",
      relatedLabel: "View booking",
      title: "Booking requested",
    });
    const foreign = await notifications.record({
      message: "Admin only",
      recipientId: recipient.id,
      relatedHref: "/admin/bookings",
      relatedLabel: "View bookings",
      title: "New booking",
    });

    const listed = await notifications.listForCustomer(identity);
    expect(listed.items).toHaveLength(1);
    expect(listed.items[0]?.id).toBe(own.id);
    expect(listed.items[0]?.relatedHref).toBe(
      "/dashboard/bookings/clbooking0000000000000001",
    );
    expect(JSON.stringify(listed)).not.toContain("recipientId");
    expect(JSON.stringify(listed)).not.toContain("/admin/");

    expect(await notifications.countUnreadForCustomer(identity)).toBe(1);
    const read = await notifications.markReadForCustomer(identity, own.id);
    expect(read.isRead).toBe(true);
    expect(await notifications.countUnreadForCustomer(identity)).toBe(0);

    const other = await notifications.record({
      message: "Second",
      recipientId: identity.id,
      title: "Another",
    });
    expect(await notifications.markAllReadForCustomer(identity)).toBe(1);
    expect(
      (await notifications.getForCustomer(identity, other.id)).isRead,
    ).toBe(true);

    await expect(
      notifications.getForCustomer(identity, foreign.id),
    ).rejects.toBeInstanceOf(NotFoundError);
    await expect(
      notifications.markReadForCustomer(identity, foreign.id),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
