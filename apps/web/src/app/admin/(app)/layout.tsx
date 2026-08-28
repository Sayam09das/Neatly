import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  ADMIN_HOME_PATH,
  adminHeaderCopy,
  adminHomeCopy,
} from "@/config/admin-ui";
import { requireAdminPage } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: adminHomeCopy.title,
};

interface AdminAppLayoutProps {
  children: ReactNode;
}

export default async function AdminAppLayout({
  children,
}: AdminAppLayoutProps): Promise<ReactElement> {
  await requireAdminPage();

  return (
    <AdminShell
      breadcrumbs={[
        {
          href: ADMIN_HOME_PATH,
          label: adminHeaderCopy.homeBreadcrumb,
        },
      ]}
    >
      {children}
    </AdminShell>
  );
}
