import type { ReactElement } from "react";
import { LandingSection } from "@/components/landing-section";
import { landingTestimonials } from "@/config/landing";

export function Testimonials(): ReactElement {
  return (
    <LandingSection
      id="testimonials"
      labelledBy={landingTestimonials.headingId}
    >
      <h2
        className="text-h2 text-foreground tracking-tight"
        id={landingTestimonials.headingId}
      >
        {landingTestimonials.heading}
      </h2>
      <p className="mt-4 max-w-content text-body text-muted-foreground">
        {landingTestimonials.emptyMessage}
      </p>
    </LandingSection>
  );
}
