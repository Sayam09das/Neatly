import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CleanerAccountPage } from "@/components/cleaner/cleaner-account-page";
import { cleanerSurfaceCopy } from "@/config/cleaner";

export const metadata: Metadata = {
  title: cleanerSurfaceCopy.settings.title,
  description: cleanerSurfaceCopy.settings.description,
};

export default function CleanerSettingsPage(): ReactElement {
  return (
    <CleanerAccountPage
      description={cleanerSurfaceCopy.settings.description}
      heading={cleanerSurfaceCopy.settings.heading}
    />
  );
}
