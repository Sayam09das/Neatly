import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { landingBlogHighlights, landingCtas } from "@/config/landing";

export function BlogHighlights(): ReactElement {
  const reservedSlots = Array.from(
    { length: landingBlogHighlights.reservedCount },
    (_, index) => index + 1,
  );

  return (
    <section
      aria-labelledby={landingBlogHighlights.headingId}
      className="bg-muted/40"
      id="journal"
    >
      <div className="mx-auto w-full max-w-page px-gutter py-section">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-display text-foreground tracking-tight"
            id={landingBlogHighlights.headingId}
          >
            {landingBlogHighlights.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-body text-muted-foreground">
            {landingBlogHighlights.intro}
          </p>
        </div>
        <div className="mt-16 grid gap-grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <article className="flex min-h-72 flex-col justify-end rounded-xl border border-border bg-background p-6 md:p-8">
            <p className="text-label text-primary uppercase">
              {landingBlogHighlights.featuredLabel}
            </p>
            <h3 className="mt-4 text-h3 text-foreground tracking-tight">
              {landingBlogHighlights.emptyMessage}
            </h3>
          </article>
          <ul className="grid gap-grid">
            {reservedSlots.map((slot) => (
              <li
                className="rounded-xl border border-border bg-background p-6"
                key={slot}
              >
                <p className="text-label text-muted-foreground uppercase">
                  Slot {String(slot).padStart(2, "0")}
                </p>
                <p className="mt-3 text-body-small text-muted-foreground">
                  A published journal title will appear here.
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline">
            <Link href={landingCtas.readJournal.href}>
              {landingCtas.readJournal.label}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
