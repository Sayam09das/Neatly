import { Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/navbar";
import { blogPageCopy } from "@/config/blog-page";
import { landingBlogHighlights } from "@/config/landing";

export default function BlogLoading(): ReactElement {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section
          aria-busy="true"
          aria-labelledby={blogPageCopy.headingId}
          aria-live="polite"
          className="bg-muted/40"
          data-slot="blog-loading"
          role="status"
        >
          <p className="sr-only">{landingBlogHighlights.loadingLabel}</p>
          <div className="mx-auto w-full max-w-page px-gutter py-section">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-4 h-10 w-full max-w-md" />
            <Skeleton className="mt-6 h-4 w-full max-w-xl" />
            <div className="mt-12 grid gap-grid sm:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-72 w-full rounded-xl" />
              <Skeleton className="h-72 w-full rounded-xl" />
              <Skeleton className="h-72 w-full rounded-xl" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
