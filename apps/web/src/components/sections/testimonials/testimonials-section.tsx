import type { ReactElement } from "react";
import {
  LANDING_REVIEWS_SECTION_ID,
  type LandingTestimonial,
  landingTestimonials,
} from "@/config/landing";
import {
  TestimonialsScene,
  type TestimonialsStatus,
} from "./testimonials-scene";

export type { TestimonialsStatus };

interface TestimonialsProps {
  headingLevel?: "h1" | "h2";
  status?: TestimonialsStatus;
  testimonials?: ReadonlyArray<LandingTestimonial>;
}

export function Testimonials({
  headingLevel = "h2",
  status = "success",
  testimonials = landingTestimonials.items,
}: TestimonialsProps): ReactElement {
  return (
    <section
      aria-labelledby={landingTestimonials.headingId}
      className="scroll-mt-20 bg-muted text-foreground"
      id={LANDING_REVIEWS_SECTION_ID}
    >
      <TestimonialsScene
        headingLevel={headingLevel}
        status={status}
        testimonials={testimonials}
      />
    </section>
  );
}
