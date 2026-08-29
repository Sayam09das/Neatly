import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { CustomerRealtimeProvider } from "@/components/customer/customer-realtime-provider";
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
  const user = await requireCustomerPage();

  return (
    <CustomerRealtimeProvider>
      <CustomerShell identity={{ email: user.email, name: user.name }}>
        {children}
      </CustomerShell>
    </CustomerRealtimeProvider>
  );
}
