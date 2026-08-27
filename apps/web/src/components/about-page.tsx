import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/navbar";
import {
  AboutCta,
  AboutHero,
  AboutProcess,
  AboutTeam,
  AboutTrust,
  AboutWhy,
  OurCommitment,
  OurStandard,
  OurStory,
  QualityDetails,
} from "@/components/sections/about";
import { ClosingBand } from "@/components/sections/closing-band";
import { Newsletter } from "@/components/sections/newsletter";
import { SiteFooter } from "@/components/sections/site-footer";
import { TEMPORARY_COPY_NOTE } from "@/config/landing";

export function AboutPage(): ReactElement {
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
        <AboutHero />
        <OurStory />
        <OurStandard />
        <AboutProcess />
        <AboutTeam />
        <OurCommitment />
        <QualityDetails />
        <AboutWhy />
        <AboutTrust />
        <AboutCta />
        <ClosingBand>
          <Newsletter />
          <SiteFooter surface="photo" />
        </ClosingBand>
      </main>
    </>
  );
}
