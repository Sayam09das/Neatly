"use client";

import Image from "next/image";
import { type ReactElement, useRef } from "react";
import { useSectionReveal } from "@/animations/hooks/use-section-reveal";
import { landingTestimonials } from "@/config/landing";

export function TestimonialsScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useSectionReveal({ rootRef });

  return (
    <div
      className="grid items-center gap-grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16"
      ref={rootRef}
    >
      <figure
        className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted"
        data-reveal
      >
        <Image
          alt={landingTestimonials.image.alt}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          src={landingTestimonials.image.src}
          style={{
            objectPosition: landingTestimonials.image.objectPosition,
          }}
        />
      </figure>
      <div>
        <h2
          className="text-display text-foreground tracking-tight"
          data-reveal
          id={landingTestimonials.headingId}
        >
          {landingTestimonials.heading}
        </h2>
        <p
          aria-hidden="true"
          className="mt-8 text-display text-primary"
          data-reveal
        >
          “
        </p>
        <p
          className="mt-4 max-w-xl text-body text-muted-foreground"
          data-reveal
        >
          {landingTestimonials.emptyMessage}
        </p>
        <p className="mt-8 text-label text-primary uppercase" data-reveal>
          {landingTestimonials.pendingAttribution}
        </p>
      </div>
    </div>
  );
}
