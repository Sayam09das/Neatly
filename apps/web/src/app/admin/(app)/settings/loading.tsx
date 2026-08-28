import { Card } from "@neatly/ui";
import type { ReactElement } from "react";
import { SettingsLoading } from "@/components/admin/settings/settings-states";
import { adminSettingsCopy } from "@/config/admin-settings";

export default function AdminSettingsLoading(): ReactElement {
  return (
    <div className="mx-auto w-full min-w-0 max-w-page space-y-8">
      <div className="max-w-prose space-y-3">
        <h1 className="text-h1 text-foreground tracking-tight">
          {adminSettingsCopy.heading}
        </h1>
        <p className="text-body text-muted-foreground">
          {adminSettingsCopy.description}
        </p>
      </div>
      <Card className="p-6 shadow-none">
        <SettingsLoading />
      </Card>
    </div>
  );
}
