import { cn } from "@neatly/utils";
import type { ReactElement } from "react";

export interface QuoteStep {
  id: string;
  label: string;
}

interface QuoteStepperProps {
  current: number;
  label: string;
  steps: readonly QuoteStep[];
}

export function QuoteStepper({
  current,
  label,
  steps,
}: QuoteStepperProps): ReactElement {
  return (
    <ol
      aria-label={label}
      className="flex flex-wrap gap-3 text-caption text-muted-foreground"
    >
      {steps.map((step, index) => {
        const isCurrent = index === current;
        const isComplete = index < current;

        return (
          <li
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
              "min-h-touch inline-flex items-center",
              isCurrent ? "font-medium text-foreground" : "",
              isComplete ? "text-foreground" : "",
            )}
            key={step.id}
          >
            <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full border border-border text-caption">
              {index + 1}
            </span>
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}
