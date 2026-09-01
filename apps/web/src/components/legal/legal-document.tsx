import type { ReactElement } from "react";
import type { LegalDocument } from "@/config/legal";

interface LegalDocumentProps {
  document: LegalDocument;
}

export function LegalDocumentArticle({
  document,
}: LegalDocumentProps): ReactElement {
  return (
    <article className="max-w-content">
      <p className="text-label text-primary uppercase">{document.eyebrow}</p>
      <h1 className="mt-4 text-display tracking-tight" id={document.headingId}>
        {document.heading}
      </h1>
      <p className="mt-3 text-caption text-muted-foreground">
        Last updated {document.lastUpdated}
      </p>
      <p className="mt-6 text-body text-muted-foreground">{document.intro}</p>
      <div className="mt-12 flex flex-col gap-10">
        {document.sections.map((section) => (
          <section aria-labelledby={section.headingId} key={section.headingId}>
            <h2 className="text-h3 tracking-tight" id={section.headingId}>
              {section.heading}
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {section.paragraphs.map((paragraph) => (
                <p className="text-body text-muted-foreground" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
