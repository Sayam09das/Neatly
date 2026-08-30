export interface SettingsRecord {
  address: string;
  businessName: string;
  defaultSeoDesc: string;
  defaultSeoTitle: string;
  email: string;
  notificationEmail: string;
  phone: string;
  serviceAreas: string[];
  socialLinks: unknown;
  tagline: string;
  updatedAt: Date;
  workingHours: unknown;
}

export const EMPTY_SITE_SETTINGS_UPDATED_AT = new Date(0);

export function createEmptySiteSettings(
  updatedAt: Date = EMPTY_SITE_SETTINGS_UPDATED_AT,
): SettingsRecord {
  return {
    address: "",
    businessName: "Neatly",
    defaultSeoDesc: "",
    defaultSeoTitle: "",
    email: "",
    notificationEmail: "",
    phone: "",
    serviceAreas: [],
    socialLinks: null,
    tagline: "Clean, minimal, high-trust",
    updatedAt,
    workingHours: {},
  };
}

export interface UpdateSettingsInput {
  address?: string;
  businessName?: string;
  defaultSeoDesc?: string;
  defaultSeoTitle?: string;
  email?: string;
  notificationEmail?: string;
  phone?: string;
  serviceAreas?: string[];
  socialLinks?: unknown;
  tagline?: string;
  workingHours?: unknown;
}
