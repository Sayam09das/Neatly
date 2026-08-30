import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CleanerAccountPage } from "@/components/cleaner/cleaner-account-page";
import { cleanerSurfaceCopy } from "@/config/cleaner";

export const metadata: Metadata = {
  title: cleanerSurfaceCopy.profile.title,
  description: cleanerSurfaceCopy.profile.description,
};

export default function CleanerProfilePage(): ReactElement {
  return (
    <CleanerAccountPage
      description={cleanerSurfaceCopy.profile.description}
      heading={cleanerSurfaceCopy.profile.heading}
    />
  );
}
