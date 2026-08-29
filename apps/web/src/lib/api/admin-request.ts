import type { JsonApiResult } from "@/lib/api/envelope";
import { sameOriginJsonRequest } from "@/lib/api/envelope";
import type { AuthErrorCode } from "@/types/auth";

export type AdminApiSuccess<T> = Extract<JsonApiResult<T>, { ok: true }>;

export type AdminApiErrorCode =
  | AuthErrorCode
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "NOT_FOUND";

export type AdminApiFailure = Extract<JsonApiResult<unknown>, { ok: false }>;

export type AdminApiResult<T> = JsonApiResult<T>;

export { parseJsonApiResponse as parseAdminApiResponse } from "@/lib/api/envelope";

export async function adminRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<AdminApiResult<T>> {
  return sameOriginJsonRequest<T>(path, init);
}

export async function requestAdminLogout(): Promise<
  AdminApiResult<{ signedOut: true }>
> {
  return adminRequest<{ signedOut: true }>("/api/admin/auth/logout", {
    method: "POST",
  });
}
