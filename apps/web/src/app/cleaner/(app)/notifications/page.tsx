import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CleanerAccountPage } from "@/components/cleaner/cleaner-account-page";
import { cleanerSurfaceCopy } from "@/config/cleaner";

export const metadata: Metadata = {
  title: cleanerSurfaceCopy.notifications.title,
  description: cleanerSurfaceCopy.notifications.description,
};

export default function CleanerNotificationsPage(): ReactElement {
  return (
    <CleanerAccountPage
      description={cleanerSurfaceCopy.notifications.description}
      heading={cleanerSurfaceCopy.notifications.heading}
    />
  );
}
