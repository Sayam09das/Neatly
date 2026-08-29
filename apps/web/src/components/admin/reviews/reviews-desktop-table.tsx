"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fade } from "@/animations/motion/variants";
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

interface ReviewsDesktopTableProps {
  onMutated?: () => void;
  reviews: readonly AdminReview[];
}

export function ReviewsDesktopTable({
  onMutated,
  reviews,
}: ReviewsDesktopTableProps): ReactElement {
  return (
    <Card className="hidden overflow-x-auto shadow-none md:block">
      <table className="w-full min-w-0 border-collapse text-left">
        <caption className="sr-only">{adminReviewCopy.tableLabel}</caption>
        <thead className="border-b border-border">
          <tr className="text-caption text-muted-foreground">
            <th className="px-4 py-3 font-medium" scope="col">
              {adminReviewCopy.tableReviewer}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminReviewCopy.tableRating}
            </th>
            <th className="min-w-56 px-4 py-3 font-medium" scope="col">
              {adminReviewCopy.tableReview}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminReviewCopy.tableRelated}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminReviewCopy.tableDate}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminReviewCopy.tableStatus}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminReviewCopy.tableActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <ReviewTableRow
              key={review.id}
              onMutated={onMutated}
              review={review}
            />
          ))}
        </tbody>
      </table>
    </Card>
  );
}

interface ReviewTableRowProps {
  onMutated?: () => void;
  review: AdminReview;
}

function ReviewTableRow({
  onMutated,
  review,
}: ReviewTableRowProps): ReactElement {
  return (
    <motion.tr
      className="border-b border-border align-top last:border-b-0"
      data-slot="review-table-row"
      variants={fade}
    >
      <td className="px-4 py-3 text-body-small text-foreground">
        {getReviewerLabel(review.customerName)}
      </td>
      <td className="px-4 py-3">
        <ReviewRating rating={review.rating} />
      </td>
      <td className="max-w-md px-4 py-3">
        <ReviewText content={review.content} />
      </td>
      <td className="px-4 py-3 text-body-small text-muted-foreground">
        {getReviewCategoryLabel(review.serviceCategory)}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {formatReviewDate(review.createdAt)}
      </td>
      <td className="px-4 py-3">
        <ReviewStatusBadge isActive={review.isActive} />
      </td>
      <td className="px-4 py-3">
        <ReviewRowActions onMutated={onMutated} review={review} />
      </td>
    </motion.tr>
  );
}
