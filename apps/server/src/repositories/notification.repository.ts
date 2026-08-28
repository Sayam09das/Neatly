import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/db.ts";
import { resolvePagination } from "../lib/domain/list.ts";
import type { SortQuery } from "../lib/query.ts";
import type {
  CreateNotificationInput,
  NotificationListQuery,
  NotificationRecord,
} from "../services/notifications/notification.types.ts";

export interface NotificationRepository {
  create(input: CreateNotificationInput): Promise<NotificationRecord>;
  deleteById(id: string): Promise<boolean>;
  findById(id: string): Promise<NotificationRecord | null>;
  list(
    query: NotificationListQuery,
  ): Promise<{ items: NotificationRecord[]; total: number }>;
  markAllRead(recipientId: string, readAt: Date): Promise<number>;
  markRead(id: string, readAt: Date): Promise<NotificationRecord | null>;
}

function toRecord(row: {
  createdAt: Date;
  id: string;
  isRead: boolean;
  message: string;
  readAt: Date | null;
  recipientId: string;
  relatedHref: string | null;
  relatedLabel: string | null;
  title: string;
}): NotificationRecord {
  return {
    createdAt: row.createdAt,
    id: row.id,
    isRead: row.isRead,
    message: row.message,
    readAt: row.readAt,
    recipientId: row.recipientId,
    relatedHref: row.relatedHref,
    relatedLabel: row.relatedLabel,
    title: row.title,
  };
}

function orderBy(
  sort: SortQuery | undefined,
): Prisma.NotificationOrderByWithRelationInput {
  return { createdAt: sort?.direction ?? "desc" };
}

export class PrismaNotificationRepository implements NotificationRepository {
  public async findById(id: string): Promise<NotificationRecord | null> {
    const row = await prisma.notification.findUnique({ where: { id } });
    return row === null ? null : toRecord(row);
  }

  public async create(
    input: CreateNotificationInput,
  ): Promise<NotificationRecord> {
    const row = await prisma.notification.create({
      data: {
        message: input.message,
        recipientId: input.recipientId,
        relatedHref: input.relatedHref ?? null,
        relatedLabel: input.relatedLabel ?? null,
        title: input.title,
      },
    });
    return toRecord(row);
  }

  public async list(
    query: NotificationListQuery,
  ): Promise<{ items: NotificationRecord[]; total: number }> {
    const pagination = resolvePagination(query.pagination);
    const where: Prisma.NotificationWhereInput = {
      recipientId: query.recipientId,
      ...(query.unreadOnly === true ? { isRead: false } : {}),
    };

    const [total, rows] = await prisma.$transaction([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        orderBy: orderBy(query.sort),
        skip: pagination.skip,
        take: pagination.limit,
        where,
      }),
    ]);

    return { items: rows.map(toRecord), total };
  }

  public async markRead(
    id: string,
    readAt: Date,
  ): Promise<NotificationRecord | null> {
    try {
      const row = await prisma.notification.update({
        data: { isRead: true, readAt },
        where: { id },
      });
      return toRecord(row);
    } catch {
      return null;
    }
  }

  public async markAllRead(recipientId: string, readAt: Date): Promise<number> {
    const result = await prisma.notification.updateMany({
      data: { isRead: true, readAt },
      where: { isRead: false, recipientId },
    });
    return result.count;
  }

  public async deleteById(id: string): Promise<boolean> {
    try {
      await prisma.notification.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
