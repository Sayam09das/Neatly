import type {
  QuoteFrequency,
  QuotePropertyType,
  QuoteServiceType,
  QuoteStatus,
} from "@prisma/client";
import type { QuotePreferredTime } from "../../config/quotes.ts";

export interface QuoteRequestRecord {
  additionalNotes: string | null;
  approximateSize: string;
  bathrooms: number | null;
  bedrooms: number | null;
  createdAt: Date;
  email: string;
  frequency: QuoteFrequency;
  fullName: string;
  id: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  propertyType: QuotePropertyType;
  serviceAddress: string;
  serviceId: string | null;
  serviceType: QuoteServiceType;
  status: QuoteStatus;
  updatedAt: Date;
}

export interface PublicQuoteConfirmation {
  frequency: QuoteFrequency;
  id: string;
  preferredDate: string;
  preferredTime: string;
  propertyType: QuotePropertyType;
  serviceId: string | null;
  serviceType: QuoteServiceType;
  status: QuoteStatus;
}

export interface CreateQuoteRequestInput {
  additionalNotes?: string | null;
  approximateSize: string;
  bathrooms?: number | null;
  bedrooms?: number | null;
  email: string;
  frequency: QuoteFrequency;
  fullName: string;
  phone: string;
  preferredDate: Date;
  preferredTime: QuotePreferredTime;
  propertyType: QuotePropertyType;
  serviceAddress: string;
  serviceId?: string | null;
  serviceType: QuoteServiceType;
}

export function toPublicQuoteConfirmation(
  record: QuoteRequestRecord,
): PublicQuoteConfirmation {
  return {
    frequency: record.frequency,
    id: record.id,
    preferredDate: record.preferredDate.toISOString(),
    preferredTime: record.preferredTime,
    propertyType: record.propertyType,
    serviceId: record.serviceId,
    serviceType: record.serviceType,
    status: record.status,
  };
}
