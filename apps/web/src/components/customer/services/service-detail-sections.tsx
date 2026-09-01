import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement, SVGProps } from "react";
import {
  customerQuoteLabel,
  customerServiceApplyPath,
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
  const quoteHref = customerServiceApplyPath(service.slug);

  return (
    <div className="mt-16 flex flex-col gap-16 lg:mt-24">
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
          marker="check"
        />
      ) : null}
      {hasIncluded ? (
        <ListSection
          heading={customerServiceDetailCopy.includedHeading}
          headingId="service-included-heading"
          items={service.includedTasks}
          marker="check"
        />
      ) : null}
      {hasExcluded ? (
        <ListSection
          heading={customerServiceDetailCopy.excludedHeading}
          headingId="service-excluded-heading"
          items={service.excludedTasks}
          marker="dash"
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
      <section
        aria-labelledby="service-next-heading"
        className="rounded-xl border border-border bg-muted/60 p-8 sm:p-10"
      >
        <h2
          className="text-h2 text-foreground tracking-tight"
          id="service-next-heading"
        >
          {customerServiceDetailCopy.nextStepsHeading}
        </h2>
        <p className="mt-4 max-w-prose text-body text-muted-foreground">
          {customerServiceDetailCopy.nextStepsBody}
        </p>
        <p className="mt-8">
          <Button asChild>
            <Link
              aria-label={customerQuoteLabel(service.name)}
              href={quoteHref}
            >
              {customerServiceDetailCopy.quoteCta}
            </Link>
          </Button>
        </p>
      </section>
    </div>
  );
}

interface ListSectionProps {
  heading: string;
  headingId: string;
  items: readonly string[];
  marker: "check" | "dash";
}

function ListSection({
  heading,
  headingId,
  items,
  marker,
}: ListSectionProps): ReactElement {
  return (
    <section aria-labelledby={headingId} className="max-w-prose">
      <h2 className="text-h2 text-foreground tracking-tight" id={headingId}>
        {heading}
      </h2>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li className="flex gap-3 text-body text-muted-foreground" key={item}>
            <span className="mt-0.5 text-primary">
              {marker === "check" ? <CheckIcon /> : <DashIcon />}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.5 10.5 8 14l7.5-8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function DashIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 10h10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}
