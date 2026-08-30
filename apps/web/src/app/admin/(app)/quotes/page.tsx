import type { Metadata } from "next";
import { type ReactElement, Suspense } from "react";
import { AdminQuotes } from "@/components/admin/quotes/admin-quotes";
import { adminQuoteCopy } from "@/config/admin-quotes";

export const metadata: Metadata = {
  title: adminQuoteCopy.title,
};

export default function AdminQuotesPage(): ReactElement {
  return (
    <Suspense fallback={<AdminQuotes presentation={{ status: "loading" }} />}>
      <AdminQuotes />
    </Suspense>
  );
}
