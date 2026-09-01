import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ClosingBand } from "@/components/sections/closing-band";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { BlogHighlights } from "@/components/sections/journal";
import { Newsletter } from "@/components/sections/newsletter";
import { HowItWorks } from "@/components/sections/process";
import { TrustSection } from "@/components/sections/proof";
import { SiteFooter } from "@/components/sections/site-footer";
import { Statistics } from "@/components/sections/statistics";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustIndicators } from "@/components/sections/trust";
import { WhyNeatly } from "@/components/sections/why-neatly";
import { WordMarquee } from "@/components/sections/word-marquee";
import { FeaturedWork } from "@/components/sections/work";
import { type LandingTestimonial, TEMPORARY_COPY_NOTE } from "@/config/landing";
import {
  getHomeAccountCta,
  getHomeHeroSecondaryCta,
  getHomeProcessQuotesHref,
} from "@/lib/customer/home";
import type { CustomerNavbarSession } from "@/lib/customer/navbar";
import type { LandingJournalPost } from "@/lib/customer/public-blog";

export type LandingReviewsState =
  | { items: ReadonlyArray<LandingTestimonial>; status: "success" }
  | { items: ReadonlyArray<LandingTestimonial>; status: "error" };

export type LandingJournalState =
  | { items: ReadonlyArray<LandingJournalPost>; status: "success" }
  | { items: ReadonlyArray<LandingJournalPost>; status: "error" };

interface LandingPageProps {
  journal?: LandingJournalState;
  reviews?: LandingReviewsState;
  session?: CustomerNavbarSession | null;
}

export function LandingPage({
  journal,
  reviews,
  session = null,
}: LandingPageProps): ReactElement {
  const accountCta = getHomeAccountCta(session);
  const heroSecondaryAction = getHomeHeroSecondaryCta(session);

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
        <Hero secondaryAction={heroSecondaryAction} />
        <WhyNeatly />
        <TrustIndicators />
        <FeaturedWork />
        <WordMarquee />
        <HowItWorks quotesHref={getHomeProcessQuotesHref(session)} />
        <TrustSection />
        <Statistics />
        <Testimonials
          status={reviews?.status ?? "success"}
          testimonials={reviews?.items}
        />
        <FinalCta accountCta={accountCta} />
        <BlogHighlights
          posts={journal?.items}
          status={journal?.status ?? "success"}
        />
        <ClosingBand>
          <Newsletter />
          <SiteFooter session={session} surface="photo" />
        </ClosingBand>
      </main>
    </>
  );
}
