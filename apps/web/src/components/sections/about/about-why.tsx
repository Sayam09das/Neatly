import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { aboutWhy } from "@/config/about";

export function AboutWhy(): ReactElement {
  return (
    <section
      aria-labelledby={aboutWhy.headingId}
      className="about-why bg-muted text-foreground"
      data-why-neatly
      id="why"
    >
      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="max-w-2xl">
          <p
            className="about-why-eyebrow text-label text-primary uppercase"
            data-about-why-header
            data-why-neatly-eyebrow
          >
            {aboutWhy.eyebrow}
          </p>
          <h2
            aria-label={aboutWhy.heading}
            className="about-why-heading mt-4 text-display tracking-tight"
            data-about-why-header
            data-why-neatly-heading
            id={aboutWhy.headingId}
          >
            {aboutWhy.headingLines.map((line, index) => {
              const isAccent = index === aboutWhy.headingLines.length - 1;

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
            className="about-why-copy mt-6 max-w-xl text-body text-muted-foreground"
            data-about-why-header
            data-why-neatly-copy
          >
            {aboutWhy.intro}
          </p>
        </div>
        <ol className="mt-16 border-b border-border md:mt-20">
          {aboutWhy.items.map((item) => (
            <li
              className="about-why-item group"
              data-about-why-item
              data-why-neatly-item
              key={item.number}
            >
              <div
                aria-hidden="true"
                className="about-why-divider h-px bg-border motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard group-hover:bg-foreground/25"
                data-why-neatly-divider
              />
              <div className="py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-6 md:py-10 lg:gap-x-12 lg:py-12">
                <p
                  className="about-why-number font-mono text-label text-primary uppercase md:col-span-2"
                  data-why-neatly-number
                >
                  {item.number}
                </p>
                <h3
                  className="about-why-title mt-4 text-h2 tracking-tight motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard group-hover:text-primary md:col-span-4 md:col-start-3 md:mt-0 lg:col-span-4"
                  data-why-neatly-title
                >
                  {item.title}
                </h3>
                <p
                  className="about-why-description mt-3 max-w-xl text-body text-muted-foreground md:col-span-6 md:col-start-7 md:mt-0 md:max-w-none lg:col-span-6 lg:col-start-7"
                  data-why-neatly-description
                >
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
