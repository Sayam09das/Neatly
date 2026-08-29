import { randomUUID } from "node:crypto";
import type { Actor } from "../domain/actor.ts";
import { getDomainServices } from "../domain/runtime.ts";
import { logError } from "../logger.ts";
import { publishAdminSse } from "./admin-connection-manager.ts";
import type { AdminDomainEvent, AdminDomainEventInput } from "./event-types.ts";

export interface PublishAdminEventOptions {
  notificationId?: string | null;
  persist?: boolean;
  recipientIds?: readonly string[];
}

export async function publishAdminDomainEvent(
  actor: Actor,
  input: Omit<AdminDomainEventInput, "actorId">,
  options: PublishAdminEventOptions = {},
): Promise<void> {
  try {
    const services = getDomainServices();
    const recipientIds =
      options.recipientIds ?? (await services.users.listAdminRecipientIds());
    const persistOthers = options.persist ?? true;
    const timestamp = new Date().toISOString();

    for (const recipientId of recipientIds) {
      let notificationId = options.notificationId ?? null;
      const shouldPersist =
        persistOthers &&
        recipientId !== actor.id &&
        options.notificationId === undefined;

      if (shouldPersist) {
        const notification = await services.notifications.record({
          message: input.message,
          recipientId,
          relatedHref: input.relatedHref,
          relatedLabel: input.relatedLabel,
          title: input.title,
        });
        notificationId = notification.id;
      }

      const event: AdminDomainEvent = {
        actorId: actor.id,
        entityId: input.entityId,
        eventId: randomUUID(),
        message: input.message,
        notificationId,
        relatedHref: input.relatedHref,
        timestamp,
        title: input.title,
        type: input.type,
      };

      publishAdminSse(recipientId, event);
    }
  } catch {
    logError("Admin domain event publish failed", { type: input.type });
  }
}

export async function recordCustomerInboxNotification(
  recipientUserId: string,
  input: {
    message: string;
    relatedHref: string;
    relatedLabel: string;
    title: string;
  },
): Promise<void> {
  try {
    await getDomainServices().notifications.record({
      message: input.message,
      recipientId: recipientUserId,
      relatedHref: input.relatedHref,
      relatedLabel: input.relatedLabel,
      title: input.title,
    });
  } catch {
    logError("Customer notification persist failed", { title: input.title });
  }
}
