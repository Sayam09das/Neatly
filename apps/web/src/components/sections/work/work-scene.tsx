"use client";

import { Button } from "@neatly/ui";
import Link from "next/link";
import { type ReactElement, useRef } from "react";
import { landingCtas, landingFeaturedWork } from "@/config/landing";
import { useWorkAnimation } from "./use-work-animation";
import { WorkGallery } from "./work-gallery";

export function WorkScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useWorkAnimation({ rootRef });

  return (
    <div ref={rootRef}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-label text-primary uppercase" data-work-header-item>
          {landingFeaturedWork.eyebrow}
        </p>
        <h2
          className="mt-4 text-display text-foreground tracking-tight"
          data-work-header-item
          id={landingFeaturedWork.headingId}
        >
          {landingFeaturedWork.heading}
        </h2>
        <p
          className="mx-auto mt-6 max-w-xl text-body text-muted-foreground"
          data-work-header-item
        >
          {landingFeaturedWork.intro}
        </p>
        <div
          aria-hidden="true"
          className="mx-auto mt-8 h-px w-24 origin-left bg-primary/70"
          data-work-rule
        />
      </div>
      <div className="mt-16">
        <WorkGallery tiles={landingFeaturedWork.tiles} />
      </div>
      <p
        className="mt-10 max-w-content text-body-small text-muted-foreground"
        data-work-empty
      >
        {landingFeaturedWork.emptyMessage}
      </p>
      <div className="mt-8" data-work-cta>
        <Button asChild variant="outline">
          <Link href={landingCtas.viewWork.href}>
            {landingCtas.viewWork.label}
          </Link>
        </Button>
      </div>
    </div>
  );
}
