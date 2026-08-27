import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { aboutProcess } from "@/config/about";

export function AboutProcess(): ReactElement {
  return (
    <section
      aria-labelledby={aboutProcess.headingId}
      className="about-process bg-background text-foreground"
      data-about-process
      id="how-we-work"
    >
      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-16">
          <div
            className="about-process-header lg:sticky lg:top-28 lg:col-span-5"
            data-about-process-header
          >
            <p
              className="about-process-eyebrow text-label text-primary uppercase"
              data-about-process-eyebrow
            >
              {aboutProcess.eyebrow}
            </p>
            <h2
              aria-label={aboutProcess.heading}
              className="about-process-heading mt-4 text-display tracking-tight"
              data-about-process-heading
              id={aboutProcess.headingId}
            >
              {aboutProcess.headingLines.map((line, index) => {
                const isAccent = index === aboutProcess.headingLines.length - 1;

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
              className="about-process-description mt-6 max-w-xl text-body text-muted-foreground"
              data-about-process-description
            >
              {aboutProcess.intro}
            </p>
          </div>
          <ol className="about-process-list mt-16 border-b border-border lg:col-span-7 lg:mt-0">
            {aboutProcess.steps.map((step) => (
              <li
                className="about-process-item group"
                data-about-process-step
                data-process-item
                key={step.number}
              >
                <div
                  aria-hidden="true"
                  className="about-process-divider h-px bg-border motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard group-hover:bg-foreground/25"
                  data-about-process-divider
                  data-process-divider
                />
                <div className="grid py-8 md:grid-cols-[3.5rem_1fr] md:items-baseline md:gap-x-6 md:py-10 lg:py-12">
                  <p
                    className="about-process-number font-mono text-label text-primary uppercase"
                    data-about-process-number
                    data-process-number
                  >
                    {step.number}
                  </p>
                  <h3
                    className="about-process-title mt-4 text-h2 tracking-tight motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard group-hover:text-primary md:mt-0"
                    data-about-process-title
                    data-process-title
                  >
                    {step.title}
                  </h3>
                  <p
                    className="about-process-copy mt-3 max-w-md text-body text-muted-foreground md:col-start-2 md:mt-4"
                    data-about-process-copy
                    data-process-description
                  >
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
