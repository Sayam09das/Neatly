import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement } from "react";
import type { landingHowItWorks } from "@/config/landing";
import { ProcessCtaArrow, ProcessIcon } from "./process-icons";

type ProcessStep = (typeof landingHowItWorks.steps)[number];

export interface ProcessStepCta {
  href: string;
  label: string;
}

interface ProcessStepItemProps {
  cta?: ProcessStepCta;
  step: ProcessStep;
}

export function ProcessStepItem({
  cta,
  step,
}: ProcessStepItemProps): ReactElement {
  return (
    <article className="min-w-0">
      <div className="flex items-start justify-between gap-4">
        <p
          className="font-mono text-label text-accent uppercase dark:text-accent-foreground"
          data-process-number
        >
          {step.number}
        </p>
        <span
          aria-hidden="true"
          className="text-secondary-foreground/70 motion-safe:transition-[color,transform] motion-safe:duration-normal motion-safe:ease-standard motion-safe:group-hover:scale-105 group-[.is-active]:text-accent dark:group-[.is-active]:text-accent-foreground"
        >
          <ProcessIcon name={step.icon} />
        </span>
      </div>
      <h3 className="mt-3 text-h3 text-secondary-foreground tracking-tight">
        {step.title}
      </h3>
      <p className="mt-3 max-w-md text-body-small text-secondary-foreground/80">
        {step.body}
      </p>
      {cta === undefined ? null : (
        <p className="mt-5">
          <StepCta href={cta.href} label={cta.label} />
        </p>
      )}
    </article>
  );
}

interface StepCtaProps {
  href: string;
  label: string;
}

function StepCta({ href, label }: StepCtaProps): ReactElement {
  return (
    <Link
      className={cn(
        "group/cta inline-flex min-h-touch items-center gap-2 text-body-small font-semibold text-secondary-foreground underline-offset-4",
        "motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard hover:underline",
        "focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
      )}
      href={href}
    >
      {label}
      <span className="inline-flex motion-safe:transition-transform motion-safe:duration-normal motion-safe:ease-standard motion-safe:group-hover/cta:translate-x-1">
        <ProcessCtaArrow />
      </span>
    </Link>
  );
}
