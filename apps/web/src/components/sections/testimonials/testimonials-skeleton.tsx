import { Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { landingTestimonials } from "@/config/landing";

export function TestimonialsSkeleton(): ReactElement {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="scroll-mt-20 bg-muted text-foreground"
      data-slot="testimonials-loading"
      role="status"
    >
      <div className="mx-auto w-full max-w-page px-gutter py-section">
        <p className="sr-only">{landingTestimonials.loadingLabel}</p>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-5">
            <Skeleton className="h-3 w-32 max-w-full" />
            <Skeleton className="mt-4 h-10 w-full max-w-md" />
            <Skeleton className="mt-3 h-10 w-2/3 max-w-sm" />
            <div className="mt-6 max-w-xl space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 max-w-full" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
            <Skeleton className="h-56 w-full rounded-xl" />
            <Skeleton className="h-56 w-full rounded-xl" />
            <Skeleton className="h-56 w-full rounded-xl md:col-span-2 lg:col-span-1" />
          </div>
        </div>
      </div>
    </section>
  );
}
