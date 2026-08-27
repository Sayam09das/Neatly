import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { BandCurve } from "@/components/sections/band-curve";
import { aboutStandard } from "@/config/about";

export function OurStandard(): ReactElement {
  return (
    <section
      aria-labelledby={aboutStandard.headingId}
      className="about-standard relative overflow-x-hidden bg-secondary text-secondary-foreground"
      id="standard"
    >
      <BandCurve />
      <div className="h-16 md:h-24 lg:h-28" />
      <div className="mx-auto max-w-page px-gutter py-section">
        <div>
          <p
            className="about-standard-eyebrow text-label text-accent uppercase"
            data-about-standard-eyebrow
          >
            {aboutStandard.eyebrow}
          </p>
          <h2
            aria-label={aboutStandard.heading}
            className="about-standard-heading mt-4 text-display tracking-tight"
            data-about-standard-heading
            id={aboutStandard.headingId}
          >
            {aboutStandard.headingLines.map((line, index) => {
              const isAccent = index === aboutStandard.headingLines.length - 1;

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
          <p
            className="about-standard-description mt-6 max-w-xl text-body text-secondary-foreground/80"
            data-about-standard-description
          >
            {aboutStandard.intro}
          </p>
        </div>
        <ol className="mt-16 border-b border-secondary-foreground/12 md:mt-20">
          {aboutStandard.principles.map((principle) => (
            <li
              className="about-standard-item group"
              data-about-standard-item
              key={principle.number}
            >
              <div
                aria-hidden="true"
                className="about-standard-divider h-px bg-secondary-foreground/12 motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard group-hover:bg-secondary-foreground/25"
                data-about-standard-divider
              />
              <div className="py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-6 md:py-10 lg:gap-x-12 lg:py-12">
                <p
                  className="about-standard-number font-mono text-label text-accent uppercase md:col-span-2"
                  data-about-standard-number
                >
                  {principle.number}
                </p>
                <h3
                  className="about-standard-title mt-4 text-h2 tracking-tight motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard group-hover:text-accent md:col-span-4 md:col-start-3 md:mt-0 lg:col-span-5"
                  data-about-standard-title
                >
                  {principle.title}
                </h3>
                <p
                  className="about-standard-copy mt-3 max-w-xl text-body text-secondary-foreground/80 md:col-span-6 md:col-start-7 md:mt-0 md:max-w-none lg:col-span-5 lg:col-start-8"
                  data-about-standard-copy
                >
                  {principle.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="h-16 md:h-24 lg:h-28" />
    </section>
  );
}
