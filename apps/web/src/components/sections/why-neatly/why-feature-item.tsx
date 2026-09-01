import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import type { landingWhyNeatly } from "@/config/landing";
import { WhyFeatureArrow, WhyFeatureIcon } from "./why-feature-icons";

type WhyFeature = (typeof landingWhyNeatly.features)[number];

interface WhyFeatureItemProps {
  feature: WhyFeature;
}

export function WhyFeatureItem({ feature }: WhyFeatureItemProps): ReactElement {
  return (
    <li
      className={cn(
        "group relative flex h-full flex-col border-border border-r border-b bg-background p-6 md:p-8",
        "ring-1 ring-transparent ring-inset",
        "motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard",
        "hover:bg-muted/40 hover:ring-foreground/15",
      )}
      data-why-feature
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-label text-primary uppercase">
          {feature.index}
        </p>
        <span
          className="text-muted-foreground motion-safe:transition-[color,transform] motion-safe:duration-normal motion-safe:ease-standard group-hover:text-primary motion-safe:group-hover:scale-105"
          data-why-feature-icon
        >
          <WhyFeatureIcon name={feature.icon} />
        </span>
      </div>
      <h3 className="mt-6 text-h3 text-foreground tracking-tight">
        {feature.title}
      </h3>
      <p className="mt-3 max-w-sm text-body-small text-muted-foreground">
        {feature.body}
      </p>
      <span
        aria-hidden="true"
        className="mt-auto inline-flex pt-6 text-muted-foreground motion-safe:transition-transform motion-safe:duration-normal motion-safe:ease-standard motion-safe:group-hover:translate-x-1"
        data-why-feature-arrow
      >
        <WhyFeatureArrow />
      </span>
    </li>
  );
}
