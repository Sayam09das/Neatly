import {
  ADMIN_API_PATHS,
  ADMIN_LIST_PAGE_SIZE,
  withAdminApiId,
} from "@/config/admin-api";
import { emptyToNull } from "@/lib/admin/mutation-input";
import { mapAdminResult } from "@/lib/admin/parse-result";
import {
  isRecord,
  mapAdminPagination,
  readIsoDate,
  readNullableString,
  readString,
  withAdminQuery,
} from "@/lib/admin/query";
import { type AdminApiResult, adminRequest } from "@/lib/api/admin-request";
import type {
  AdminCleaner,
  AdminCleanerAccountState,
  AdminCleanerPagination,
} from "@/types/admin-cleaner";

export interface AdminCleanerList {
  cleaners: readonly AdminCleaner[];
  pagination: AdminCleanerPagination;
}

export interface AdminCleanerListQuery {
  page: number;
  query: string;
  status: string;
}

export interface AdminCleanerWriteInput {
  email: string;
  name: string;
  phone: string;
}

export interface AdminCleanerCreateResult {
  cleaner: AdminCleaner;
  invitationSent: boolean;
}

export async function listAdminCleaners(
  query: AdminCleanerListQuery,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminCleanerList>> {
  const filters =
    query.status === "INVITED"
      ? { accountState: "INVITED" }
      : query.status === "INACTIVE"
        ? { accountState: "INACTIVE" }
        : { status: query.status };

  const result = await adminRequest<unknown>(
    withAdminQuery(ADMIN_API_PATHS.cleaners, {
      filters,
      limit: ADMIN_LIST_PAGE_SIZE,
      page: query.page,
      search: query.query,
    }),
    init,
  );
  return mapAdminResult(result, mapCleanerList);
}

export async function getAdminCleaner(
  id: string,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminCleaner>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.cleaner, id),
    init,
  );
  return mapAdminResult(result, (value) => {
    if (!isRecord(value)) {
      return null;
    }

    return mapCleaner(value.cleaner ?? value);
  });
}

export async function createAdminCleaner(
  input: AdminCleanerWriteInput,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminCleanerCreateResult>> {
  const result = await adminRequest<unknown>(ADMIN_API_PATHS.cleaners, {
    ...init,
    body: JSON.stringify({
      email: input.email.trim(),
      name: input.name.trim(),
      phone: input.phone.trim(),
    }),
    method: "POST",
  });
  return mapAdminResult(result, mapCreatePayload);
}

export async function updateAdminCleaner(
  id: string,
  input: AdminCleanerWriteInput,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminCleaner>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.cleaner, id),
    {
      ...init,
      body: JSON.stringify({
        email: emptyToNull(input.email),
        name: input.name.trim(),
        phone: emptyToNull(input.phone),
      }),
      method: "PATCH",
    },
  );
  return mapAdminResult(result, mapCleanerPayload);
}

export async function updateAdminCleanerStatus(
  id: string,
  status: "ACTIVE" | "INACTIVE",
  init: RequestInit = {},
): Promise<AdminApiResult<AdminCleaner>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.cleanerStatus, id),
    {
      ...init,
      body: JSON.stringify({ status }),
      method: "PATCH",
    },
  );
  return mapAdminResult(result, mapCleanerPayload);
}

export async function resendAdminCleanerInvitation(
  id: string,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminCleanerCreateResult>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.cleanerResendInvitation, id),
    {
      ...init,
      method: "POST",
    },
  );
  return mapAdminResult(result, mapCreatePayload);
}

export function shouldRenderCleanerPagination(
  pagination: AdminCleanerPagination | undefined,
  visibleCount: number,
): boolean {
  if (pagination === undefined) {
    return false;
  }

  return pagination.totalPages > 1 || visibleCount < pagination.total;
}

export function getCleanerNameLabel(name: string | null): string {
  if (name === null || name.trim() === "") {
    return "—";
  }

  return name;
}

export function formatCleanerCreatedDate(value: string | null): string {
  if (value === null) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function mapCleanerList(value: unknown): AdminCleanerList | null {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return null;
  }

  const pagination = mapAdminPagination(value.pagination, ADMIN_LIST_PAGE_SIZE);

  if (pagination === null) {
    return null;
  }

  const cleaners: AdminCleaner[] = [];

  for (const item of value.items) {
    const cleaner = mapCleaner(item);

    if (cleaner === null) {
      return null;
    }

    cleaners.push(cleaner);
  }

  return { cleaners, pagination };
}

function mapCleaner(value: unknown): AdminCleaner | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);

  if (id === null) {
    return null;
  }

  const status = readNullableString(value.status);
  const accountState = readAccountState(value.accountState, status);

  return {
    accountState,
    accountStateLabel: accountStateLabel(accountState),
    createdAt: readIsoDate(value.createdAt),
    email: readNullableString(value.email),
    id,
    name: readNullableString(value.name),
    phone: readNullableString(value.phone),
    statusLabel:
      status === "ACTIVE"
        ? "Active"
        : status === "INACTIVE"
          ? "Inactive"
          : status,
  };
}

function mapCleanerPayload(value: unknown): AdminCleaner | null {
  if (!isRecord(value)) {
    return null;
  }

  return mapCleaner(value.cleaner ?? value);
}

function mapCreatePayload(value: unknown): AdminCleanerCreateResult | null {
  if (!isRecord(value)) {
    return null;
  }

  const cleaner = mapCleaner(value.cleaner ?? value);

  if (cleaner === null) {
    return null;
  }

  return {
    cleaner,
    invitationSent: value.invitationSent === true,
  };
}

function readAccountState(
  value: unknown,
  status: string | null,
): AdminCleanerAccountState | null {
  if (value === "ACTIVE" || value === "INACTIVE" || value === "INVITED") {
    return value;
  }

  if (status === "ACTIVE") {
    return "ACTIVE";
  }

  if (status === "INACTIVE") {
    return "INACTIVE";
  }

  return null;
}

function accountStateLabel(
  state: AdminCleanerAccountState | null,
): string | null {
  if (state === "ACTIVE") {
    return "Active";
  }

  if (state === "INVITED") {
    return "Invitation pending";
  }

  if (state === "INACTIVE") {
    return "Inactive";
  }

  return null;
}
