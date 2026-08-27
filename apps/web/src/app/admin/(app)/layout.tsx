import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { requireAdminPage } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminAppLayoutProps {
  children: ReactNode;
}

export default async function AdminAppLayout({
  children,
}: AdminAppLayoutProps): Promise<ReactElement> {
  await requireAdminPage();
  return <>{children}</>;
}
