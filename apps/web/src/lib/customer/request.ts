import {
  CUSTOMER_API_PREFIX,
  FORBIDDEN_CUSTOMER_AUTH_QUERY_KEYS,
} from "@/config/customer";
import type { JsonApiResult } from "@/lib/api/envelope";
import { sameOriginJsonRequest } from "@/lib/api/envelope";

export type CustomerApiResult<T> = JsonApiResult<T>;

export class CustomerRequestError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "CustomerRequestError";
  }
}

export function assertCustomerRequestPath(path: string): void {
  const url = new URL(path, "https://neatly.invalid");

  if (!url.pathname.startsWith(CUSTOMER_API_PREFIX)) {
    throw new CustomerRequestError(
      "Customer requests must use the customer API prefix.",
    );
  }

  if (url.pathname.includes("/admin")) {
    throw new CustomerRequestError(
      "Customer requests must not use admin APIs.",
    );
  }

  for (const key of FORBIDDEN_CUSTOMER_AUTH_QUERY_KEYS) {
    if (url.searchParams.has(key)) {
      throw new CustomerRequestError(
        "Customer identity must come from the session, not the request URL.",
      );
    }
  }
}

export async function customerRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<CustomerApiResult<T>> {
  assertCustomerRequestPath(path);
  return sameOriginJsonRequest<T>(path, init);
}
