"use client";

import { type ReactElement, useState } from "react";
import type { LandingTestimonial } from "@/config/landing";
import { getTestimonialByIndex } from "./testimonial-index";
import { TestimonialNavigation } from "./testimonial-navigation";
import { TestimonialStory } from "./testimonial-story";

interface TestimonialsCarouselProps {
  items: ReadonlyArray<LandingTestimonial>;
}

export function TestimonialsCarousel({
  items,
}: TestimonialsCarouselProps): ReactElement | null {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = getTestimonialByIndex(items, activeIndex);

  if (current === undefined) {
    return null;
  }

  const lastIndex = items.length - 1;

  return (
    <div className="grid gap-12">
      <TestimonialStory testimonial={current} />
      <TestimonialNavigation
        activeIndex={activeIndex}
        count={items.length}
        onNext={(): void => {
          setActiveIndex((index) => (index >= lastIndex ? 0 : index + 1));
        }}
        onPrevious={(): void => {
          setActiveIndex((index) => (index <= 0 ? lastIndex : index - 1));
        }}
        onSelect={setActiveIndex}
      />
    </div>
  );
}
