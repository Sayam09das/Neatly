import type { ReactElement } from "react";
import { landingBlogHighlights } from "@/config/landing";
import type { LandingJournalPost } from "@/lib/customer/public-blog";
import { JournalScene, type JournalStatus } from "./journal-scene";

interface BlogHighlightsProps {
  posts?: ReadonlyArray<LandingJournalPost>;
  status?: JournalStatus;
}

export function BlogHighlights({
  posts = [],
  status = "success",
}: BlogHighlightsProps): ReactElement {
  return (
    <section
      aria-labelledby={landingBlogHighlights.headingId}
      className="bg-muted/40"
      id="journal"
    >
      <JournalScene posts={posts} status={status} />
    </section>
  );
}
