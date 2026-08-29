import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CleanerAvailabilityForm } from "@/components/cleaner/availability/cleaner-availability";
import { CLEANER_LOGIN_PATH, cleanerSurfaceCopy } from "@/config/cleaner";
import { requireCleanerPage } from "@/lib/auth/current-user";
import { loadCleanerAvailability } from "@/lib/cleaner/jobs";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: cleanerSurfaceCopy.availability.title,
  description: cleanerSurfaceCopy.availability.description,
};

export default async function CleanerAvailabilityPage(): Promise<ReactElement> {
  await requireCleanerPage();
  const result = await loadCleanerAvailability(
    await readCustomerSessionToken(),
  );

  if (!result.ok && result.unauthorized) {
    redirect(CLEANER_LOGIN_PATH);
  }

  return (
    <CleanerAvailabilityForm
      availability={result.ok ? result.availability : null}
    />
  );
}
