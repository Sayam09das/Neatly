import { loadServerEnv } from "@neatly/config/server";
import { z } from "@neatly/config/zod";
import { ADMIN_SESSION_TOKEN_HEADER } from "@/config/admin-api";
import {
  CUSTOMER_API_PATHS,
  CUSTOMER_QUOTE_REQUEST_TIMEOUT_MS,
} from "@/config/customer";
import {
  type JsonApiFailure,
  type JsonApiResult,
  parseJsonApiResponse,
} from "@/lib/api/envelope";
import type { CustomerQuoteList, CustomerQuoteView } from "@/types/customer";

export const customerQuoteViewSchema = z.object({
  additionalNotes: z.string().nullable(),
  approximateSize: z.string().min(1),
  bathrooms: z.number().int().nonnegative().nullable(),
  bedrooms: z.number().int().nonnegative().nullable(),
  createdAt: z.string().min(1),
  email: z.string().min(1),
  frequency: z.enum(["ONE_TIME", "WEEKLY", "BI_WEEKLY", "MONTHLY"]),
  fullName: z.string().min(1),
  id: z.string().min(1),
  phone: z.string().min(1),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  propertyType: z.enum([
    "HOUSE",
    "APARTMENT",
    "CONDO",
    "OFFICE",
    "COMMERCIAL_SPACE",
  ]),
  serviceAddress: z.string().min(1),
  serviceId: z.string().min(1).nullable(),
  serviceType: z.enum([
    "RESIDENTIAL",
    "DEEP_CLEAN",
    "MOVE_IN_OUT",
    "COMMERCIAL",
    "CUSTOM",
  ]),
  status: z.enum([
    "NEW",
    "REVIEWING",
    "CONTACTED",
    "QUOTED",
    "CONVERTED",
    "DECLINED",
    "CLOSED",
  ]),
});

const quoteListPayloadSchema = z.object({
  items: z.array(customerQuoteViewSchema),
  pagination: z.object({
    limit: z.number().int().positive(),
    page: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

const loadFailure: JsonApiFailure = {
  code: "INTERNAL_ERROR",
  fields: {},
  forbidden: false,
  message: "Unable to complete this request. Please try again.",
  ok: false,
  status: 0,
  unauthorized: false,
};

export type CustomerQuotesLoadResult =
  | { list: CustomerQuoteList; ok: true }
  | { ok: false; unauthorized: boolean };

export function formatCustomerQuoteDate(iso: string): string | null {
  if (iso === "") {
    return null;
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

export async function loadCustomerQuotes(
  sessionToken: string | undefined,
): Promise<CustomerQuotesLoadResult> {
  const result = await requestCustomerJson(
    CUSTOMER_API_PATHS.quotes,
    sessionToken,
  );

  if (!result.ok) {
    return { ok: false, unauthorized: result.unauthorized };
  }

  const parsed = quoteListPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return { ok: false, unauthorized: false };
  }

  return { list: parsed.data, ok: true };
}

async function requestCustomerJson(
  path: string,
  sessionToken: string | undefined,
): Promise<JsonApiResult<unknown>> {
  const env = loadServerEnv();
  const origin = env.NEATLY_API_URL.endsWith("/")
    ? env.NEATLY_API_URL.slice(0, -1)
    : env.NEATLY_API_URL;

  try {
    const headers = new Headers({ accept: "application/json" });

    if (sessionToken !== undefined && sessionToken.trim() !== "") {
      headers.set(ADMIN_SESSION_TOKEN_HEADER, sessionToken);
    }

    const response = await fetch(new URL(path, `${origin}/`), {
      cache: "no-store",
      headers,
      signal: AbortSignal.timeout(CUSTOMER_QUOTE_REQUEST_TIMEOUT_MS),
    });

    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return parseJsonApiResponse(response.status, body);
  } catch {
    return loadFailure;
  }
}

export type { CustomerQuoteView };
