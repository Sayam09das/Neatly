import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { CleanerActivateForm } from "@/components/cleaner/activate/cleaner-activate-form";
import { authLoginVisual } from "@/config/auth-ui";
import { cleanerActivateCopy } from "@/config/cleaner";

export const metadata: Metadata = {
  description: cleanerActivateCopy.description,
  robots: {
    follow: false,
    index: false,
  },
  title: cleanerActivateCopy.title,
};

interface CleanerActivatePageProps {
  searchParams: Promise<{
    token?: string | string[];
  }>;
}

export default async function CleanerActivatePage({
  searchParams,
}: CleanerActivatePageProps): Promise<ReactElement> {
  const params = await searchParams;
  const token = params.token;
  const value = Array.isArray(token) ? (token[0] ?? null) : (token ?? null);

  return (
    <AuthShell image={authLoginVisual}>
      <CleanerActivateForm token={value} />
    </AuthShell>
  );
}
