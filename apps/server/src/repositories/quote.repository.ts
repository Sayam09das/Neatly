import { Prisma, type QuoteStatus } from "@prisma/client";
import { prisma } from "../lib/db.ts";
import type { PaginationQuery, SortQuery } from "../lib/query.ts";
import type {
  AdminQuoteListQuery,
  CreateQuoteRequestInput,
  QuoteRequestRecord,
  QuoteServiceSummary,
  UpdateAdminQuoteInput,
} from "../services/quotes/quote.types.ts";

export interface QuoteListByEmailQuery {
  email: string;
  pagination: PaginationQuery;
  status?: QuoteStatus;
}

export interface QuoteStatusPatch {
  quotedAmount?: number | null;
  status: QuoteStatus;
}

export interface QuoteRepository {
  compareAndUpdate(
    id: string,
    expectedStatus: QuoteStatus,
    data: UpdateAdminQuoteInput & QuoteStatusPatch,
  ): Promise<QuoteRequestRecord | null>;
  create(input: CreateQuoteRequestInput): Promise<QuoteRequestRecord>;
  findById(id: string): Promise<QuoteRequestRecord | null>;
  findByIdForEmail(
    id: string,
    email: string,
  ): Promise<QuoteRequestRecord | null>;
  list(
    query: AdminQuoteListQuery & { pagination: PaginationQuery },
  ): Promise<{ items: QuoteRequestRecord[]; total: number }>;
  listByEmail(
    query: QuoteListByEmailQuery,
  ): Promise<{ items: QuoteRequestRecord[]; total: number }>;
  update(
    id: string,
    input: UpdateAdminQuoteInput & Partial<QuoteStatusPatch>,
  ): Promise<QuoteRequestRecord | null>;
}

const quoteRequestSelect = {
  additionalNotes: true,
  adminNotes: true,
  approximateSize: true,
  bathrooms: true,
  bedrooms: true,
  booking: { select: { id: true } },
  createdAt: true,
  email: true,
  frequency: true,
  fullName: true,
  id: true,
  phone: true,
  preferredDate: true,
  preferredTime: true,
  propertyType: true,
  quotedAmount: true,
  service: { select: { id: true, name: true, slug: true } },
  serviceAddress: true,
  serviceId: true,
  serviceType: true,
  status: true,
  updatedAt: true,
} as const;

function toNumber(value: Prisma.Decimal | number | null): number | null {
  if (value === null) {
    return null;
  }

  return typeof value === "number" ? value : value.toNumber();
}

function toService(
  service: QuoteServiceSummary | null,
): QuoteServiceSummary | null {
  return service;
}

function toRecord(row: {
  additionalNotes: string | null;
  adminNotes: string | null;
  approximateSize: string;
  bathrooms: Prisma.Decimal | null;
  bedrooms: number | null;
  booking: { id: string } | null;
  createdAt: Date;
  email: string;
  frequency: QuoteRequestRecord["frequency"];
  fullName: string;
  id: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  propertyType: QuoteRequestRecord["propertyType"];
  quotedAmount: Prisma.Decimal | null;
  service: QuoteServiceSummary | null;
  serviceAddress: string;
  serviceId: string | null;
  serviceType: QuoteRequestRecord["serviceType"];
  status: QuoteRequestRecord["status"];
  updatedAt: Date;
}): QuoteRequestRecord {
  return {
    additionalNotes: row.additionalNotes,
    adminNotes: row.adminNotes,
    approximateSize: row.approximateSize,
    bathrooms: toNumber(row.bathrooms),
    bedrooms: row.bedrooms,
    bookingId: row.booking?.id ?? null,
    createdAt: row.createdAt,
    email: row.email,
    frequency: row.frequency,
    fullName: row.fullName,
    id: row.id,
    phone: row.phone,
    preferredDate: row.preferredDate,
    preferredTime: row.preferredTime,
    propertyType: row.propertyType,
    quotedAmount: toNumber(row.quotedAmount),
    service: toService(row.service),
    serviceAddress: row.serviceAddress,
    serviceId: row.serviceId,
    serviceType: row.serviceType,
    status: row.status,
    updatedAt: row.updatedAt,
  };
}

function orderBy(
  sort: SortQuery | undefined,
): Prisma.QuoteRequestOrderByWithRelationInput {
  const direction = sort?.direction ?? "desc";

  switch (sort?.field) {
    case "status":
      return { status: direction };
    case "updatedAt":
      return { updatedAt: direction };
    default:
      return { createdAt: direction };
  }
}

