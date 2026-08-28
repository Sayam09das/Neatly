import { describe, expect, it } from "vitest";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import { AuthorizationError } from "../../../apps/server/src/lib/errors.ts";
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
});
