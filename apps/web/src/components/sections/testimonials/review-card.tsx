import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import type { LandingTestimonial } from "@/config/landing";
import { getPublicReviewInitials } from "@/lib/customer/public-reviews";
import { ReviewRatingStars } from "./review-rating-stars";

interface ReviewCardProps {
  featured?: boolean;
  review: LandingTestimonial;
}

export function ReviewCard({
  featured = false,
  review,
}: ReviewCardProps): ReactElement {
  const initials = getPublicReviewInitials(review.name);

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl border border-border bg-surface p-6 text-surface-foreground shadow-sm",
        "motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard",
        "hover:border-foreground/20",
        featured && "p-6 sm:p-8 lg:p-10",
      )}
      data-reveal
      data-slot={featured ? "featured-review" : "review-card"}
    >
      {review.rating === undefined ? null : (
        <ReviewRatingStars rating={review.rating} />
      )}
      <blockquote
        className={cn(review.rating === undefined ? undefined : "mt-5")}
      >
        <span
          aria-hidden="true"
          className="mb-3 block text-h2 leading-none text-muted-foreground/30"
        >
          “
        </span>
        <p
          className={cn(
            "max-w-prose text-pretty break-words text-foreground",
            featured
              ? "text-h3 tracking-tight sm:text-h2"
              : "line-clamp-6 text-body",
          )}
        >
          {review.quote}
        </p>
        <footer className="mt-8 flex items-center gap-3">
          {initials === "" ? null : (
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-caption font-medium text-accent-foreground"
            >
              {initials}
            </span>
          )}
          <div className="min-w-0">
            <p className="text-label font-medium text-foreground">
              <cite className="not-italic">{review.name}</cite>
            </p>
            {review.service === undefined ? null : (
              <p className="mt-1 text-caption text-muted-foreground">
                {review.service}
              </p>
            )}
            {review.location === undefined ? null : (
              <p className="mt-1 text-caption text-muted-foreground">
                {review.location}
              </p>
            )}
            {review.date === undefined ? null : (
              <p className="mt-1 text-caption text-muted-foreground">
                {review.date}
              </p>
            )}
          </div>
        </footer>
      </blockquote>
    </article>
  );
}
