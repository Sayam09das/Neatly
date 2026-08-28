import type { AdminSettingsSectionId } from "@/types/admin-settings";

export const adminSettingsCopy = {
  accountDescription:
    "Account details are shown when an admin session is available.",
  accountRoleLabel: "Role",
  accountStatusLabel: "Account status",
  accountTitle: "Account",
  appearanceDescription: "Choose how Neatly looks on this device.",
  appearanceTitle: "Appearance",
  businessAddressLabel: "Address",
  businessDescription:
    "Public contact details will appear here once site settings are connected.",
  businessEmailLabel: "Public email",
  businessNameLabel: "Business name",
  businessPhoneLabel: "Phone",
  businessTitle: "Business",
  cancelLabel: "Cancel",
  closeUnavailableLabel: "Close",
  confirmPasswordLabel: "Confirm new password",
  currentPasswordLabel: "Current password",
  description: "Manage your account and Neatly preferences.",
  emailLabel: "Email",
  emptyValue: "—",
  errorDescription: "Settings could not be shown. You can try again.",
  errorTitle: "Unable to load settings",
  heading: "Settings",
  hidePasswordLabel: "Hide password",
  loadingLabel: "Loading settings",
  nameLabel: "Name",
  navLabel: "Settings sections",
  newPasswordLabel: "New password",
  notificationEmailDescription:
    "Admin alert email is managed with site settings and is not connected yet.",
  notificationEmailLabel: "Notification email",
  notificationsDescription:
    "Email alert destination for quotes and contact inquiries.",
  notificationsTitle: "Notifications",
  profileDescription:
    "Manage the information associated with your admin account.",
  profileTitle: "Profile",
  retryLabel: "Try again",
  saveLabel: "Save changes",
  securityDescription: "Password changes require backend integration.",
  securityTitle: "Security",
  showPasswordLabel: "Show password",
  themeDark: "Dark",
  themeLight: "Light",
  themeSystem: "System",
  title: "Settings",
  unavailableDescription:
    "Saving settings requires backend integration. This action is not available yet.",
  unavailableTitle: "Saving unavailable",
  unsavedLabel: "Unsaved changes",
} as const;

export const adminSettingsSections: readonly {
  description: string;
  id: AdminSettingsSectionId;
  label: string;
}[] = [
  {
    description: adminSettingsCopy.profileDescription,
    id: "profile",
    label: adminSettingsCopy.profileTitle,
  },
  {
    description: adminSettingsCopy.accountDescription,
    id: "account",
    label: adminSettingsCopy.accountTitle,
  },
  {
    description: adminSettingsCopy.notificationsDescription,
    id: "notifications",
    label: adminSettingsCopy.notificationsTitle,
  },
  {
    description: adminSettingsCopy.appearanceDescription,
    id: "appearance",
    label: adminSettingsCopy.appearanceTitle,
  },
  {
    description: adminSettingsCopy.securityDescription,
    id: "security",
    label: adminSettingsCopy.securityTitle,
  },
  {
    description: adminSettingsCopy.businessDescription,
    id: "business",
    label: adminSettingsCopy.businessTitle,
  },
];
