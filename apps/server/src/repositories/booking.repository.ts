import type { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "../lib/db.ts";
import { resolvePagination } from "../lib/domain/list.ts";
import type { SortQuery } from "../lib/query.ts";
import type {
  BookingListQuery,
  BookingRecord,
  CreateBookingInput,
  UpdateBookingInput,
} from "../services/bookings/booking.types.ts";

export interface BookingStatusPatch {
  cleanerId?: string | null;
  status: BookingStatus;
}

export interface BookingRepository {
  compareAndUpdate(
    id: string,
    expectedStatus: BookingStatus,
    data: UpdateBookingInput & BookingStatusPatch,
  ): Promise<BookingRecord | null>;
  countByStatus(status: BookingStatus): Promise<number>;
  countTotal(): Promise<number>;
  create(
    input: CreateBookingInput & { status?: BookingStatus },
  ): Promise<BookingRecord>;
  findById(id: string): Promise<BookingRecord | null>;
  findByQuoteRequestId(quoteRequestId: string): Promise<BookingRecord | null>;
  list(
    query: BookingListQuery,
  ): Promise<{ items: BookingRecord[]; total: number }>;
  listRecent(limit: number): Promise<BookingRecord[]>;
  update(id: string, input: UpdateBookingInput): Promise<BookingRecord | null>;
}

function toRecord(row: {
  cleaner: { id: string; name: string } | null;
  cleanerId: string | null;
  createdAt: Date;
  customer: { id: string; name: string } | null;
  customerId: string | null;
  id: string;
  notes: string | null;
  quoteRequestId: string | null;
  scheduledAt: Date | null;
  service: { id: string; name: string } | null;
  serviceAddress: string | null;
  serviceId: string | null;
  status: BookingStatus;
  updatedAt: Date;
}): BookingRecord {
  return {
    cleaner: row.cleaner,
    cleanerId: row.cleanerId,
    createdAt: row.createdAt,
    customer: row.customer,
    customerId: row.customerId,
    id: row.id,
    notes: row.notes,
    quoteRequestId: row.quoteRequestId,
    scheduledAt: row.scheduledAt,
    service: row.service,
    serviceAddress: row.serviceAddress,
    serviceId: row.serviceId,
    status: row.status,
    updatedAt: row.updatedAt,
  };
}

const BOOKING_INCLUDE = {
  cleaner: { select: { id: true, name: true } },
  customer: { select: { id: true, name: true } },
  service: { select: { id: true, name: true } },
} as const;

function orderBy(
  sort: SortQuery | undefined,
): Prisma.BookingOrderByWithRelationInput {
  const direction = sort?.direction ?? "desc";

  switch (sort?.field) {
    case "scheduledAt":
      return { scheduledAt: direction };
    case "status":
      return { status: direction };
    default:
      return { createdAt: direction };
  }
}

export class PrismaBookingRepository implements BookingRepository {
  public async findById(id: string): Promise<BookingRecord | null> {
    const row = await prisma.booking.findUnique({
      include: BOOKING_INCLUDE,
      where: { id },
    });
    return row === null ? null : toRecord(row);
  }

  public async findByQuoteRequestId(
    quoteRequestId: string,
  ): Promise<BookingRecord | null> {
    const row = await prisma.booking.findUnique({
      include: BOOKING_INCLUDE,
      where: { quoteRequestId },
    });
    return row === null ? null : toRecord(row);
  }

  public async create(
    input: CreateBookingInput & { status?: BookingStatus },
  ): Promise<BookingRecord> {
    const row = await prisma.booking.create({
      data: {
        cleanerId: input.cleanerId ?? null,
        customerId: input.customerId,
        notes: input.notes ?? null,
        quoteRequestId: input.quoteRequestId ?? null,
        scheduledAt: input.scheduledAt ?? null,
        serviceAddress: input.serviceAddress ?? null,
        serviceId: input.serviceId,
        status: input.status,
      },
      include: BOOKING_INCLUDE,
    });
    return toRecord(row);
  }

  public async update(
    id: string,
    input: UpdateBookingInput,
  ): Promise<BookingRecord | null> {
    try {
      const row = await prisma.booking.update({
        data: input,
        include: BOOKING_INCLUDE,
        where: { id },
      });
      return toRecord(row);
    } catch {
      return null;
    }
  }

  public async compareAndUpdate(
    id: string,
    expectedStatus: BookingStatus,
    data: UpdateBookingInput & BookingStatusPatch,
  ): Promise<BookingRecord | null> {
    return prisma.$transaction(async (tx) => {
      const result = await tx.booking.updateMany({
        data,
        where: { id, status: expectedStatus },
      });

      if (result.count !== 1) {
        return null;
      }

      const row = await tx.booking.findUnique({
        include: BOOKING_INCLUDE,
        where: { id },
      });
      return row === null ? null : toRecord(row);
    });
  }

  public async list(
    query: BookingListQuery,
  ): Promise<{ items: BookingRecord[]; total: number }> {
    const pagination = resolvePagination(query.pagination);
    const search = query.search?.trim();
    const where: Prisma.BookingWhereInput = {
      ...(query.cleanerId === undefined ? {} : { cleanerId: query.cleanerId }),
      ...(query.customerId === undefined
        ? {}
        : { customerId: query.customerId }),
      ...(query.serviceId === undefined ? {} : { serviceId: query.serviceId }),
      ...(query.status !== undefined
        ? { status: query.status }
        : query.excludeStatuses === undefined ||
            query.excludeStatuses.length === 0
          ? {}
          : { status: { notIn: [...query.excludeStatuses] } }),
      ...(query.scheduledFrom === undefined && query.scheduledTo === undefined
        ? {}
        : {
            scheduledAt: {
              ...(query.scheduledFrom === undefined
                ? {}
                : { gte: query.scheduledFrom }),
              ...(query.scheduledTo === undefined
                ? {}
                : { lte: query.scheduledTo }),
            },
          }),
      ...(search === undefined || search === ""
        ? {}
        : {
            OR: [
              { id: { contains: search, mode: "insensitive" } },
              { customerId: { contains: search, mode: "insensitive" } },
              { service: { name: { contains: search, mode: "insensitive" } } },
            ],
          }),
    };

    const [total, rows] = await prisma.$transaction([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        include: BOOKING_INCLUDE,
        orderBy: orderBy(query.sort),
        skip: pagination.skip,
        take: pagination.limit,
        where,
      }),
    ]);

    return { items: rows.map(toRecord), total };
  }

  public async listRecent(limit: number): Promise<BookingRecord[]> {
    const rows = await prisma.booking.findMany({
      include: BOOKING_INCLUDE,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map(toRecord);
  }

  public async countTotal(): Promise<number> {
    return prisma.booking.count();
  }

  public async countByStatus(status: BookingStatus): Promise<number> {
    return prisma.booking.count({ where: { status } });
  }
}
