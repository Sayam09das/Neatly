import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/navbar";
import { BlogHighlights } from "@/components/sections/blog-highlights";
import { FeaturedWork } from "@/components/sections/featured-work";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Newsletter } from "@/components/sections/newsletter";
import { ServicesSummary } from "@/components/sections/services-summary";
import { SiteFooter } from "@/components/sections/site-footer";
import { Statistics } from "@/components/sections/statistics";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustIndicators } from "@/components/sections/trust-indicators";
import { WhyNeatly } from "@/components/sections/why-neatly";
import { TEMPORARY_COPY_NOTE } from "@/config/landing";

export function LandingPage(): ReactElement {
  return (
    <>
      <a
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-gutter focus-visible:z-tooltip focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-foreground"
        href="#main-content"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <p className="sr-only">{TEMPORARY_COPY_NOTE}</p>
        <Hero />
        <TrustIndicators />
        <WhyNeatly />
        <ServicesSummary />
        <FeaturedWork />
        <HowItWorks />
        <Statistics />
        <Testimonials />
        <FinalCta />
        <BlogHighlights />
        <Newsletter />
      </main>
      <SiteFooter />
    </>
  );
}
