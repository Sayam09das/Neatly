import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CleanerDashboardOverview } from "@/components/cleaner/dashboard/cleaner-dashboard-overview";
import { CLEANER_LOGIN_PATH, cleanerSurfaceCopy } from "@/config/cleaner";
import { requireCleanerPage } from "@/lib/auth/current-user";
import { loadCleanerOverview } from "@/lib/cleaner/jobs";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: cleanerSurfaceCopy.home.title,
  description: cleanerSurfaceCopy.home.description,
};

export default async function CleanerHomePage(): Promise<ReactElement> {
  const profile = await requireCleanerPage();
  const result = await loadCleanerOverview(await readCustomerSessionToken());

  if (!result.ok && result.unauthorized) {
    redirect(CLEANER_LOGIN_PATH);
  }

  return (
    <CleanerDashboardOverview
      identity={{ email: profile.email, name: profile.name }}
      now={new Date()}
      overview={result.ok ? result.overview : null}
    />
  );
}
