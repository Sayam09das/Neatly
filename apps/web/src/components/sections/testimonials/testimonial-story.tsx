import type { ReactElement } from "react";
import type { LandingTestimonial } from "@/config/landing";
import { ReviewCard } from "./review-card";

interface TestimonialStoryProps {
  testimonial: LandingTestimonial;
}

export function TestimonialStory({
  testimonial,
}: TestimonialStoryProps): ReactElement {
  return (
    <ReviewCard featured={testimonial.featured === true} review={testimonial} />
  );
}
