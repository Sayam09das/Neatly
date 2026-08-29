import { loadServerEnv } from "@neatly/config/server";
import { z } from "@neatly/config/zod";
import { ADMIN_SESSION_TOKEN_HEADER } from "@/config/admin-api";
import {
  CUSTOMER_API_PATHS,
  CUSTOMER_BOOKING_REQUEST_TIMEOUT_MS,
  CUSTOMER_BOOKINGS_PAGE_PARAM,
  CUSTOMER_BOOKINGS_SEARCH_PARAM,
  CUSTOMER_BOOKINGS_STATUS_PARAM,
  CUSTOMER_BOOKINGS_WINDOW_PARAM,
  CUSTOMER_PATHS,
  CUSTOMER_SERVICES_SEARCH_MAX_LENGTH,
  withCustomerApiId,
} from "@/config/customer";
import {
  type JsonApiFailure,
  type JsonApiResult,
  parseJsonApiResponse,
} from "@/lib/api/envelope";
import { customerRequest } from "@/lib/customer/request";
import type {
  CustomerBookingList,
  CustomerBookingStatus,
  CustomerBookingView,
  CustomerBookingWindow,
  CustomerOverview,
} from "@/types/customer";

const bookingPartySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const customerBookingViewSchema = z.object({
  actions: z.object({
    canCancel: z.boolean(),
    canUpdate: z.boolean(),
  }),
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

const bookingPaginationSchema = z.object({
  limit: z.number().int().positive(),
  page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

const bookingListPayloadSchema = z.object({
  items: z.array(customerBookingViewSchema),
  pagination: bookingPaginationSchema,
});

const overviewPayloadSchema = z.object({
  overview: z.object({
    recentBookings: z.array(customerBookingViewSchema),
    summary: z.object({
      completed: z.number().int().nonnegative(),
      pending: z.number().int().nonnegative(),
      total: z.number().int().nonnegative(),
      upcoming: z.number().int().nonnegative(),
    }),
    upcomingBooking: customerBookingViewSchema.nullable(),
  }),
});

export const CUSTOMER_BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export const CUSTOMER_BOOKING_WINDOWS = ["upcoming", "past"] as const;

export interface CustomerBookingsQuery {
  page: number;
  q: string;
  status: CustomerBookingStatus | "";
  window: CustomerBookingWindow | "";
}

export type CustomerOverviewLoadResult =
  | { ok: true; overview: CustomerOverview }
  | { ok: false; unauthorized: boolean };

export type CustomerBookingListLoadResult =
  | { list: CustomerBookingList; ok: true }
  | { ok: false; unauthorized: boolean };

type SearchParamsInput = Record<string, string | string[] | undefined>;

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

export async function updateCustomerBooking(
  id: string,
  payload: Record<string, unknown>,
): Promise<JsonApiResult<CustomerBookingView>> {
  const result = await customerRequest<unknown>(
    withCustomerApiId(CUSTOMER_API_PATHS.booking, id),
    {
      body: JSON.stringify(payload),
      method: "PATCH",
    },
  );

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

export async function cancelCustomerBooking(
  id: string,
): Promise<JsonApiResult<CustomerBookingView>> {
  const result = await customerRequest<unknown>(
    withCustomerApiId(CUSTOMER_API_PATHS.bookingCancel, id),
    { method: "POST" },
  );

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

export function parseCustomerBookingsSearchParams(
  searchParams: SearchParamsInput,
): CustomerBookingsQuery {
  const q = readSearchParam(searchParams, CUSTOMER_BOOKINGS_SEARCH_PARAM)
    .trim()
    .slice(0, CUSTOMER_SERVICES_SEARCH_MAX_LENGTH);
  const pageValue = Number.parseInt(
    readSearchParam(searchParams, CUSTOMER_BOOKINGS_PAGE_PARAM),
    10,
  );
  const statusValue = readSearchParam(
    searchParams,
    CUSTOMER_BOOKINGS_STATUS_PARAM,
  );
  const windowValue = readSearchParam(
    searchParams,
    CUSTOMER_BOOKINGS_WINDOW_PARAM,
  );

  return {
    page: Number.isInteger(pageValue) && pageValue >= 1 ? pageValue : 1,
    q,
    status: isBookingStatus(statusValue) ? statusValue : "",
    window: isBookingWindow(windowValue) ? windowValue : "",
  };
}

export function customerBookingsHref(query: CustomerBookingsQuery): string {
  const params = new URLSearchParams();

  if (query.q !== "") {
    params.set(CUSTOMER_BOOKINGS_SEARCH_PARAM, query.q);
  }

  if (query.status !== "") {
    params.set(CUSTOMER_BOOKINGS_STATUS_PARAM, query.status);
  }

  if (query.window !== "") {
    params.set(CUSTOMER_BOOKINGS_WINDOW_PARAM, query.window);
  }

  if (query.page > 1) {
    params.set(CUSTOMER_BOOKINGS_PAGE_PARAM, String(query.page));
  }

  const encoded = params.toString();
  return encoded === ""
    ? CUSTOMER_PATHS.bookings
    : `${CUSTOMER_PATHS.bookings}?${encoded}`;
}

export function customerBookingsHasFilters(
  query: CustomerBookingsQuery,
): boolean {
  return query.q !== "" || query.status !== "" || query.window !== "";
}

export async function loadCustomerOverview(
  sessionToken: string | undefined,
): Promise<CustomerOverviewLoadResult> {
  const result = await requestCustomerJson(
    CUSTOMER_API_PATHS.dashboard,
    sessionToken,
  );

  if (!result.ok) {
    return { ok: false, unauthorized: result.unauthorized };
  }

  const parsed = overviewPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return { ok: false, unauthorized: false };
  }

  return { ok: true, overview: parsed.data.overview };
}

export async function loadCustomerBookings(
  query: CustomerBookingsQuery,
  sessionToken: string | undefined,
): Promise<CustomerBookingListLoadResult> {
  const env = loadServerEnv();
  const origin = env.NEATLY_API_URL.endsWith("/")
    ? env.NEATLY_API_URL.slice(0, -1)
    : env.NEATLY_API_URL;
  const url = new URL(CUSTOMER_API_PATHS.bookings, `${origin}/`);

  if (query.q !== "") {
    url.searchParams.set("search", query.q);
  }

  if (query.status !== "") {
    url.searchParams.set("status", query.status);
  }

  if (query.window !== "") {
    url.searchParams.set("window", query.window);
  }

  if (query.page > 1) {
    url.searchParams.set("page", String(query.page));
  }

  const result = await requestCustomerJson(url, sessionToken);

  if (!result.ok) {
    return { ok: false, unauthorized: result.unauthorized };
  }

  const parsed = bookingListPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return { ok: false, unauthorized: false };
  }

  return {
    list: {
      items: parsed.data.items,
      pagination: {
        page: parsed.data.pagination.page,
        pageSize: parsed.data.pagination.limit,
        total: parsed.data.pagination.total,
        totalPages: parsed.data.pagination.totalPages,
      },
    },
    ok: true,
  };
}

async function requestCustomerJson(
  path: string | URL,
  sessionToken: string | undefined,
): Promise<JsonApiResult<unknown>> {
  const env = loadServerEnv();
  const origin = env.NEATLY_API_URL.endsWith("/")
    ? env.NEATLY_API_URL.slice(0, -1)
    : env.NEATLY_API_URL;
  const url = path instanceof URL ? path : new URL(path, `${origin}/`);

  try {
    const headers = new Headers({ accept: "application/json" });

    if (sessionToken !== undefined && sessionToken.trim() !== "") {
      headers.set(ADMIN_SESSION_TOKEN_HEADER, sessionToken);
    }

    const response = await fetch(url, {
      cache: "no-store",
      headers,
      signal: AbortSignal.timeout(CUSTOMER_BOOKING_REQUEST_TIMEOUT_MS),
    });

    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return parseJsonApiResponse(response.status, body);
  } catch {
    return bookingLoadFailure;
  }
}

function isBookingStatus(value: string): value is CustomerBookingStatus {
  return (CUSTOMER_BOOKING_STATUSES as readonly string[]).includes(value);
}

function isBookingWindow(value: string): value is CustomerBookingWindow {
  return (CUSTOMER_BOOKING_WINDOWS as readonly string[]).includes(value);
}

function readSearchParam(searchParams: SearchParamsInput, key: string): string {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}
