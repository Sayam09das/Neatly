import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ClosingBand } from "@/components/sections/closing-band";
import { FinalCta } from "@/components/sections/final-cta";
import { BlogIndexList } from "@/components/sections/journal/blog-index-list";
import { Newsletter } from "@/components/sections/newsletter";
import { SiteFooter } from "@/components/sections/site-footer";
import { blogPageCopy } from "@/config/blog-page";
import { landingBlogHighlights, TEMPORARY_COPY_NOTE } from "@/config/landing";
import { getHomeAccountCta } from "@/lib/customer/home";
import type { CustomerNavbarSession } from "@/lib/customer/navbar";
import type { LandingJournalPost } from "@/lib/customer/public-blog";

interface BlogPageProps {
  posts: ReadonlyArray<LandingJournalPost>;
  session?: CustomerNavbarSession | null;
  status: "error" | "success";
}

export function BlogPage({
  posts,
  session = null,
  status,
}: BlogPageProps): ReactElement {
  return (
    <>
      <a
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-gutter focus-visible:z-tooltip focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-foreground"
        href="#main-content"
      >
        Skip to content
      </a>
      <Navbar session={session} />
      <main id="main-content">
        <p className="sr-only">{TEMPORARY_COPY_NOTE}</p>
        <section
          aria-labelledby={blogPageCopy.headingId}
          className="bg-muted/40"
        >
          <div className="mx-auto w-full max-w-page px-gutter py-section">
            <p className="text-label text-primary uppercase">
              {blogPageCopy.eyebrow}
            </p>
            <h1
              className="mt-4 max-w-2xl text-display tracking-tight"
              id={blogPageCopy.headingId}
            >
              {blogPageCopy.heading}
            </h1>
            <p className="mt-6 max-w-xl text-body text-muted-foreground">
              {landingBlogHighlights.intro}
            </p>
            <div className="mt-12">
              <BlogIndexList posts={posts} status={status} />
            </div>
          </div>
        </section>
        <FinalCta accountCta={getHomeAccountCta(session)} />
        <ClosingBand>
          <Newsletter />
          <SiteFooter session={session} surface="photo" />
        </ClosingBand>
      </main>
    </>
  );
}
