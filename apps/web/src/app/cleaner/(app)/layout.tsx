import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { CleanerShell } from "@/components/cleaner/cleaner-shell";
import { cleanerSurfaceCopy } from "@/config/cleaner";
import { requireCleanerPage } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: cleanerSurfaceCopy.home.title,
};

interface CleanerAppLayoutProps {
  children: ReactNode;
}

export default async function CleanerAppLayout({
  children,
}: CleanerAppLayoutProps): Promise<ReactElement> {
  const profile = await requireCleanerPage();

  return (
    <CleanerShell identity={{ email: profile.email, name: profile.name }}>
      {children}
    </CleanerShell>
  );
}
