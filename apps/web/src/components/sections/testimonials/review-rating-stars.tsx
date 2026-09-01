import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { getPublicReviewRatingLabel } from "@/lib/customer/public-reviews";

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

interface ReviewRatingStarsProps {
  rating: number;
}

export function ReviewRatingStars({
  rating,
}: ReviewRatingStarsProps): ReactElement {
  const label = getPublicReviewRatingLabel(rating);

  return (
    <span className="inline-flex items-center gap-1" data-slot="review-rating">
      <span className="sr-only">{label}</span>
      {STAR_VALUES.map((value) => (
        <StarMark filled={value <= rating} key={value} />
      ))}
    </span>
  );
}

interface StarMarkProps {
  filled: boolean;
}

function StarMark({ filled }: StarMarkProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "size-4",
        filled ? "text-primary" : "text-muted-foreground/40",
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
