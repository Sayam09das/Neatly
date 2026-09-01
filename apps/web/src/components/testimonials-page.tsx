import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ClosingBand } from "@/components/sections/closing-band";
import { FinalCta } from "@/components/sections/final-cta";
import { Newsletter } from "@/components/sections/newsletter";
import { SiteFooter } from "@/components/sections/site-footer";
import { Testimonials } from "@/components/sections/testimonials";
import { type LandingTestimonial, TEMPORARY_COPY_NOTE } from "@/config/landing";
import { getHomeAccountCta } from "@/lib/customer/home";
import type { CustomerNavbarSession } from "@/lib/customer/navbar";

interface TestimonialsPageProps {
  reviews: {
    items: ReadonlyArray<LandingTestimonial>;
    status: "error" | "success";
  };
  session?: CustomerNavbarSession | null;
}

export function TestimonialsPage({
  reviews,
  session = null,
}: TestimonialsPageProps): ReactElement {
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
        <Testimonials
          headingLevel="h1"
          status={reviews.status}
          testimonials={reviews.items}
        />
        <FinalCta accountCta={getHomeAccountCta(session)} />
        <ClosingBand>
          <Newsletter />
          <SiteFooter session={session} surface="photo" />
        </ClosingBand>
      </main>
    </>
  );
}
