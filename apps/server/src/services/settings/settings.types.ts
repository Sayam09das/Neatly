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
