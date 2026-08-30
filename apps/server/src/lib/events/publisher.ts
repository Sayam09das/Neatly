import { randomUUID } from "node:crypto";
import type { Actor } from "../domain/actor.ts";
import { getDomainServices } from "../domain/runtime.ts";
import { logError } from "../logger.ts";
import {
  publishAdminSse,
  publishCustomerSse,
} from "./admin-connection-manager.ts";
import { CUSTOMER_APP_HREFS } from "./customer-event-copy.ts";
import type {
  AdminDomainEvent,
  AdminDomainEventInput,
  CustomerRealtimeEventType,
} from "./event-types.ts";

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
    entityId: string;
    message: string;
    relatedHref: string;
    relatedLabel: string;
    title: string;
    type: CustomerRealtimeEventType;
  },
): Promise<void> {
  try {
    const notification = await getDomainServices().notifications.record({
      message: input.message,
      recipientId: recipientUserId,
      relatedHref: input.relatedHref,
      relatedLabel: input.relatedLabel,
      title: input.title,
    });
    publishCustomerSse(recipientUserId, {
      entityId: input.entityId,
      eventId: randomUUID(),
      message: input.message,
      notificationId: notification.id,
      relatedHref: input.relatedHref,
      timestamp: new Date().toISOString(),
      title: input.title,
      type: input.type,
    });
  } catch {
    logError("Customer notification persist failed", { title: input.title });
  }
}

export async function notifyBookingOwner(
  actor: Actor,
  booking: { customerId: string | null; id: string },
  input: {
    message: string;
    relatedLabel: string;
    title: string;
    type: CustomerRealtimeEventType;
  },
): Promise<void> {
  if (booking.customerId === null) {
    return;
  }

  try {
    const customer = await getDomainServices().customers.getById(
      actor,
      booking.customerId,
    );

    if (customer.userId === null) {
      return;
    }

    await recordCustomerInboxNotification(customer.userId, {
      entityId: booking.id,
      message: input.message,
      relatedHref: CUSTOMER_APP_HREFS.booking(booking.id),
      relatedLabel: input.relatedLabel,
      title: input.title,
      type: input.type,
    });
  } catch {
    logError("Customer booking notice failed", { type: input.type });
  }
}

export async function notifyQuoteOwner(
  quote: { email: string; id: string },
  input: {
    message: string;
    relatedLabel: string;
    title: string;
    type: CustomerRealtimeEventType;
  },
): Promise<void> {
  try {
    const recipientUserId =
      await getDomainServices().customers.findUserIdByEmail(quote.email);

    if (recipientUserId === null) {
      return;
    }

    await recordCustomerInboxNotification(recipientUserId, {
      entityId: quote.id,
      message: input.message,
      relatedHref: CUSTOMER_APP_HREFS.quote(quote.id),
      relatedLabel: input.relatedLabel,
      title: input.title,
      type: input.type,
    });
  } catch {
    logError("Customer quote notice failed", { type: input.type });
  }
}
