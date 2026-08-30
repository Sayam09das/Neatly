import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CleanerAccountPage } from "@/components/cleaner/cleaner-account-page";
import { cleanerSurfaceCopy } from "@/config/cleaner";

export const metadata: Metadata = {
  title: cleanerSurfaceCopy.help.title,
  description: cleanerSurfaceCopy.help.description,
};

export default function CleanerHelpPage(): ReactElement {
  return (
    <CleanerAccountPage
      description={cleanerSurfaceCopy.help.description}
      heading={cleanerSurfaceCopy.help.heading}
    />
  );
}
