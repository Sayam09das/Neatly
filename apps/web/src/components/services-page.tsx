import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/navbar";
import {
  ServicesCatalogSection,
  ServicesHero,
} from "@/components/sections/catalog";
import { ClosingBand } from "@/components/sections/closing-band";
import { FinalCta } from "@/components/sections/final-cta";
import { Newsletter } from "@/components/sections/newsletter";
import { ServicesHowItWorks } from "@/components/sections/process";
import { SiteFooter } from "@/components/sections/site-footer";
import { WhyNeatly } from "@/components/sections/why-neatly";
import { TEMPORARY_COPY_NOTE } from "@/config/landing";
import type { CustomerServicesQuery } from "@/lib/customer/catalog";
import {
  getHomeAccountCta,
  getHomeProcessQuotesHref,
} from "@/lib/customer/home";
import type { CustomerNavbarSession } from "@/lib/customer/navbar";
import type { CustomerServiceList } from "@/types/customer";

interface ServicesPageProps {
  list: CustomerServiceList | null;
  query: CustomerServicesQuery;
  session?: CustomerNavbarSession | null;
  status: "error" | "success";
}

export function ServicesPage({
  list,
  query,
  session = null,
  status,
}: ServicesPageProps): ReactElement {
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
        <ServicesHero />
        <ServicesCatalogSection list={list} query={query} status={status} />
        <WhyNeatly />
        <ServicesHowItWorks quotesHref={getHomeProcessQuotesHref(session)} />
        <FinalCta accountCta={getHomeAccountCta(session)} />
        <ClosingBand>
          <Newsletter />
          <SiteFooter session={session} surface="photo" />
        </ClosingBand>
      </main>
    </>
  );
}
