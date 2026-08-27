import Image from "next/image";
import type { ReactElement } from "react";
import type { LandingTestimonial } from "@/config/landing";
import { landingTestimonials } from "@/config/landing";

interface TestimonialStoryProps {
  testimonial?: LandingTestimonial;
}

export function TestimonialStory({
  testimonial,
}: TestimonialStoryProps): ReactElement {
  const image = testimonial?.image ?? landingTestimonials.emptySlots[0];
  const isReservedPhoto = testimonial?.image === undefined;

  if (image === undefined) {
    throw new Error("Testimonials empty slots are missing.");
  }

  return (
    <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="w-full lg:col-span-7">
        <figure className="relative m-0 aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            alt={image.alt}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={image.src}
            style={{ objectPosition: image.objectPosition }}
          />
          {isReservedPhoto ? (
            <figcaption className="sr-only">
              {landingTestimonials.emptyMediaLabel}
            </figcaption>
          ) : null}
        </figure>
      </div>
      <div className="lg:col-span-5">
        {testimonial === undefined ? (
          <div>
            <p className="max-w-prose text-h3 tracking-tight">
              {landingTestimonials.emptyMessage}
            </p>
            <p className="mt-8 text-label text-primary uppercase">
              {landingTestimonials.emptyAttribution}
            </p>
          </div>
        ) : (
          <blockquote>
            <p className="max-w-prose text-h2 tracking-tight">
              {testimonial.quote}
            </p>
            <footer className="mt-8">
              <p className="text-label text-primary uppercase">
                <cite className="not-italic">{testimonial.name}</cite>
              </p>
              {testimonial.service !== undefined ? (
                <p className="mt-2 text-body-small text-muted-foreground">
                  {testimonial.service}
                </p>
              ) : null}
              {testimonial.location !== undefined ? (
                <p className="mt-1 text-body-small text-muted-foreground">
                  {testimonial.location}
                </p>
              ) : null}
              {testimonial.date !== undefined ? (
                <p className="mt-1 text-body-small text-muted-foreground">
                  {testimonial.date}
                </p>
              ) : null}
            </footer>
          </blockquote>
        )}
      </div>
    </article>
  );
}
