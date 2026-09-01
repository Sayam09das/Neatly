import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ClosingBand } from "@/components/sections/closing-band";
import { ContactDetails, ContactForm } from "@/components/sections/contact";
import { Newsletter } from "@/components/sections/newsletter";
import { SiteFooter } from "@/components/sections/site-footer";
import { contactPageCopy } from "@/config/contact";
import { TEMPORARY_COPY_NOTE } from "@/config/landing";
import type { CustomerNavbarSession } from "@/lib/customer/navbar";

interface ContactPageProps {
  session?: CustomerNavbarSession | null;
}

export function ContactPage({
  session = null,
}: ContactPageProps): ReactElement {
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
          aria-labelledby={contactPageCopy.headingId}
          className="bg-background text-foreground"
          id="contact"
        >
          <div className="mx-auto max-w-page px-gutter py-section">
            <div className="max-w-2xl">
              <p className="text-label text-primary uppercase">
                {contactPageCopy.eyebrow}
              </p>
              <h1
                className="mt-4 text-display tracking-tight"
                id={contactPageCopy.headingId}
              >
                {contactPageCopy.heading}
              </h1>
              <p className="mt-6 max-w-xl text-body text-muted-foreground">
                {contactPageCopy.intro}
              </p>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <ContactForm />
              </div>
              <div className="lg:col-span-5">
                <ContactDetails />
              </div>
            </div>
          </div>
        </section>
        <ClosingBand>
          <Newsletter />
          <SiteFooter session={session} surface="photo" />
        </ClosingBand>
      </main>
    </>
  );
}
