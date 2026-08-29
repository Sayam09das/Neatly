export interface AdminSiteSettings {
  address: string;
  businessName: string;
  defaultSeoDesc: string;
  defaultSeoTitle: string;
  email: string;
  notificationEmail: string;
  phone: string;
  serviceAreas: readonly string[];
  tagline: string;
}

export interface AdminSettingsProfile {
  email: string;
  name: string;
  role: string;
  status: string;
}

export type AdminSettingsSectionId =
  | "account"
  | "appearance"
  | "business"
  | "notifications"
  | "profile"
  | "security";

export type AdminSettingsPresentation =
  | { status: "loading" }
  | { onRetry: () => void; status: "error" }
  | {
      profile?: AdminSettingsProfile | null;
      settings?: AdminSiteSettings | null;
      status: "ready";
    };
