import {
  type Actor,
  isAdminActor,
  requireAdminActor,
} from "../../lib/domain/actor.ts";
import { notificationNotFound } from "../../lib/domain/errors.ts";
import {
  type ListResult,
  resolvePagination,
  resolveSort,
  toListResult,
} from "../../lib/domain/list.ts";
import { AuthorizationError, ValidationError } from "../../lib/errors.ts";
import type { NotificationRepository } from "../../repositories/notification.repository.ts";
import {
  type CreateNotificationInput,
  NOTIFICATION_SORT_FIELDS,
  type NotificationListQuery,
  type NotificationRecord,
} from "./notification.types.ts";

export class NotificationService {
  private readonly notifications: NotificationRepository;
  private readonly now: () => Date;

  public constructor(
    notifications: NotificationRepository,
    now: () => Date = (): Date => new Date(),
  ) {
    this.notifications = notifications;
    this.now = now;
  }

  public async create(
    actor: Actor,
    input: CreateNotificationInput,
  ): Promise<NotificationRecord> {
    requireAdminActor(actor);

    return this.notifications.create({
      message: requireText(input.message, "message"),
      recipientId: input.recipientId,
      relatedHref: input.relatedHref ?? null,
      relatedLabel: input.relatedLabel ?? null,
      title: requireText(input.title, "title"),
    });
  }

  public async list(
    actor: Actor,
    query: NotificationListQuery,
  ): Promise<ListResult<NotificationRecord>> {
    assertRecipientAccess(actor, query.recipientId);
    const pagination = resolvePagination(query.pagination);
    const sort = resolveSort(query.sort, NOTIFICATION_SORT_FIELDS);
    const result = await this.notifications.list({
      ...query,
      pagination,
      sort,
    });
    return toListResult(result.items, result.total, pagination);
  }

  public async markRead(actor: Actor, id: string): Promise<NotificationRecord> {
    const notification = await this.requireNotification(id);
    assertRecipientAccess(actor, notification.recipientId);

    if (notification.isRead) {
      return notification;
    }

    const updated = await this.notifications.markRead(id, this.now());

    if (updated === null) {
      throw notificationNotFound();
    }

    return updated;
  }

  public async markAllRead(actor: Actor, recipientId: string): Promise<number> {
    assertRecipientAccess(actor, recipientId);
    return this.notifications.markAllRead(recipientId, this.now());
  }

  public async remove(actor: Actor, id: string): Promise<void> {
    const notification = await this.requireNotification(id);
    assertRecipientAccess(actor, notification.recipientId);
    await this.notifications.deleteById(id);
  }

  private async requireNotification(id: string): Promise<NotificationRecord> {
    const notification = await this.notifications.findById(id);

    if (notification === null) {
      throw notificationNotFound();
    }

    return notification;
  }
}

function assertRecipientAccess(actor: Actor, recipientId: string): void {
  if (isAdminActor(actor) || actor.id === recipientId) {
    return;
  }

  throw new AuthorizationError();
}

function requireText(value: string, field: string): string {
  const trimmed = value.trim();

  if (trimmed === "") {
    throw new ValidationError("Validation failed.", [
      { field, issue: "This field is required." },
    ]);
  }

  return trimmed;
}
