import type { Metadata } from "next";
import { type ReactElement, Suspense } from "react";
import { AdminCleaners } from "@/components/admin/cleaners/admin-cleaners";
import { adminCleanerCopy } from "@/config/admin-cleaners";

export const metadata: Metadata = {
  title: adminCleanerCopy.title,
};

export default function AdminCleanersPage(): ReactElement {
  return (
    <Suspense fallback={<AdminCleaners presentation={{ status: "loading" }} />}>
      <AdminCleaners />
    </Suspense>
  );
}
