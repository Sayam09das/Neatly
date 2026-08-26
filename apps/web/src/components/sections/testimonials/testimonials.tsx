import type { ReactElement } from "react";
import { landingTestimonials } from "@/config/landing";
import { TestimonialsScene } from "./testimonials-scene";

export function Testimonials(): ReactElement {
  return (
    <section
      aria-labelledby={landingTestimonials.headingId}
      className="mx-auto w-full max-w-page px-gutter py-section"
      id="testimonials"
    >
      <TestimonialsScene />
    </section>
  );
}
