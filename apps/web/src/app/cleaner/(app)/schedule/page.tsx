import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CleanerScheduleView } from "@/components/cleaner/schedule/cleaner-schedule";
import { CLEANER_LOGIN_PATH, cleanerSurfaceCopy } from "@/config/cleaner";
import { requireCleanerPage } from "@/lib/auth/current-user";
import {
  loadCleanerSchedule,
  parseCleanerScheduleSearchParams,
} from "@/lib/cleaner/jobs";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: cleanerSurfaceCopy.schedule.title,
  description: cleanerSurfaceCopy.schedule.description,
};

interface CleanerSchedulePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CleanerSchedulePage({
  searchParams,
}: CleanerSchedulePageProps): Promise<ReactElement> {
  await requireCleanerPage();
  const date = parseCleanerScheduleSearchParams(await searchParams);
  const result = await loadCleanerSchedule(
    date,
    await readCustomerSessionToken(),
  );

  if (!result.ok && result.unauthorized) {
    redirect(CLEANER_LOGIN_PATH);
  }

  return <CleanerScheduleView schedule={result.ok ? result.schedule : null} />;
}
