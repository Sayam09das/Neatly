import { loadServerEnv } from "@neatly/config/server";
import { z } from "@neatly/config/zod";
import { ADMIN_SESSION_TOKEN_HEADER } from "@/config/admin-api";
import {
  CUSTOMER_API_PATHS,
  CUSTOMER_NOTIFICATIONS_PAGE_PARAM,
  CUSTOMER_NOTIFICATIONS_REQUEST_TIMEOUT_MS,
  CUSTOMER_PATHS,
  withCustomerApiId,
} from "@/config/customer";
import {
  type JsonApiFailure,
  type JsonApiResult,
  parseJsonApiResponse,
} from "@/lib/api/envelope";
import { customerRequest } from "@/lib/customer/request";
import type {
  CustomerNotification,
  CustomerNotificationList,
} from "@/types/customer";

const notificationSchema = z.object({
  createdAt: z.string().min(1),
  id: z.string().min(1),
  isRead: z.boolean(),
  message: z.string().min(1),
  readAt: z.string().min(1).nullable(),
  relatedHref: z.string().min(1).nullable(),
  relatedLabel: z.string().min(1).nullable(),
  title: z.string().min(1),
});

const paginationSchema = z.object({
  limit: z.number().int().positive(),
  page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

const listPayloadSchema = z.object({
  items: z.array(notificationSchema),
  pagination: paginationSchema,
});

const notificationPayloadSchema = z.object({
  notification: notificationSchema,
});

const unreadCountPayloadSchema = z.object({
  count: z.number().int().nonnegative(),
});

const markAllPayloadSchema = z.object({
  updated: z.number().int().nonnegative(),
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

export interface CustomerNotificationsQuery {
  page: number;
}

export type CustomerNotificationsLoadResult =
  | { list: CustomerNotificationList; ok: true }
  | { ok: false; unauthorized: boolean };

type SearchParamsInput = Record<string, string | string[] | undefined>;

export function parseCustomerNotificationsSearchParams(
  searchParams: SearchParamsInput,
): CustomerNotificationsQuery {
  const pageValue = Number.parseInt(
    readSearchParam(searchParams, CUSTOMER_NOTIFICATIONS_PAGE_PARAM),
    10,
  );

  return {
    page: Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1,
  };
}

export function customerNotificationsHref(
  query: CustomerNotificationsQuery,
): string {
  if (query.page <= 1) {
    return CUSTOMER_PATHS.notifications;
  }

  const params = new URLSearchParams();
  params.set(CUSTOMER_NOTIFICATIONS_PAGE_PARAM, String(query.page));
  return `${CUSTOMER_PATHS.notifications}?${params.toString()}`;
}

export function isCustomerSafeNotificationHref(href: string | null): boolean {
  if (href === null || href === "") {
    return false;
  }

  return (
    href.startsWith("/dashboard") &&
    !href.includes("://") &&
    !href.includes("\\") &&
    !href.includes("..") &&
    !href.includes("//", 1)
  );
}

export async function loadCustomerNotifications(
  query: CustomerNotificationsQuery,
  sessionToken: string | undefined,
): Promise<CustomerNotificationsLoadResult> {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  const result = await requestCustomerJson(
    `${CUSTOMER_API_PATHS.notifications}?${params.toString()}`,
    sessionToken,
  );

  if (!result.ok) {
    return { ok: false, unauthorized: result.unauthorized };
  }

  const parsed = listPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return { ok: false, unauthorized: false };
  }

  return { list: parsed.data, ok: true };
}

export async function markCustomerNotificationRead(
  id: string,
): Promise<JsonApiResult<CustomerNotification>> {
  const result = await customerRequest<unknown>(
    withCustomerApiId(CUSTOMER_API_PATHS.notificationRead, id),
    { method: "PATCH" },
  );

  if (!result.ok) {
    return result;
  }

  const parsed = notificationPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return loadFailure;
  }

  return {
    data: parsed.data.notification,
    ok: true,
    status: result.status,
  };
}

export async function markAllCustomerNotificationsRead(): Promise<
  JsonApiResult<{ updated: number }>
> {
  const result = await customerRequest<unknown>(
    CUSTOMER_API_PATHS.notificationsReadAll,
    { method: "POST" },
  );

  if (!result.ok) {
    return result;
  }

  const parsed = markAllPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return loadFailure;
  }

  return {
    data: parsed.data,
    ok: true,
    status: result.status,
  };
}

export async function countUnreadCustomerNotifications(): Promise<
  JsonApiResult<{ count: number }>
> {
  const result = await customerRequest<unknown>(
    CUSTOMER_API_PATHS.notificationsUnreadCount,
  );

  if (!result.ok) {
    return result;
  }

  const parsed = unreadCountPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return loadFailure;
  }

  return {
    data: parsed.data,
    ok: true,
    status: result.status,
  };
}

function readSearchParam(searchParams: SearchParamsInput, key: string): string {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
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
      signal: AbortSignal.timeout(CUSTOMER_NOTIFICATIONS_REQUEST_TIMEOUT_MS),
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
