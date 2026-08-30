import type {
  QuoteFrequency,
  QuotePropertyType,
  QuoteServiceType,
  QuoteStatus,
} from "@prisma/client";
import type { QuotePreferredTime } from "../../config/quotes.ts";
import type { PaginationQuery, SortQuery } from "../../lib/query.ts";

export const QUOTE_SORT_FIELDS = ["createdAt", "status", "updatedAt"] as const;

export interface QuoteServiceSummary {
  id: string;
  name: string;
  slug: string;
}

export interface QuoteRequestRecord {
  additionalNotes: string | null;
  adminNotes: string | null;
  approximateSize: string;
  bathrooms: number | null;
  bedrooms: number | null;
  bookingId: string | null;
  createdAt: Date;
  email: string;
  frequency: QuoteFrequency;
  fullName: string;
  id: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  propertyType: QuotePropertyType;
  quotedAmount: number | null;
  service: QuoteServiceSummary | null;
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

export interface CustomerQuoteView {
  additionalNotes: string | null;
  approximateSize: string;
  bathrooms: number | null;
  bedrooms: number | null;
  bookingId: string | null;
  createdAt: string;
  email: string;
  frequency: QuoteFrequency;
  fullName: string;
  id: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  propertyType: QuotePropertyType;
  quotedAmount: number | null;
  service: QuoteServiceSummary | null;
  serviceAddress: string;
  serviceId: string | null;
  serviceType: QuoteServiceType;
  status: QuoteStatus;
}

export interface AdminQuoteView extends CustomerQuoteView {
  adminNotes: string | null;
}

export interface CustomerQuoteListQuery {
  pagination?: PaginationQuery;
  status?: QuoteStatus;
}

export interface AdminQuoteListQuery {
  createdFrom?: Date;
  createdTo?: Date;
  pagination?: PaginationQuery;
  search?: string;
  serviceType?: QuoteServiceType;
  sort?: SortQuery;
  status?: QuoteStatus;
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

export interface UpdateAdminQuoteInput {
  adminNotes?: string | null;
  quotedAmount?: number | null;
  status?: QuoteStatus;
}

export function toCustomerQuoteView(
  record: QuoteRequestRecord,
): CustomerQuoteView {
  return {
    additionalNotes: record.additionalNotes,
    approximateSize: record.approximateSize,
    bathrooms: record.bathrooms,
    bedrooms: record.bedrooms,
    bookingId: record.bookingId,
    createdAt: record.createdAt.toISOString(),
    email: record.email,
    frequency: record.frequency,
    fullName: record.fullName,
    id: record.id,
    phone: record.phone,
    preferredDate: record.preferredDate.toISOString(),
    preferredTime: record.preferredTime,
    propertyType: record.propertyType,
    quotedAmount: record.quotedAmount,
    service: record.service,
    serviceAddress: record.serviceAddress,
    serviceId: record.serviceId,
    serviceType: record.serviceType,
    status: record.status,
  };
}

export function toAdminQuoteView(record: QuoteRequestRecord): AdminQuoteView {
  return {
    ...toCustomerQuoteView(record),
    adminNotes: record.adminNotes,
  };
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
