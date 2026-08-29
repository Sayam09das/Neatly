import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ClosingBand } from "@/components/sections/closing-band";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { BlogHighlights } from "@/components/sections/journal";
import { Newsletter } from "@/components/sections/newsletter";
import { HowItWorks } from "@/components/sections/process";
import { TrustSection } from "@/components/sections/proof";
import { ServicesSection } from "@/components/sections/services";
import { SiteFooter } from "@/components/sections/site-footer";
import { Statistics } from "@/components/sections/statistics";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustIndicators } from "@/components/sections/trust";
import { WhyNeatly } from "@/components/sections/why-neatly";
import { WordMarquee } from "@/components/sections/word-marquee";
import { FeaturedWork } from "@/components/sections/work";
import { TEMPORARY_COPY_NOTE } from "@/config/landing";
import type { CustomerNavbarSession } from "@/lib/customer/navbar";

interface LandingPageProps {
  session?: CustomerNavbarSession | null;
}

export function LandingPage({
  session = null,
}: LandingPageProps): ReactElement {
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
        <Hero />
        <WhyNeatly />
        <ServicesSection />
        <TrustIndicators />
        <FeaturedWork />
        <WordMarquee />
        <HowItWorks />
        <TrustSection />
        <Statistics />
        <Testimonials />
        <FinalCta />
        <BlogHighlights />
        <ClosingBand>
          <Newsletter />
          <SiteFooter surface="photo" />
        </ClosingBand>
      </main>
    </>
  );
}
