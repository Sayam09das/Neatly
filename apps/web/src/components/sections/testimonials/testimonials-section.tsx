import type { ReactElement } from "react";
import { type LandingTestimonial, landingTestimonials } from "@/config/landing";
import { formatTestimonialIndex } from "./testimonial-index";
import { TestimonialStory } from "./testimonial-story";
import { TestimonialsCarousel } from "./testimonials-carousel";

interface TestimonialsProps {
  testimonials?: ReadonlyArray<LandingTestimonial>;
}

function ReservedStoryIndexes(): ReactElement {
  const slots = Array.from(
    { length: landingTestimonials.reservedCount },
    (_, index) => formatTestimonialIndex(index),
  );

  return (
    <ol
      aria-label="Reserved featured review positions"
      className="flex items-center gap-3"
    >
      {slots.map((label, index) => (
        <li className="flex min-w-0 flex-1 items-center gap-3" key={label}>
          <span className="text-label text-muted-foreground uppercase">
            {label}
          </span>
          {index < slots.length - 1 ? (
            <div aria-hidden="true" className="h-px min-w-0 flex-1 bg-border" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function Testimonials({
  testimonials = landingTestimonials.items,
}: TestimonialsProps): ReactElement {
  const featured = testimonials[0];
  const hasCarousel = testimonials.length > 1;

  return (
    <section
      aria-labelledby={landingTestimonials.headingId}
      className="bg-muted text-foreground"
      id="testimonials"
    >
      <div className="mx-auto w-full max-w-page px-gutter py-section">
        <div className="max-w-2xl">
          <p className="text-label text-primary uppercase">
            {landingTestimonials.eyebrow}
          </p>
          <h2
            className="mt-4 text-display tracking-tight"
            id={landingTestimonials.headingId}
          >
            {landingTestimonials.heading}
          </h2>
          <p className="mt-6 max-w-xl text-body text-muted-foreground">
            {landingTestimonials.intro}
          </p>
        </div>
        <div className="mt-16">
          {hasCarousel ? (
            <TestimonialsCarousel items={testimonials} />
          ) : (
            <div className="grid gap-12">
              <TestimonialStory testimonial={featured} />
              {featured === undefined ? <ReservedStoryIndexes /> : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
