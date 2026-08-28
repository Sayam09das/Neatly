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
  | { status: "ready" };
