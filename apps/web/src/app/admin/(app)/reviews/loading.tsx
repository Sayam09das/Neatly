import { Card } from "@neatly/ui";
import type { ReactElement } from "react";
import { ReviewsLoading } from "@/components/admin/reviews/reviews-states";
import { adminReviewCopy } from "@/config/admin-reviews";

export default function AdminReviewsLoading(): ReactElement {
  return (
    <div className="mx-auto w-full min-w-0 max-w-page space-y-8">
      <div className="max-w-prose space-y-3">
        <h1 className="text-h1 text-foreground tracking-tight">
          {adminReviewCopy.heading}
        </h1>
        <p className="text-body text-muted-foreground">
          {adminReviewCopy.description}
        </p>
      </div>
      <Card className="p-6 shadow-none">
        <ReviewsLoading />
      </Card>
    </div>
  );
}
