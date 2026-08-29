import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { customerSurfaceCopy } from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: customerSurfaceCopy.dashboard.title,
};

interface CustomerAppLayoutProps {
  children: ReactNode;
}

export default async function CustomerAppLayout({
  children,
}: CustomerAppLayoutProps): Promise<ReactElement> {
  await requireCustomerPage();

  return <CustomerShell>{children}</CustomerShell>;
}
