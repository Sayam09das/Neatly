import type { Metadata } from "next";
import { type ReactElement, Suspense } from "react";
import { AdminReviews } from "@/components/admin/reviews/admin-reviews";
import { adminReviewCopy } from "@/config/admin-reviews";

export const metadata: Metadata = {
  title: adminReviewCopy.title,
};

export default function AdminReviewsPage(): ReactElement {
  return (
    <Suspense fallback={<AdminReviews presentation={{ status: "loading" }} />}>
      <AdminReviews />
    </Suspense>
  );
}
