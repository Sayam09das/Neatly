import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { redirectAuthenticatedAdmin } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminSessionLayoutProps {
  children: ReactNode;
}

export default async function AdminSessionLayout({
  children,
}: AdminSessionLayoutProps): Promise<ReactElement> {
  await redirectAuthenticatedAdmin();
  return <>{children}</>;
}
