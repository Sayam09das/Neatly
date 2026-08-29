import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/db.ts";
import type {
  SettingsRecord,
  UpdateSettingsInput,
} from "../services/settings/settings.types.ts";

export const SITE_SETTINGS_ID = 1;

export interface SettingsRepository {
  find(): Promise<SettingsRecord | null>;
  update(input: UpdateSettingsInput): Promise<SettingsRecord | null>;
}

function toRecord(row: {
  address: string;
  businessName: string;
  defaultSeoDesc: string;
  defaultSeoTitle: string;
  email: string;
  notificationEmail: string;
  phone: string;
  serviceAreas: string[];
  socialLinks: Prisma.JsonValue;
  tagline: string;
  updatedAt: Date;
  workingHours: Prisma.JsonValue;
}): SettingsRecord {
  return {
    address: row.address,
    businessName: row.businessName,
    defaultSeoDesc: row.defaultSeoDesc,
    defaultSeoTitle: row.defaultSeoTitle,
    email: row.email,
    notificationEmail: row.notificationEmail,
    phone: row.phone,
    serviceAreas: row.serviceAreas,
    socialLinks: row.socialLinks,
    tagline: row.tagline,
    updatedAt: row.updatedAt,
    workingHours: row.workingHours,
  };
}

export class PrismaSettingsRepository implements SettingsRepository {
  public async find(): Promise<SettingsRecord | null> {
    const row = await prisma.siteSettings.findUnique({
      where: { id: SITE_SETTINGS_ID },
    });
    return row === null ? null : toRecord(row);
  }

  public async update(
    input: UpdateSettingsInput,
  ): Promise<SettingsRecord | null> {
    try {
      const row = await prisma.siteSettings.update({
        data: {
          ...input,
          socialLinks:
            input.socialLinks === undefined
              ? undefined
              : (input.socialLinks as Prisma.InputJsonValue),
          workingHours:
            input.workingHours === undefined
              ? undefined
              : (input.workingHours as Prisma.InputJsonValue),
        },
        where: { id: SITE_SETTINGS_ID },
      });
      return toRecord(row);
    } catch {
      return null;
    }
  }
}
