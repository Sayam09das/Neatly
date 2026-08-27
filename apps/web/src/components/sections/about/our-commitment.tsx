import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { BandCurve } from "@/components/sections/band-curve";
import { aboutCommitment } from "@/config/about";

export function OurCommitment(): ReactElement {
  return (
    <section
      aria-labelledby={aboutCommitment.headingId}
      className="about-commitment relative overflow-x-hidden bg-secondary text-secondary-foreground"
      data-commitment-section
      id="commitment"
    >
      <BandCurve />
      <div className="h-16 md:h-24 lg:h-28" />
      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-16 xl:gap-x-24">
          <div className="about-commitment-header lg:col-span-6">
            <p
              className="about-commitment-eyebrow text-label text-accent uppercase"
              data-about-commitment-eyebrow
              data-commitment-eyebrow
            >
              {aboutCommitment.eyebrow}
            </p>
            <h2
              aria-label={aboutCommitment.heading}
              className="about-commitment-heading mt-4 text-display tracking-tight"
              data-about-commitment-heading
              data-commitment-heading
              id={aboutCommitment.headingId}
            >
              {aboutCommitment.headingLines.map((line, index) => {
                const isAccent =
                  index === aboutCommitment.headingLines.length - 1;

                return (
                  <span
                    aria-hidden="true"
                    className={cn("block", isAccent && "text-accent")}
                    key={line}
                  >
                    {line}
                  </span>
                );
              })}
            </h2>
          </div>
          <div className="about-commitment-body mt-10 lg:col-span-6 lg:mt-2">
            <p
              className="about-commitment-copy max-w-xl text-body text-secondary-foreground/80"
              data-about-commitment-copy
              data-commitment-copy
            >
              {aboutCommitment.intro}
            </p>
            <div
              aria-hidden="true"
              className="mt-10 h-px w-24 origin-left bg-accent/70 md:mt-12"
              data-about-commitment-rule
              data-commitment-divider
            />
            <ol className="mt-4">
              {aboutCommitment.items.map((item) => (
                <li
                  className="about-commitment-item group border-b border-secondary-foreground/12"
                  data-commitment-item
                  key={item.number}
                >
                  <div className="py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-6 md:py-10">
                    <p
                      className="about-commitment-number font-mono text-label text-accent uppercase md:col-span-2"
                      data-commitment-number
                    >
                      {item.number}
                    </p>
                    <h3
                      className="about-commitment-title mt-3 text-h3 tracking-tight motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard group-hover:text-accent md:col-span-10 md:mt-0"
                      data-commitment-title
                    >
                      {item.title}
                    </h3>
                    <p
                      className="about-commitment-description mt-3 max-w-md text-body text-secondary-foreground/80 md:col-span-10 md:col-start-3 md:mt-3"
                      data-commitment-description
                    >
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <div className="h-16 md:h-24 lg:h-28" />
    </section>
  );
}
