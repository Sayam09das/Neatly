"use client";

import { type ReactElement, useRef } from "react";
import { useSectionReveal } from "@/animations/hooks/use-section-reveal";
import { type LandingTestimonial, landingTestimonials } from "@/config/landing";
import { ReservedTestimonials } from "./reserved-testimonials";
import { TestimonialStory } from "./testimonial-story";
import { TestimonialsCarousel } from "./testimonials-carousel";

interface TestimonialsSceneProps {
  testimonials: ReadonlyArray<LandingTestimonial>;
}

export function TestimonialsScene({
  testimonials,
}: TestimonialsSceneProps): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const featured = testimonials[0];
  const hasCarousel = testimonials.length > 1;

  useSectionReveal({ rootRef });

  return (
    <div
      className="mx-auto w-full max-w-page px-gutter py-section"
      ref={rootRef}
    >
      <div className="max-w-2xl">
        <p className="text-label text-primary uppercase" data-reveal>
          {landingTestimonials.eyebrow}
        </p>
        <h2
          className="mt-4 text-display tracking-tight"
          data-reveal
          id={landingTestimonials.headingId}
        >
          {landingTestimonials.heading}
        </h2>
        <p
          className="mt-6 max-w-xl text-body text-muted-foreground"
          data-reveal
        >
          {landingTestimonials.intro}
        </p>
      </div>
      <div className="mt-16" data-reveal>
        {hasCarousel ? (
          <TestimonialsCarousel items={testimonials} />
        ) : featured === undefined ? (
          <ReservedTestimonials />
        ) : (
          <TestimonialStory testimonial={featured} />
        )}
      </div>
    </div>
  );
}
