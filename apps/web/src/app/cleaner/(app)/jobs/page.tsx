import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CleanerJobs } from "@/components/cleaner/jobs/cleaner-jobs";
import { CLEANER_LOGIN_PATH, cleanerSurfaceCopy } from "@/config/cleaner";
import { requireCleanerPage } from "@/lib/auth/current-user";
import {
  loadCleanerJobs,
  parseCleanerJobsSearchParams,
} from "@/lib/cleaner/jobs";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: cleanerSurfaceCopy.jobs.title,
  description: cleanerSurfaceCopy.jobs.description,
};

interface CleanerJobsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CleanerJobsPage({
  searchParams,
}: CleanerJobsPageProps): Promise<ReactElement> {
  await requireCleanerPage();
  const query = parseCleanerJobsSearchParams(await searchParams);
  const result = await loadCleanerJobs(query, await readCustomerSessionToken());

  if (!result.ok && result.unauthorized) {
    redirect(CLEANER_LOGIN_PATH);
  }

  return <CleanerJobs list={result.ok ? result.list : null} query={query} />;
}
