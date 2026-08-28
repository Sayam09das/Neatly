"use client";

import { Card } from "@neatly/ui";
import type { ReactElement } from "react";
import { adminReviewCopy } from "@/config/admin-reviews";
import {
  getAverageReviewRating,
  getReviewRatingCounts,
} from "@/lib/admin/reviews";
import type { AdminReview, AdminReviewRatingValue } from "@/types/admin-review";

interface ReviewsSummaryProps {
  reviews: readonly AdminReview[];
}

export function ReviewsSummary({
  reviews,
}: ReviewsSummaryProps): ReactElement | null {
  const average = getAverageReviewRating(reviews);
  const counts = getReviewRatingCounts(reviews);
  const ratedCount = reviews.filter((review) => review.rating !== null).length;

  if (average === null || counts === null) {
    return null;
  }

  const maxCount = Math.max(
    counts[1],
    counts[2],
    counts[3],
    counts[4],
    counts[5],
    1,
  );

  return (
    <Card className="p-4 shadow-none" data-slot="reviews-summary">
      <p className="text-body-small font-medium text-foreground">
        {adminReviewCopy.summaryTitle}
      </p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-caption text-muted-foreground">
            {adminReviewCopy.summaryAverage}
          </dt>
          <dd className="mt-1 text-body text-foreground">
            {average.toFixed(1)} / 5
          </dd>
        </div>
        <div>
          <dt className="text-caption text-muted-foreground">
            {adminReviewCopy.summaryTotal}
          </dt>
          <dd className="mt-1 text-body text-foreground">
            {String(ratedCount)}
          </dd>
        </div>
      </dl>
      <div className="mt-4 space-y-2">
        <p className="text-caption text-muted-foreground">
          {adminReviewCopy.summaryDistribution}
        </p>
        {([5, 4, 3, 2, 1] as const).map((rating) => (
          <DistributionRow
            count={counts[rating]}
            key={rating}
            maxCount={maxCount}
            rating={rating}
          />
        ))}
      </div>
    </Card>
  );
}

interface DistributionRowProps {
  count: number;
  maxCount: number;
  rating: AdminReviewRatingValue;
}

function DistributionRow({
  count,
  maxCount,
  rating,
}: DistributionRowProps): ReactElement {
  const widthPercent =
    maxCount === 0 ? 0 : Math.round((count / maxCount) * 100);

  return (
    <div className="flex items-center gap-3">
      <span className="w-8 text-caption text-muted-foreground">
        {String(rating)} ★
      </span>
      <div className="h-2 min-w-0 flex-1 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-foreground/70"
          style={{ width: `${String(widthPercent)}%` }}
        />
      </div>
      <span className="w-8 text-right text-caption text-muted-foreground">
        {String(count)}
      </span>
    </div>
  );
}
