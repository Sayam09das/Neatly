import { Prisma, type QuoteStatus } from "@prisma/client";
import { prisma } from "../lib/db.ts";
import type { PaginationQuery } from "../lib/query.ts";
import type {
  CreateQuoteRequestInput,
  QuoteRequestRecord,
} from "../services/quotes/quote.types.ts";

export interface QuoteListByEmailQuery {
  email: string;
  pagination: PaginationQuery;
  status?: QuoteStatus;
}

export interface QuoteRepository {
  create(input: CreateQuoteRequestInput): Promise<QuoteRequestRecord>;
  findById(id: string): Promise<QuoteRequestRecord | null>;
  findByIdForEmail(
    id: string,
    email: string,
  ): Promise<QuoteRequestRecord | null>;
  listByEmail(
    query: QuoteListByEmailQuery,
  ): Promise<{ items: QuoteRequestRecord[]; total: number }>;
}

const quoteRequestSelect = {
  additionalNotes: true,
  approximateSize: true,
  bathrooms: true,
  bedrooms: true,
  createdAt: true,
  email: true,
  frequency: true,
  fullName: true,
  id: true,
  phone: true,
  preferredDate: true,
  preferredTime: true,
  propertyType: true,
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

function toRecord(row: {
  additionalNotes: string | null;
  approximateSize: string;
  bathrooms: Prisma.Decimal | null;
  bedrooms: number | null;
  createdAt: Date;
  email: string;
  frequency: QuoteRequestRecord["frequency"];
  fullName: string;
  id: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  propertyType: QuoteRequestRecord["propertyType"];
  serviceAddress: string;
  serviceId: string | null;
  serviceType: QuoteRequestRecord["serviceType"];
  status: QuoteRequestRecord["status"];
  updatedAt: Date;
}): QuoteRequestRecord {
  return {
    additionalNotes: row.additionalNotes,
    approximateSize: row.approximateSize,
    bathrooms: toNumber(row.bathrooms),
    bedrooms: row.bedrooms,
    createdAt: row.createdAt,
    email: row.email,
    frequency: row.frequency,
    fullName: row.fullName,
    id: row.id,
    phone: row.phone,
    preferredDate: row.preferredDate,
    preferredTime: row.preferredTime,
    propertyType: row.propertyType,
    serviceAddress: row.serviceAddress,
    serviceId: row.serviceId,
    serviceType: row.serviceType,
    status: row.status,
    updatedAt: row.updatedAt,
  };
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
}
