"use client";

import { Button, Input, Label } from "@neatly/ui";
import Link from "next/link";
import {
  type ChangeEvent,
  type ReactElement,
  useId,
  useMemo,
  useState,
} from "react";
import {
  CUSTOMER_SERVICES_SEARCH_MAX_LENGTH,
  customerHelpCopy,
  customerHelpResources,
  customerServicePath,
} from "@/config/customer";
import { landingFooter } from "@/config/landing";
import type {
  CustomerHelpTopic,
  CustomerHelpWorkspace,
  CustomerPublishedContact,
} from "@/types/customer";

interface CustomerHelpProps {
  contact: CustomerPublishedContact;
  workspace: CustomerHelpWorkspace;
}

interface HelpFaqItem {
  answer: string;
  id: string;
  question: string;
  serviceName: string;
  slug: string;
}

const ALL_TOPICS = "all";

export function CustomerHelp({
  contact,
  workspace,
}: CustomerHelpProps): ReactElement {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [topicSlug, setTopicSlug] = useState(ALL_TOPICS);
  const faqs = useMemo(() => flattenFaqs(workspace.topics), [workspace.topics]);
  const needle = query.trim().toLowerCase();
  const visibleFaqs = faqs.filter((item) => {
    if (topicSlug !== ALL_TOPICS && item.slug !== topicSlug) {
      return false;
    }

    return matchesNeedle(
      `${item.question} ${item.answer} ${item.serviceName}`,
      needle,
    );
  });
  const visibleResources = customerHelpResources.filter((item) =>
    topicSlug === ALL_TOPICS
      ? matchesNeedle(`${item.title} ${item.description}`, needle)
      : false,
  );
  const hasQuery = query.trim() !== "";
  const resultCount = visibleFaqs.length + visibleResources.length;
  const hasPublishedContact =
    contact.address !== null ||
    contact.email !== null ||
    contact.hours !== null ||
    contact.phone !== null;

  return (
    <div className="w-full min-w-0 max-w-2xl space-y-12">
      <header>
        <h1 className="text-h1 text-foreground tracking-tight">
          {customerHelpCopy.heading}
        </h1>
        <p className="mt-3 max-w-prose text-body text-muted-foreground">
          {customerHelpCopy.description}
        </p>
      </header>
      <div className="space-y-3">
        <Label htmlFor={searchId}>{customerHelpCopy.searchLabel}</Label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            autoComplete="off"
            id={searchId}
            maxLength={CUSTOMER_SERVICES_SEARCH_MAX_LENGTH}
            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
              setQuery(event.target.value);
            }}
            placeholder={customerHelpCopy.searchPlaceholder}
            type="search"
            value={query}
          />
          {hasQuery ? (
            <Button
              onClick={(): void => {
                setQuery("");
              }}
              type="button"
              variant="outline"
            >
              {customerHelpCopy.clearSearch}
            </Button>
          ) : null}
        </div>
        <p aria-live="polite" className="text-caption text-muted-foreground">
          {hasQuery
            ? customerHelpCopy.resultCount.replace(
                "{count}",
                String(resultCount),
              )
            : null}
        </p>
      </div>
      {workspace.topics.length > 1 ? (
        <fieldset className="min-w-0">
          <legend className="sr-only">{customerHelpCopy.topicsHeading}</legend>
          <div className="flex flex-wrap gap-2">
            <TopicFilter
              active={topicSlug === ALL_TOPICS}
              label={customerHelpCopy.allTopics}
              onSelect={(): void => {
                setTopicSlug(ALL_TOPICS);
              }}
            />
            {workspace.topics.map((topic) => (
              <TopicFilter
                active={topicSlug === topic.slug}
                key={topic.slug}
                label={topic.name}
                onSelect={(): void => {
                  setTopicSlug(topic.slug);
                }}
              />
            ))}
          </div>
        </fieldset>
      ) : null}
      {resultCount === 0 && (hasQuery || topicSlug !== ALL_TOPICS) ? (
        <section className="max-w-prose">
          <h2 className="text-h2 text-foreground tracking-tight">
            {customerHelpCopy.noResults}
          </h2>
          <p className="mt-3 text-body text-muted-foreground">
            {customerHelpCopy.noResultsDescription}
          </p>
          <p className="mt-6">
            <a
              className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href="#customer-help-contact"
            >
              {customerHelpCopy.noResultsAction}
            </a>
          </p>
        </section>
      ) : null}
      {visibleResources.length > 0 ? (
        <section>
          <h2 className="text-h2 text-foreground tracking-tight">
            {customerHelpCopy.resourcesHeading}
          </h2>
          <ul className="mt-5 space-y-5">
            {visibleResources.map((resource) => (
              <li key={resource.href}>
                <Link
                  className="text-body font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={resource.href}
                >
                  {resource.title}
                </Link>
                <p className="mt-1 text-body text-muted-foreground">
                  {resource.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section>
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerHelpCopy.topicsHeading}
        </h2>
        {workspace.topics.length === 0 && !hasQuery ? (
          <div className="mt-5 max-w-prose">
            <p className="text-body font-medium text-foreground">
              {customerHelpCopy.emptyFaqsTitle}
            </p>
            <p className="mt-2 text-body text-muted-foreground">
              {customerHelpCopy.emptyFaqs}
            </p>
          </div>
        ) : null}
        {visibleFaqs.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {visibleFaqs.map((item) => (
              <li key={item.id}>
                <details className="group rounded-sm border border-border px-4 py-3">
                  <summary className="min-h-touch cursor-pointer list-outside py-2 text-body font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-caption text-muted-foreground">
                    <Link
                      className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      href={customerServicePath(item.slug)}
                    >
                      {item.serviceName}
                    </Link>
                  </p>
                  <p className="mt-3 text-body text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
      <section id="customer-help-contact">
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerHelpCopy.contactHeading}
        </h2>
        {hasPublishedContact ? (
          <dl className="mt-5 space-y-4">
            {contact.phone === null ? null : (
              <ContactRow
                href={`tel:${contact.phone}`}
                label={landingFooter.phoneLabel}
                value={contact.phone}
              />
            )}
            {contact.email === null ? null : (
              <ContactRow
                href={`mailto:${contact.email}`}
                label={landingFooter.emailLabel}
                value={contact.email}
              />
            )}
            {contact.hours === null ? null : (
              <ContactRow
                label={landingFooter.hoursLabel}
                value={contact.hours}
              />
            )}
            {contact.address === null ? null : (
              <ContactRow
                label={landingFooter.addressLabel}
                value={contact.address}
              />
            )}
          </dl>
        ) : null}
        <p className="mt-5 max-w-prose text-body text-muted-foreground">
          {customerHelpCopy.contactEmpty}
        </p>
      </section>
    </div>
  );
}

function TopicFilter({
  active,
  label,
  onSelect,
}: {
  active: boolean;
  label: string;
  onSelect: () => void;
}): ReactElement {
  return (
    <Button
      aria-pressed={active}
      onClick={onSelect}
      type="button"
      variant={active ? "default" : "outline"}
    >
      {label}
    </Button>
  );
}

function ContactRow({
  href,
  label,
  value,
}: {
  href?: string;
  label: string;
  value: string;
}): ReactElement {
  return (
    <div>
      <dt className="text-label font-medium text-foreground">{label}</dt>
      <dd className="mt-1 break-words text-body text-muted-foreground">
        {href === undefined ? (
          value
        ) : (
          <a
            className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={href}
          >
            {value}
          </a>
        )}
      </dd>
    </div>
  );
}

function flattenFaqs(topics: readonly CustomerHelpTopic[]): HelpFaqItem[] {
  return topics.flatMap((topic) =>
    topic.faqs.map((faq, index) => ({
      answer: faq.answer,
      id: `${topic.slug}-${index}`,
      question: faq.question,
      serviceName: topic.name,
      slug: topic.slug,
    })),
  );
}

function matchesNeedle(value: string, needle: string): boolean {
  if (needle === "") {
    return true;
  }

  return value.toLowerCase().includes(needle);
}
