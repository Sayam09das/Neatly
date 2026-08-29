import Link from "next/link";
import type { ReactElement } from "react";
import {
  customerQuotePath,
  customerServiceDetailCopy,
} from "@/config/customer";
import type { CustomerServiceDetail } from "@/types/customer";

interface ServiceDetailSectionsProps {
  service: CustomerServiceDetail;
}

export function ServiceDetailSections({
  service,
}: ServiceDetailSectionsProps): ReactElement {
  const hasDescription = service.fullDescription.trim() !== "";
  const hasBenefits = service.benefits.length > 0;
  const hasIncluded = service.includedTasks.length > 0;
  const hasExcluded = service.excludedTasks.length > 0;
  const hasFaqs = service.faqs.length > 0;

  return (
    <div className="mt-16 flex flex-col gap-16">
      {hasDescription ? (
        <section
          aria-labelledby="service-description-heading"
          className="max-w-prose"
        >
          <h2
            className="text-h2 text-foreground tracking-tight"
            id="service-description-heading"
          >
            {customerServiceDetailCopy.descriptionHeading}
          </h2>
          <p className="mt-4 whitespace-pre-line text-body text-muted-foreground">
            {service.fullDescription}
          </p>
        </section>
      ) : null}
      {hasBenefits ? (
        <ListSection
          heading={customerServiceDetailCopy.benefitsHeading}
          headingId="service-benefits-heading"
          items={service.benefits}
        />
      ) : null}
      {hasIncluded ? (
        <ListSection
          heading={customerServiceDetailCopy.includedHeading}
          headingId="service-included-heading"
          items={service.includedTasks}
        />
      ) : null}
      {hasExcluded ? (
        <ListSection
          heading={customerServiceDetailCopy.excludedHeading}
          headingId="service-excluded-heading"
          items={service.excludedTasks}
        />
      ) : null}
      {hasFaqs ? (
        <section aria-labelledby="service-faqs-heading" className="max-w-prose">
          <h2
            className="text-h2 text-foreground tracking-tight"
            id="service-faqs-heading"
          >
            {customerServiceDetailCopy.faqsHeading}
          </h2>
          <dl className="mt-6 space-y-6">
            {service.faqs.map((faq) => (
              <div key={`${faq.question}-${faq.answer}`}>
                <dt className="text-body font-medium text-foreground">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-body text-muted-foreground">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      <section aria-labelledby="service-next-heading" className="max-w-prose">
        <h2
          className="text-h2 text-foreground tracking-tight"
          id="service-next-heading"
        >
          {customerServiceDetailCopy.nextStepsHeading}
        </h2>
        <p className="mt-4 text-body text-muted-foreground">
          {customerServiceDetailCopy.nextStepsBody}
        </p>
        <p className="mt-6">
          <Link
            className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={customerQuotePath(service.slug)}
          >
            {customerServiceDetailCopy.quoteCta}
          </Link>
        </p>
      </section>
    </div>
  );
}

interface ListSectionProps {
  heading: string;
  headingId: string;
  items: readonly string[];
}

function ListSection({
  heading,
  headingId,
  items,
}: ListSectionProps): ReactElement {
  return (
    <section aria-labelledby={headingId} className="max-w-prose">
      <h2 className="text-h2 text-foreground tracking-tight" id={headingId}>
        {heading}
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
