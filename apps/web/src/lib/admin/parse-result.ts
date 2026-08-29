import type { AdminApiFailure, AdminApiResult } from "@/lib/api/admin-request";

export function mappingFailed<T>(): AdminApiResult<T> {
  const failure: AdminApiFailure = {
    code: "INTERNAL_ERROR",
    fields: {},
    forbidden: false,
    message: "Unable to complete this request. Please try again.",
    ok: false,
    status: 500,
    unauthorized: false,
  };

  return failure;
}

export function mapAdminResult<T, U>(
  result: AdminApiResult<T>,
  map: (data: T) => U | null,
): AdminApiResult<U> {
  if (!result.ok) {
    return result;
  }

  const mapped = map(result.data);

  if (mapped === null) {
    return mappingFailed();
  }

  return {
    data: mapped,
    ok: true,
    status: result.status,
  };
}
