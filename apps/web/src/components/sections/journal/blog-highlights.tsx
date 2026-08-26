import type { ReactElement } from "react";
import { landingBlogHighlights } from "@/config/landing";
import { JournalScene } from "./journal-scene";

export function BlogHighlights(): ReactElement {
  return (
    <section
      aria-labelledby={landingBlogHighlights.headingId}
      className="bg-muted/40"
      id="journal"
    >
      <JournalScene />
    </section>
  );
}
