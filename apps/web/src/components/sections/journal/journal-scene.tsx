"use client";

import { Button } from "@neatly/ui";
import Link from "next/link";
import { type ReactElement, useRef } from "react";
import { HeadingAccent } from "@/components/sections/heading-accent";
import {
  getPublishedLandingCta,
  landingBlogHighlights,
  landingCtas,
} from "@/config/landing";
import { JournalFeaturedCard, JournalSlotCard } from "./journal-cards";
import { useJournalAnimation } from "./use-journal-animation";

export function JournalScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const readJournal = getPublishedLandingCta(landingCtas.readJournal);

  useJournalAnimation({ rootRef });

  return (
    <div
      className="mx-auto w-full max-w-page px-gutter py-section"
      ref={rootRef}
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-label text-primary uppercase" data-journal-eyebrow>
          {landingBlogHighlights.eyebrow}
        </p>
        <h2
          className="mt-4 text-display text-foreground tracking-tight"
          data-journal-heading
          id={landingBlogHighlights.headingId}
        >
          {landingBlogHighlights.headingLead}{" "}
          <span className="relative inline-block text-primary">
            {landingBlogHighlights.headingEmphasis}
            <HeadingAccent className="pointer-events-none absolute -bottom-1 left-0 h-3 w-full text-primary" />
          </span>
        </h2>
        <p
          className="mx-auto mt-6 max-w-xl text-body text-muted-foreground"
          data-journal-intro
        >
          {landingBlogHighlights.intro}
        </p>
      </div>
      <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-12">
        <JournalFeaturedCard />
        <ul className="grid gap-grid">
          {landingBlogHighlights.slots.map((slot, index) => (
            <li data-journal-slot key={slot.src}>
              <JournalSlotCard index={index + 1} slot={slot} />
            </li>
          ))}
        </ul>
      </div>
      {readJournal === null ? null : (
        <div className="mt-10 flex justify-center" data-journal-cta>
          <Button asChild variant="outline">
            <Link href={readJournal.href}>{readJournal.label}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
