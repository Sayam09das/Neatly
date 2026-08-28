"use client";

import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { adminReviewCopy } from "@/config/admin-reviews";
import { getReviewRatingLabel } from "@/lib/admin/reviews";
import type { AdminReviewRatingValue } from "@/types/admin-review";

interface ReviewRatingProps {
  rating: AdminReviewRatingValue | null;
}

export function ReviewRating({ rating }: ReviewRatingProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const label = getReviewRatingLabel(rating);

  if (rating === null) {
    return <span data-slot="review-rating">{adminReviewCopy.emptyValue}</span>;
  }

  return (
    <span className="inline-flex items-center gap-1" data-slot="review-rating">
      <span className="sr-only">{label}</span>
      {([1, 2, 3, 4, 5] as const).map((value) => (
        <StarMark
          filled={value <= rating}
          key={value}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
      <span aria-hidden="true" className="text-caption text-muted-foreground">
        {String(rating)}/5
      </span>
    </span>
  );
}

interface StarMarkProps {
  filled: boolean;
  prefersReducedMotion: boolean;
}

function StarMark({
  filled,
  prefersReducedMotion,
}: StarMarkProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "size-4",
        filled ? "text-foreground" : "text-muted-foreground/40",
        prefersReducedMotion
          ? undefined
          : "motion-safe:transition-opacity motion-safe:duration-normal",
      )}
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 16 16"
    >
      <path
        d="m8 2.2 1.54 3.12 3.44.5-2.49 2.43.59 3.43L8 10.12 4.92 11.68l.59-3.43-2.49-2.43 3.44-.5L8 2.2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}
