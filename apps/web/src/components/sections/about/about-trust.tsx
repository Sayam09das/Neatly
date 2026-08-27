import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { aboutTrust } from "@/config/about";
import { landingTestimonials } from "@/config/landing";

export function AboutTrust(): ReactElement {
  return (
    <section
      aria-labelledby={aboutTrust.headingId}
      className="about-trust bg-background text-foreground"
      data-customer-trust
      id="trust"
    >
      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-16 xl:gap-x-24">
          <div className="lg:col-span-5">
            <p
              className="about-trust-eyebrow text-label text-primary uppercase"
              data-trust-eyebrow
            >
              {aboutTrust.eyebrow}
            </p>
            <h2
              aria-label={aboutTrust.heading}
              className="about-trust-heading mt-4 text-display tracking-tight"
              data-trust-heading
              id={aboutTrust.headingId}
            >
              {aboutTrust.headingLines.map((line, index) => {
                const isAccent = index === aboutTrust.headingLines.length - 1;

                return (
                  <span
                    aria-hidden="true"
                    className={cn("block", isAccent && "text-primary")}
                    key={line}
                  >
                    {line}
                  </span>
                );
              })}
            </h2>
            <p
              className="about-trust-copy mt-6 max-w-xl text-body text-muted-foreground"
              data-trust-copy
            >
              {aboutTrust.intro}
            </p>
          </div>
          <div className="mt-12 lg:col-span-7 lg:mt-2">
            <p
              className="max-w-xl text-body text-muted-foreground"
              data-trust-quote
            >
              {landingTestimonials.emptyMessage}
            </p>
            <ol className="mt-10 border-b border-border">
              {aboutTrust.items.map((item) => (
                <li
                  className="about-trust-item group"
                  data-trust-item
                  key={item.number}
                >
                  <div
                    aria-hidden="true"
                    className="h-px bg-border motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard group-hover:bg-foreground/25"
                    data-trust-divider
                  />
                  <div className="py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-6 md:py-10">
                    <p
                      className="font-mono text-label text-primary uppercase md:col-span-2"
                      data-trust-number
                    >
                      {item.number}
                    </p>
                    <h3
                      className="mt-3 text-h3 tracking-tight motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard group-hover:text-primary md:col-span-10 md:mt-0"
                      data-trust-title
                    >
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-md text-body text-muted-foreground md:col-span-10 md:col-start-3 md:mt-3">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