function toQuotedAmount(
  value: number | null | undefined,
): Prisma.Decimal | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  return new Prisma.Decimal(value);
}

export class PrismaQuoteRepository implements QuoteRepository {
  public async findById(id: string): Promise<QuoteRequestRecord | null> {
    const row = await prisma.quoteRequest.findUnique({
      select: quoteRequestSelect,
      where: { id },
    });
    return row === null ? null : toRecord(row);
  }

  public async findByIdForEmail(
    id: string,
    email: string,
  ): Promise<QuoteRequestRecord | null> {
    const row = await prisma.quoteRequest.findFirst({
      select: quoteRequestSelect,
      where: { email, id },
    });
    return row === null ? null : toRecord(row);
  }

  public async create(
    input: CreateQuoteRequestInput,
  ): Promise<QuoteRequestRecord> {
    const row = await prisma.quoteRequest.create({
      data: {
        additionalNotes: input.additionalNotes ?? null,
        approximateSize: input.approximateSize,
        bathrooms:
          input.bathrooms === undefined || input.bathrooms === null
            ? null
            : new Prisma.Decimal(input.bathrooms),
        bedrooms: input.bedrooms ?? null,
        email: input.email.trim().toLowerCase(),
        frequency: input.frequency,
        fullName: input.fullName,
        phone: input.phone,
        preferredDate: input.preferredDate,
        preferredTime: input.preferredTime,
        propertyType: input.propertyType,
        serviceAddress: input.serviceAddress,
        serviceId: input.serviceId ?? null,
        serviceType: input.serviceType,
        status: "NEW",
      },
      select: quoteRequestSelect,
    });
    return toRecord(row);
  }

  public async listByEmail(
    query: QuoteListByEmailQuery,
  ): Promise<{ items: QuoteRequestRecord[]; total: number }> {
    const where: Prisma.QuoteRequestWhereInput = {
      email: query.email,
      ...(query.status === undefined ? {} : { status: query.status }),
    };
    const [rows, total] = await prisma.$transaction([
      prisma.quoteRequest.findMany({
        orderBy: { createdAt: "desc" },
        select: quoteRequestSelect,
        skip: query.pagination.skip,
        take: query.pagination.limit,
        where,
      }),
      prisma.quoteRequest.count({ where }),
    ]);

    return {
      items: rows.map(toRecord),
      total,
    };
  }

  public async list(
    query: AdminQuoteListQuery & { pagination: PaginationQuery },
  ): Promise<{ items: QuoteRequestRecord[]; total: number }> {
    const search = query.search?.trim();
    const where: Prisma.QuoteRequestWhereInput = {
      ...(query.status === undefined ? {} : { status: query.status }),
      ...(query.serviceType === undefined
        ? {}
        : { serviceType: query.serviceType }),
      ...(query.createdFrom === undefined && query.createdTo === undefined
        ? {}
        : {
            createdAt: {
              ...(query.createdFrom === undefined
                ? {}
                : { gte: query.createdFrom }),
              ...(query.createdTo === undefined
                ? {}
                : { lte: query.createdTo }),
            },
          }),
      ...(search === undefined || search === ""
        ? {}
        : {
            OR: [
              { id: { contains: search, mode: "insensitive" } },
              { fullName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }),
    };
    const [rows, total] = await prisma.$transaction([
      prisma.quoteRequest.findMany({
        orderBy: orderBy(query.sort),
        select: quoteRequestSelect,
        skip: query.pagination.skip,
        take: query.pagination.limit,
        where,
      }),
      prisma.quoteRequest.count({ where }),
    ]);

    return {
      items: rows.map(toRecord),
      total,
    };
  }

  public async update(
    id: string,
    input: UpdateAdminQuoteInput & Partial<QuoteStatusPatch>,
  ): Promise<QuoteRequestRecord | null> {
    try {
      const row = await prisma.quoteRequest.update({
        data: {
          adminNotes: input.adminNotes,
          quotedAmount: toQuotedAmount(input.quotedAmount),
          status: input.status,
        },
        select: quoteRequestSelect,
        where: { id },
      });
      return toRecord(row);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      }

      throw error;
    }
  }

  public async compareAndUpdate(
    id: string,
    expectedStatus: QuoteStatus,
    data: UpdateAdminQuoteInput & QuoteStatusPatch,
  ): Promise<QuoteRequestRecord | null> {
    const result = await prisma.quoteRequest.updateMany({
      data: {
        adminNotes: data.adminNotes,
        quotedAmount: toQuotedAmount(data.quotedAmount),
        status: data.status,
      },
      where: { id, status: expectedStatus },
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }
}
