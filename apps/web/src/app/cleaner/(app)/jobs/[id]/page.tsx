import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CleanerRefreshErrorState } from "@/components/cleaner/cleaner-refresh-error";
import { CleanerJobDetails } from "@/components/cleaner/jobs/cleaner-job-details";
import { CLEANER_LOGIN_PATH, cleanerSurfaceCopy } from "@/config/cleaner";
import { requireCleanerPage } from "@/lib/auth/current-user";
import { loadCleanerJob } from "@/lib/cleaner/jobs";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: cleanerSurfaceCopy.bookingDetail.title,
};

interface CleanerJobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CleanerJobDetailPage({
  params,
}: CleanerJobDetailPageProps): Promise<ReactElement> {
  await requireCleanerPage();
  const { id } = await params;

  if (id.trim() === "") {
    notFound();
  }

  const result = await loadCleanerJob(id, await readCustomerSessionToken());

  if (!result.ok && result.unauthorized) {
    redirect(CLEANER_LOGIN_PATH);
  }

  if (!result.ok && result.notFound) {
    notFound();
  }

  if (!result.ok) {
    return <CleanerRefreshErrorState />;
  }

  return <CleanerJobDetails job={result.job} />;
}
