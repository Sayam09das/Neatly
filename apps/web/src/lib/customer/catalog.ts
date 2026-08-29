import { loadServerEnv } from "@neatly/config/server";
import {
  CUSTOMER_API_PATHS,
  CUSTOMER_CATALOG_REQUEST_TIMEOUT_MS,
  CUSTOMER_PATHS,
  CUSTOMER_SERVICES_PAGE_PARAM,
  CUSTOMER_SERVICES_SEARCH_MAX_LENGTH,
  CUSTOMER_SERVICES_SEARCH_PARAM,
} from "@/config/customer";
import {
  type JsonApiFailure,
  type JsonApiResult,
  parseJsonApiResponse,
} from "@/lib/api/envelope";
import {
  publicCatalogItemSchema,
  publicCatalogListSchema,
} from "@/lib/validations/public-catalog.schema";
import type { CustomerService, CustomerServiceList } from "@/types/customer";

export interface CustomerServicesQuery {
  page: number;
  q: string;
}

export type PublicCatalogLoadResult =
  | { list: CustomerServiceList; ok: true }
  | { ok: false };

type SearchParamsInput = Record<string, string | string[] | undefined>;

const catalogLoadFailure: JsonApiFailure = {
  code: "INTERNAL_ERROR",
  fields: {},
  forbidden: false,
  message: "Unable to complete this request. Please try again.",
  ok: false,
  status: 0,
  unauthorized: false,
};

export function parseCustomerServicesSearchParams(
  searchParams: SearchParamsInput,
): CustomerServicesQuery {
  const q = readSearchParam(searchParams, CUSTOMER_SERVICES_SEARCH_PARAM)
    .trim()
    .slice(0, CUSTOMER_SERVICES_SEARCH_MAX_LENGTH);
  const pageValue = Number.parseInt(
    readSearchParam(searchParams, CUSTOMER_SERVICES_PAGE_PARAM),
    10,
  );

  return {
    page: Number.isInteger(pageValue) && pageValue >= 1 ? pageValue : 1,
    q,
  };
}

export function customerServicesHref(query: CustomerServicesQuery): string {
  const params = new URLSearchParams();

  if (query.q !== "") {
    params.set(CUSTOMER_SERVICES_SEARCH_PARAM, query.q);
  }

  if (query.page > 1) {
    params.set(CUSTOMER_SERVICES_PAGE_PARAM, String(query.page));
  }

  const encoded = params.toString();
  return encoded === ""
    ? CUSTOMER_PATHS.services
    : `${CUSTOMER_PATHS.services}?${encoded}`;
}

export function isLocalCustomerServiceImage(src: string | null): src is string {
  return src?.startsWith("/") === true && !src.startsWith("//");
}

export function mapPublicCatalogList(
  value: unknown,
): CustomerServiceList | null {
  const parsed = publicCatalogListSchema.safeParse(value);

  if (!parsed.success) {
    return null;
  }

  const services: CustomerService[] = [];

  for (const item of parsed.data.items) {
    const service = mapPublicCatalogItem(item);

    if (service !== null) {
      services.push(service);
    }
  }

  if (services.length === 0 && parsed.data.items.length > 0) {
    return null;
  }

  return {
    pagination: {
      page: parsed.data.pagination.page,
      pageSize: parsed.data.pagination.limit,
      total: parsed.data.pagination.total,
      totalPages: parsed.data.pagination.totalPages,
    },
    services,
  };
}

export async function loadPublicCatalog(
  query: CustomerServicesQuery,
): Promise<PublicCatalogLoadResult> {
  const result = await requestPublicCatalog(query);

  if (!result.ok) {
    return { ok: false };
  }

  const list = mapPublicCatalogList(result.data);

  if (list === null) {
    return { ok: false };
  }

  return { list, ok: true };
}

async function requestPublicCatalog(
  query: CustomerServicesQuery,
): Promise<JsonApiResult<unknown>> {
  const env = loadServerEnv();
  const origin = env.NEATLY_API_URL.endsWith("/")
    ? env.NEATLY_API_URL.slice(0, -1)
    : env.NEATLY_API_URL;
  const url = new URL(CUSTOMER_API_PATHS.services, `${origin}/`);

  if (query.q !== "") {
    url.searchParams.set("search", query.q);
  }

  if (query.page > 1) {
    url.searchParams.set("page", String(query.page));
  }

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
      signal: AbortSignal.timeout(CUSTOMER_CATALOG_REQUEST_TIMEOUT_MS),
    });

    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return parseJsonApiResponse(response.status, body);
  } catch {
    return catalogLoadFailure;
  }
}

function mapPublicCatalogItem(value: unknown): CustomerService | null {
  const parsed = publicCatalogItemSchema.safeParse(value);

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

function readSearchParam(searchParams: SearchParamsInput, key: string): string {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}
