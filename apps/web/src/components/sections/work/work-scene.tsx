"use client";

import { Button } from "@neatly/ui";
import Link from "next/link";
import { type ReactElement, useRef } from "react";
import { useSectionReveal } from "@/animations/hooks/use-section-reveal";
import { landingCtas, landingFeaturedWork } from "@/config/landing";
import { WorkTile } from "./work-tile";

export function WorkScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useSectionReveal({ rootRef });

  const [featured, ...rest] = landingFeaturedWork.tiles;

  return (
    <div ref={rootRef}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-label text-primary uppercase" data-reveal>
          {landingFeaturedWork.eyebrow}
        </p>
        <h2
          className="mt-4 text-display text-foreground tracking-tight"
          data-reveal
          id={landingFeaturedWork.headingId}
        >
          {landingFeaturedWork.heading}
        </h2>
        <p
          className="mx-auto mt-6 max-w-xl text-body text-muted-foreground"
          data-reveal
        >
          {landingFeaturedWork.intro}
        </p>
      </div>
      <ul className="mt-16 grid items-end gap-grid md:grid-cols-2 lg:grid-cols-4">
        {featured !== undefined ? (
          <li className="lg:translate-y-8" data-reveal>
            <WorkTile featured tile={featured} />
          </li>
        ) : null}
        {rest.map((tile, index) => (
          <li
            className={index % 2 === 0 ? "lg:-translate-y-4" : undefined}
            data-reveal
            key={tile.src}
          >
            <WorkTile tile={tile} />
          </li>
        ))}
      </ul>
      <p
        className="mt-10 max-w-content text-body-small text-muted-foreground"
        data-reveal
      >
        {landingFeaturedWork.emptyMessage}
      </p>
      <div className="mt-8" data-reveal>
        <Button asChild variant="outline">
          <Link href={landingCtas.viewWork.href}>
            {landingCtas.viewWork.label}
          </Link>
        </Button>
      </div>
    </div>
  );
}
