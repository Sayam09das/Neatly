import { ADMIN_API_PATHS } from "@/config/admin-api";
import { mapAdminResult } from "@/lib/admin/parse-result";
import { isRecord, readString } from "@/lib/admin/query";
import { type AdminApiResult, adminRequest } from "@/lib/api/admin-request";
import type { AdminSiteSettings } from "@/types/admin-settings";
import type { AuthUser } from "@/types/auth";

export interface AdminSettingsPayload {
  profile: Pick<AuthUser, "email" | "name" | "role" | "status"> | null;
  settings: AdminSiteSettings | null;
}

export async function getAdminSettings(
  init: RequestInit = {},
): Promise<AdminApiResult<AdminSiteSettings | null>> {
  const result = await adminRequest<unknown>(ADMIN_API_PATHS.settings, init);

  if (!result.ok && result.code === "NOT_FOUND") {
    return {
      data: null,
      ok: true,
      status: 200,
    };
  }

  return mapAdminResult(result, (value) => {
    if (!isRecord(value)) {
      return null;
    }

    return mapSettings(value.settings ?? value);
  });
}

export async function getAdminProfile(
  init: RequestInit = {},
): Promise<
  AdminApiResult<Pick<AuthUser, "email" | "name" | "role" | "status">>
> {
  const result = await adminRequest<unknown>(ADMIN_API_PATHS.me, init);
  return mapAdminResult(result, (value) => {
    if (!isRecord(value)) {
      return null;
    }

    return mapProfile(value.user ?? value);
  });
}

export async function getAdminSettingsPayload(
  init: RequestInit = {},
): Promise<AdminApiResult<AdminSettingsPayload>> {
  const [profile, settings] = await Promise.all([
    getAdminProfile(init),
    getAdminSettings(init),
  ]);

  if (!profile.ok) {
    return profile;
  }

  if (!settings.ok) {
    return settings;
  }

  return {
    data: {
      profile: profile.data,
      settings: settings.data,
    },
    ok: true,
    status: 200,
  };
}

export interface AdminSettingsUpdateInput {
  address?: string;
  businessName?: string;
  email?: string;
  notificationEmail?: string;
  phone?: string;
}

export async function updateAdminSettings(
  input: AdminSettingsUpdateInput,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminSiteSettings>> {
  const result = await adminRequest<unknown>(ADMIN_API_PATHS.settings, {
    ...init,
    body: JSON.stringify(input),
    method: "PATCH",
  });
  return mapAdminResult(result, (value) => {
    if (!isRecord(value)) {
      return null;
    }

    return mapSettings(value.settings ?? value);
  });
}

function mapSettings(value: unknown): AdminSiteSettings | null {
  if (!isRecord(value)) {
    return null;
  }

  const address = readString(value.address);
  const businessName = readString(value.businessName);
  const email = readString(value.email);
  const notificationEmail = readString(value.notificationEmail);
  const phone = readString(value.phone);
  const tagline = readString(value.tagline);
  const defaultSeoDesc = readString(value.defaultSeoDesc);
  const defaultSeoTitle = readString(value.defaultSeoTitle);

  if (
    address === null ||
    businessName === null ||
    email === null ||
    notificationEmail === null ||
    phone === null ||
    tagline === null ||
    defaultSeoDesc === null ||
    defaultSeoTitle === null
  ) {
    return null;
  }

  return {
    address,
    businessName,
    defaultSeoDesc,
    defaultSeoTitle,
    email,
    notificationEmail,
    phone,
    serviceAreas: Array.isArray(value.serviceAreas)
      ? value.serviceAreas.filter(
          (item): item is string => typeof item === "string",
        )
      : [],
    tagline,
  };
}

function mapProfile(
  value: unknown,
): Pick<AuthUser, "email" | "name" | "role" | "status"> | null {
  if (!isRecord(value)) {
    return null;
  }

  const email = readString(value.email);
  const name = readString(value.name);
  const role = readString(value.role);
  const status = readString(value.status);

  if (
    email === null ||
    name === null ||
    (role !== "ADMIN" &&
      role !== "SUPER_ADMIN" &&
      role !== "CONTENT_MANAGER" &&
      role !== "STAFF") ||
    (status !== "ACTIVE" && status !== "INACTIVE" && status !== "SUSPENDED")
  ) {
    return null;
  }

  return { email, name, role, status };
}
