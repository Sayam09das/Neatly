import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement } from "react";
import type { landingHowItWorks } from "@/config/landing";

type ProcessStep = (typeof landingHowItWorks.steps)[number];

export interface ProcessStepCta {
  href: string;
  label: string;
}

interface ProcessStepItemProps {
  alignEnd: boolean;
  cta?: ProcessStepCta;
  step: ProcessStep;
}

export function ProcessStepItem({
  alignEnd,
  cta,
  step,
}: ProcessStepItemProps): ReactElement {
  return (
    <article
      className={cn(
        "min-w-0 motion-safe:transition-transform motion-safe:duration-normal motion-safe:ease-standard",
        "motion-safe:group-hover:-translate-y-1",
        alignEnd ? "lg:text-left" : "lg:text-right",
      )}
    >
      <p
        className="font-mono text-label text-accent uppercase motion-safe:transition-transform motion-safe:duration-normal motion-safe:ease-standard motion-safe:group-hover:scale-105 dark:text-accent-foreground"
        data-process-number
      >
        {step.number}
      </p>
      <h3 className="mt-3 text-h3 text-secondary-foreground tracking-tight">
        {step.title}
      </h3>
      <p className="mt-3 max-w-md text-body-small text-secondary-foreground/80 lg:max-w-none">
        {step.body}
      </p>
      {cta === undefined ? null : (
        <p className={cn("mt-5", alignEnd ? "lg:text-left" : "lg:text-right")}>
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
      className="group/cta inline-flex min-h-touch items-center gap-2 text-body-small font-semibold text-secondary-foreground underline-offset-4 motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
      href={href}
    >
      {label}
      <StepCtaArrow />
    </Link>
  );
}

function StepCtaArrow(): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className="size-4 motion-safe:transition-transform motion-safe:duration-normal motion-safe:ease-standard motion-safe:group-hover/cta:translate-x-0.5"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
