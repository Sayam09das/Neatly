"use client";

import { Button } from "@neatly/ui";
import Link from "next/link";
import { type ReactElement, useRef } from "react";
import { useSectionReveal } from "@/animations/hooks/use-section-reveal";
import { type LandingTestimonial, landingTestimonials } from "@/config/landing";
import { ReservedTestimonials } from "./reserved-testimonials";
import { ReviewCard } from "./review-card";

export type TestimonialsStatus = "success" | "error";

interface TestimonialsSceneProps {
  headingLevel?: "h1" | "h2";
  status: TestimonialsStatus;
  testimonials: ReadonlyArray<LandingTestimonial>;
}

export function TestimonialsScene({
  headingLevel = "h2",
  status,
  testimonials,
}: TestimonialsSceneProps): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const HeadingTag = headingLevel;
  const featured = testimonials.find((item) => item.featured === true);
  const remaining =
    featured === undefined
      ? testimonials
      : testimonials.filter((item) => item.id !== featured.id);
  const showQuoteCta = status === "error" || testimonials.length === 0;

  useSectionReveal({ rootRef });

  return (
    <div
      className="mx-auto w-full max-w-page px-gutter py-section"
      ref={rootRef}
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
        <div className="max-w-xl lg:col-span-5">
          <p className="text-label text-primary uppercase" data-reveal>
            {landingTestimonials.eyebrow}
          </p>
          <HeadingTag
            className="mt-4 text-display tracking-tight"
            data-reveal
            id={landingTestimonials.headingId}
          >
            {landingTestimonials.headingLead}{" "}
            <span className="block">{landingTestimonials.headingTail}</span>
          </HeadingTag>
          <p
            className="mt-6 max-w-xl text-body text-muted-foreground"
            data-reveal
          >
            {landingTestimonials.intro}
          </p>
          {showQuoteCta ? (
            <div className="mt-8" data-reveal>
              <Button asChild>
                <Link href={landingTestimonials.emptyCta.href}>
                  {landingTestimonials.emptyCta.label}
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
        <div className="lg:col-span-7">
          {status === "error" ? (
            <ReviewsUnavailable />
          ) : testimonials.length === 0 ? (
            <ReservedTestimonials />
          ) : (
            <PublishedReviews featured={featured} remaining={remaining} />
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewsUnavailable(): ReactElement {
  return (
    <div
      className="rounded-xl border border-border bg-surface p-6 sm:p-8"
      data-reveal
      role="status"
    >
      <p className="max-w-prose text-h3 tracking-tight">
        {landingTestimonials.errorMessage}
      </p>
      <p className="mt-4 max-w-prose text-body text-muted-foreground">
        {landingTestimonials.emptyMessage}
      </p>
    </div>
  );
}

interface PublishedReviewsProps {
  featured: LandingTestimonial | undefined;
  remaining: ReadonlyArray<LandingTestimonial>;
}

function PublishedReviews({
  featured,
  remaining,
}: PublishedReviewsProps): ReactElement {
  if (featured === undefined) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {remaining.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <ReviewCard featured review={featured} />
      {remaining.length === 0 ? null : (
        <div className="grid gap-6 md:grid-cols-2">
          {remaining.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
