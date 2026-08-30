import type { Metadata } from "next";
import { type ReactElement, Suspense } from "react";
import { AdminNewsletter } from "@/components/admin/newsletter/admin-newsletter";
import { adminNewsletterCopy } from "@/config/admin-newsletter";

export const metadata: Metadata = {
  title: adminNewsletterCopy.title,
};

export default function AdminNewsletterPage(): ReactElement {
  return (
    <Suspense
      fallback={<AdminNewsletter presentation={{ status: "loading" }} />}
    >
      <AdminNewsletter />
    </Suspense>
  );
}
