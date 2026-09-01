import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/navbar";
import { CookiePreferences } from "@/components/legal/cookie-preferences";
import { LegalDocumentArticle } from "@/components/legal/legal-document";
import { ClosingBand } from "@/components/sections/closing-band";
import { Newsletter } from "@/components/sections/newsletter";
import { SiteFooter } from "@/components/sections/site-footer";
import { TEMPORARY_COPY_NOTE } from "@/config/landing";
import {
  LEGAL_PATHS,
  type LegalDocument,
  legalSkipToContentLabel,
} from "@/config/legal";
import type { CustomerNavbarSession } from "@/lib/customer/navbar";

interface LegalPageProps {
  document: LegalDocument;
  session?: CustomerNavbarSession | null;
}

export function LegalPage({
  document,
  session = null,
}: LegalPageProps): ReactElement {
  return (
    <>
      <a
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-gutter focus-visible:z-tooltip focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-foreground"
        href="#main-content"
      >
        {legalSkipToContentLabel}
      </a>
      <Navbar session={session} />
      <main id="main-content">
        <p className="sr-only">{TEMPORARY_COPY_NOTE}</p>
        <section
          aria-labelledby={document.headingId}
          className="bg-background text-foreground"
        >
          <div className="mx-auto max-w-page px-gutter py-section">
            <LegalDocumentArticle document={document} />
            {document.path === LEGAL_PATHS.cookies ? (
              <CookiePreferences />
            ) : null}
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
