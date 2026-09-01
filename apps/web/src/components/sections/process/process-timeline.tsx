import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { landingHowItWorks } from "@/config/landing";
import { ProcessStepItem } from "./process-step";

interface ProcessTimelineProps {
  quotesHref?: string;
}

export function ProcessTimeline({
  quotesHref,
}: ProcessTimelineProps): ReactElement {
  return (
    <ol className="relative" data-process-timeline>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-3 left-3 w-px bg-secondary-foreground/20"
        data-process-progress
      >
        <div
          className="h-full w-full origin-top bg-accent/70 dark:bg-accent-foreground/70"
          data-process-progress-line
        />
      </div>
      {landingHowItWorks.steps.map((step, index) => {
        const cta = resolveStepCta(step, quotesHref);

        return (
          <li
            className={cn(
              "group relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 py-6",
              "rounded-xl border border-transparent px-2 motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard",
              "[&.is-active]:border-secondary-foreground/15 [&.is-active]:bg-secondary-foreground/5",
              index === 0 && "is-active",
            )}
            data-process-step
            data-process-step-id={step.id}
            key={step.id}
          >
            <div className="relative z-10 mt-1.5 flex size-6 items-center justify-center">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-accent motion-safe:transition-transform motion-safe:duration-normal motion-safe:ease-standard dark:bg-accent-foreground"
                data-process-dot
              />
            </div>
            <div className="min-w-0">
              <ProcessStepItem cta={cta} step={step} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function resolveStepCta(
  step: (typeof landingHowItWorks.steps)[number],
  quotesHref: string | undefined,
): { href: string; label: string } | undefined {
  if ("cta" in step) {
    return step.cta;
  }

  if (step.id === "accept" && quotesHref !== undefined) {
    return {
      href: quotesHref,
      label: landingHowItWorks.quotesCta.label,
    };
  }

  return undefined;
}
