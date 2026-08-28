"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fadeUp } from "@/animations/motion/variants";
import { ReviewRating } from "@/components/admin/reviews/review-rating";
import { ReviewRowActions } from "@/components/admin/reviews/review-row-actions";
import { ReviewStatusBadge } from "@/components/admin/reviews/review-status-badge";
import { ReviewText } from "@/components/admin/reviews/review-text";
import { adminReviewCopy } from "@/config/admin-reviews";
import {
  formatReviewDate,
  getReviewCategoryLabel,
  getReviewerLabel,
} from "@/lib/admin/reviews";
import type { AdminReview } from "@/types/admin-review";

interface ReviewCardProps {
  review: AdminReview;
}

export function ReviewCard({ review }: ReviewCardProps): ReactElement {
  return (
    <motion.article
      className="rounded-lg border border-border bg-surface p-4"
      data-slot="review-card"
      variants={fadeUp}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-body-small font-medium text-foreground">
            {getReviewerLabel(review.customerName)}
          </p>
          <p className="mt-1 text-caption text-muted-foreground">
            {formatReviewDate(review.createdAt)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ReviewStatusBadge isActive={review.isActive} />
          <ReviewRowActions />
        </div>
      </div>
      <div className="mt-3">
        <ReviewRating rating={review.rating} />
      </div>
      <div className="mt-3">
        <ReviewText content={review.content} />
      </div>
      <p className="mt-3 text-caption text-muted-foreground">
        {adminReviewCopy.tableRelated}:{" "}
        {getReviewCategoryLabel(review.serviceCategory)}
      </p>
    </motion.article>
  );
}

interface ReviewCardListProps {
  reviews: readonly AdminReview[];
}

export function ReviewCardList({ reviews }: ReviewCardListProps): ReactElement {
  return (
    <Card
      className="flex flex-col gap-3 p-3 shadow-none md:hidden"
      data-slot="review-card-list"
    >
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </Card>
  );
}
