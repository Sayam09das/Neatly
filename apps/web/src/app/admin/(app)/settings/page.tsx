import type { Metadata } from "next";
import { type ReactElement, Suspense } from "react";
import { AdminSettings } from "@/components/admin/settings/admin-settings";
import { SettingsLoading } from "@/components/admin/settings/settings-states";
import { adminSettingsCopy } from "@/config/admin-settings";

export const metadata: Metadata = {
  title: adminSettingsCopy.title,
};

export default function AdminSettingsPage(): ReactElement {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <AdminSettings presentation={{ status: "ready" }} />
    </Suspense>
  );
}
