"use client";

import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { customerReviewsCopy } from "@/config/customer";
import {
  CUSTOMER_REVIEW_RATING_MAX,
  CUSTOMER_REVIEW_RATING_MIN,
} from "@/lib/validations/customer-review.schema";

interface RatingInputProps {
  disabled?: boolean;
  name: string;
  onChange: (rating: number) => void;
  value: number;
}

export function RatingInput({
  disabled = false,
  name,
  onChange,
  value,
}: RatingInputProps): ReactElement {
  const values = Array.from(
    { length: CUSTOMER_REVIEW_RATING_MAX - CUSTOMER_REVIEW_RATING_MIN + 1 },
    (_, index) => index + CUSTOMER_REVIEW_RATING_MIN,
  );

  return (
    <fieldset className="space-y-2">
      <legend className="text-label font-medium text-foreground">
        {customerReviewsCopy.ratingLabel}
      </legend>
      <p className="sr-only" aria-live="polite">
        {customerReviewsCopy.ratingValue.replace("{rating}", String(value))}
      </p>
      <div className="flex flex-wrap gap-2">
        {values.map((rating) => (
          <label
            className={cn(
              "inline-flex min-h-touch min-w-11 cursor-pointer items-center justify-center rounded-sm border px-3 text-body focus-within:ring-2 focus-within:ring-ring",
              rating <= value
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground",
              disabled && "cursor-not-allowed opacity-60",
            )}
            key={rating}
          >
            <input
              checked={value === rating}
              className="sr-only"
              disabled={disabled}
              name={name}
              onChange={(): void => {
                onChange(rating);
              }}
              type="radio"
              value={rating}
            />
            <span aria-hidden="true">{rating}</span>
            <span className="sr-only">{`${String(rating)} out of 5`}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
