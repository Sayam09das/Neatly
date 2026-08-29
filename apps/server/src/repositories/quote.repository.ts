import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db.ts";
import type {
  CreateQuoteRequestInput,
  QuoteRequestRecord,
} from "../services/quotes/quote.types.ts";

export interface QuoteRepository {
  create(input: CreateQuoteRequestInput): Promise<QuoteRequestRecord>;
  findById(id: string): Promise<QuoteRequestRecord | null>;
}

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
      where: { id },
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
        email: input.email,
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
    });
    return toRecord(row);
  }
}
