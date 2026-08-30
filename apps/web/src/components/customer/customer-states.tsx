"use client";

import { Button, Skeleton } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import {
  CUSTOMER_HOME_PATH,
  CUSTOMER_LOGIN_PATH,
  customerEmptyCopy,
  customerErrorCopy,
  customerForbiddenCopy,
  customerNotFoundCopy,
  customerShellCopy,
  customerUnauthorizedCopy,
} from "@/config/customer";
import type {
  CustomerLoadingVariant,
  CustomerPagePresentation,
} from "@/types/customer";

interface CustomerLoadingStateProps {
  variant?: CustomerLoadingVariant;
}

export function CustomerLoadingState({
  variant = "page",
}: CustomerLoadingStateProps): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="w-full min-w-0 space-y-6"
      data-slot="customer-loading"
      role="status"
    >
      <p className="sr-only">{customerShellCopy.loadingLabel}</p>
      {variant === "page" ? <PageLoadingSkeleton /> : null}
      {variant === "section" ? <SectionLoadingSkeleton /> : null}
      {variant === "list" ? <ListLoadingSkeleton /> : null}
      {variant === "detail" ? <DetailLoadingSkeleton /> : null}
    </div>
  );
}

function PageLoadingSkeleton(): ReactElement {
  return (
    <>
      <div className="max-w-prose space-y-3">
        <Skeleton className="h-10 w-64 max-w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 max-w-full" />
      </div>
      <Skeleton className="h-48 w-full max-w-2xl" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="max-w-2xl space-y-3">
        <Skeleton className="h-6 w-40 max-w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </>
  );
}

function SectionLoadingSkeleton(): ReactElement {
  return (
    <div className="max-w-prose space-y-3">
      <Skeleton className="h-6 w-40 max-w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4 max-w-full" />
    </div>
  );
}

function ListLoadingSkeleton(): ReactElement {
  return (
    <div className="space-y-3">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-2/3 max-w-full" />
    </div>
  );
}

function DetailLoadingSkeleton(): ReactElement {
  return (
    <div className="max-w-prose space-y-4">
      <Skeleton className="h-8 w-56 max-w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2 max-w-full" />
    </div>
  );
}

interface CustomerEmptyStateProps {
  description: string;
  title: string;
}

export function CustomerEmptyState({
  description,
  title,
}: CustomerEmptyStateProps): ReactElement {
  return (
    <div className="max-w-prose" data-slot="customer-empty">
      <h2 className="text-h3 text-foreground tracking-tight">{title}</h2>
      <p className="mt-2 text-body text-muted-foreground">{description}</p>
    </div>
  );
}

export function CustomerBookingsEmptyState(): ReactElement {
  return (
    <CustomerEmptyState
      description={customerEmptyCopy.bookings.description}
      title={customerEmptyCopy.bookings.title}
    />
  );
}

export function CustomerNotificationsEmptyState(): ReactElement {
  return (
    <CustomerEmptyState
      description={customerEmptyCopy.notifications.description}
      title={customerEmptyCopy.notifications.title}
    />
  );
}

export function CustomerQuotesEmptyState(): ReactElement {
  return (
    <CustomerEmptyState
      description={customerEmptyCopy.quotes.description}
      title={customerEmptyCopy.quotes.title}
    />
  );
}

export function CustomerReviewsEmptyState(): ReactElement {
  return (
    <CustomerEmptyState
      description={customerEmptyCopy.reviews.description}
      title={customerEmptyCopy.reviews.title}
    />
  );
}

interface CustomerErrorStateProps {
  onRetry?: () => void;
}

export function CustomerErrorState({
  onRetry,
}: CustomerErrorStateProps): ReactElement {
  return (
    <div className="max-w-prose" data-slot="customer-error" role="alert">
      <h1 className="text-h1 text-foreground tracking-tight">
        {customerErrorCopy.heading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        {customerErrorCopy.description}
      </p>
      {onRetry === undefined ? null : (
        <Button className="mt-8" onClick={onRetry} type="button" variant="link">
          {customerErrorCopy.action}
        </Button>
      )}
    </div>
  );
}

export function CustomerUnauthorizedState(): ReactElement {
  return (
    <div className="max-w-prose" data-slot="customer-unauthorized">
      <h1 className="text-h1 text-foreground tracking-tight">
        {customerUnauthorizedCopy.heading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        {customerUnauthorizedCopy.description}
      </p>
      <p className="mt-8">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          href={CUSTOMER_LOGIN_PATH}
        >
          {customerUnauthorizedCopy.action}
        </Link>
      </p>
    </div>
  );
}

export function CustomerForbiddenState(): ReactElement {
  return (
    <div className="max-w-prose" data-slot="customer-forbidden">
      <h1 className="text-h1 text-foreground tracking-tight">
        {customerForbiddenCopy.heading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        {customerForbiddenCopy.description}
      </p>
      <p className="mt-8">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          href={CUSTOMER_HOME_PATH}
        >
          {customerForbiddenCopy.action}
        </Link>
      </p>
    </div>
  );
}

export function CustomerResourceUnavailableState(): ReactElement {
  return (
    <div className="max-w-prose" data-slot="customer-not-found">
      <h1 className="text-h1 text-foreground tracking-tight">
        {customerNotFoundCopy.heading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        {customerNotFoundCopy.description}
      </p>
      <p className="mt-8">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          href={CUSTOMER_HOME_PATH}
        >
          {customerNotFoundCopy.action}
        </Link>
      </p>
    </div>
  );
}

interface CustomerPageStateProps<T> {
  presentation: CustomerPagePresentation<T>;
  children: (data: T) => ReactElement;
}

export function CustomerPageState<T>({
  children,
  presentation,
}: CustomerPageStateProps<T>): ReactElement {
  if (presentation.status === "loading") {
    return <CustomerLoadingState variant={presentation.variant} />;
  }

  if (presentation.status === "empty") {
    return (
      <CustomerEmptyState
        description={presentation.description}
        title={presentation.title}
      />
    );
  }

  if (presentation.status === "error") {
    return <CustomerErrorState onRetry={presentation.onRetry} />;
  }

  if (presentation.status === "unauthorized") {
    return <CustomerUnauthorizedState />;
  }

  if (presentation.status === "not-found") {
    return <CustomerResourceUnavailableState />;
  }

  return children(presentation.data);
}
