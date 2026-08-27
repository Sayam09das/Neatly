import type { ReactElement } from "react";
import { type LandingTestimonial, landingTestimonials } from "@/config/landing";
import { TestimonialsScene } from "./testimonials-scene";

interface TestimonialsProps {
  testimonials?: ReadonlyArray<LandingTestimonial>;
}

export function Testimonials({
  testimonials = landingTestimonials.items,
}: TestimonialsProps): ReactElement {
  return (
    <section
      aria-labelledby={landingTestimonials.headingId}
      className="bg-muted text-foreground"
      id="testimonials"
    >
      <TestimonialsScene testimonials={testimonials} />
    </section>
  );
}
