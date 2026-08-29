import { loadServerEnv } from "@neatly/config/server";
import { z } from "@neatly/config/zod";
import { ADMIN_SESSION_TOKEN_HEADER } from "@/config/admin-api";
import { CUSTOMER_API_PATHS, withCustomerApiId } from "@/config/customer";
import {
  type JsonApiFailure,
  type JsonApiResult,
  parseJsonApiResponse,
} from "@/lib/api/envelope";
import { customerRequest } from "@/lib/customer/request";
import type { CustomerBookingView } from "@/types/customer";

const bookingPartySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const customerBookingViewSchema = z.object({
  id: z.string().min(1),
  linkedToQuote: z.boolean(),
  notes: z.string().nullable(),
  scheduledAt: z.string().nullable(),
  service: bookingPartySchema.nullable(),
  serviceAddress: z.string().nullable(),
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "ASSIGNED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ]),
});

const bookingPayloadSchema = z.object({
  booking: customerBookingViewSchema,
});

const bookingLoadFailure: JsonApiFailure = {
  code: "INTERNAL_ERROR",
  fields: {},
  forbidden: false,
  message: "Unable to complete this request. Please try again.",
  ok: false,
  status: 0,
  unauthorized: false,
};

export type CustomerBookingLoadResult =
  | { booking: CustomerBookingView; ok: true }
  | { notFound: true; ok: false; unauthorized: false }
  | { notFound: false; ok: false; unauthorized: boolean };

export async function createCustomerBooking(
  payload: Record<string, unknown>,
): Promise<JsonApiResult<CustomerBookingView>> {
  const result = await customerRequest<unknown>(CUSTOMER_API_PATHS.bookings, {
    body: JSON.stringify(payload),
    method: "POST",
  });

  if (!result.ok) {
    return result;
  }

  const parsed = bookingPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return bookingLoadFailure;
  }

  return {
    data: parsed.data.booking,
    ok: true,
    status: result.status,
  };
}

export async function loadCustomerBooking(
  id: string,
  sessionToken: string | undefined,
): Promise<CustomerBookingLoadResult> {
  const env = loadServerEnv();
  const origin = env.NEATLY_API_URL.endsWith("/")
    ? env.NEATLY_API_URL.slice(0, -1)
    : env.NEATLY_API_URL;
  const url = new URL(
    withCustomerApiId(CUSTOMER_API_PATHS.booking, id),
    `${origin}/`,
  );

  try {
    const headers = new Headers({ accept: "application/json" });

    if (sessionToken !== undefined && sessionToken.trim() !== "") {
      headers.set(ADMIN_SESSION_TOKEN_HEADER, sessionToken);
    }

    const response = await fetch(url, {
      cache: "no-store",
      headers,
      signal: AbortSignal.timeout(8_000),
    });

    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    const result = parseJsonApiResponse(response.status, body);

    if (!result.ok) {
      if (result.status === 404 || result.forbidden) {
        return { notFound: true, ok: false, unauthorized: false };
      }

      return {
        notFound: false,
        ok: false,
        unauthorized: result.unauthorized,
      };
    }

    const parsed = bookingPayloadSchema.safeParse(result.data);

    if (!parsed.success) {
      return { notFound: false, ok: false, unauthorized: false };
    }

    return { booking: parsed.data.booking, ok: true };
  } catch {
    return { notFound: false, ok: false, unauthorized: false };
  }
}
