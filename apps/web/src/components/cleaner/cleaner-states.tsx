"use client";

import { Button, Skeleton } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import {
  CLEANER_HOME_PATH,
  cleanerErrorCopy,
  cleanerNotFoundCopy,
  cleanerShellCopy,
} from "@/config/cleaner";
import type { CleanerLoadingVariant } from "@/types/cleaner";

interface CleanerLoadingStateProps {
  variant?: CleanerLoadingVariant;
}

export function CleanerLoadingState({
  variant = "page",
}: CleanerLoadingStateProps): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="w-full min-w-0 space-y-6"
      data-slot="cleaner-loading"
      role="status"
    >
      <p className="sr-only">{cleanerShellCopy.loadingLabel}</p>
      {variant === "page" ? <PageLoadingSkeleton /> : null}
      {variant === "section" ? <SectionLoadingSkeleton /> : null}
      {variant === "list" ? <ListLoadingSkeleton /> : null}
      {variant === "detail" ? <DetailLoadingSkeleton /> : null}
    </div>
  );
}

function PageLoadingSkeleton(): ReactElement {
  return (
    <div className="max-w-prose space-y-3">
      <Skeleton className="h-10 w-64 max-w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3 max-w-full" />
    </div>
  );
}

function SectionLoadingSkeleton(): ReactElement {
  return (
    <div className="max-w-prose space-y-3">
      <Skeleton className="h-6 w-40 max-w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

function ListLoadingSkeleton(): ReactElement {
  return (
    <div className="space-y-3">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

function DetailLoadingSkeleton(): ReactElement {
  return (
    <div className="max-w-prose space-y-4">
      <Skeleton className="h-8 w-56 max-w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2 max-w-full" />
    </div>
  );
}

interface CleanerErrorStateProps {
  onRetry?: () => void;
}

export function CleanerErrorState({
  onRetry,
}: CleanerErrorStateProps): ReactElement {
  return (
    <div className="max-w-prose" data-slot="cleaner-error" role="alert">
      <h1 className="text-h1 text-foreground tracking-tight">
        {cleanerErrorCopy.heading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        {cleanerErrorCopy.description}
      </p>
      {onRetry === undefined ? null : (
        <Button className="mt-8" onClick={onRetry} type="button" variant="link">
          {cleanerErrorCopy.action}
        </Button>
      )}
    </div>
  );
}

export function CleanerResourceUnavailableState(): ReactElement {
  return (
    <div className="max-w-prose" data-slot="cleaner-not-found">
      <h1 className="text-h1 text-foreground tracking-tight">
        {cleanerNotFoundCopy.heading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        {cleanerNotFoundCopy.description}
      </p>
      <p className="mt-8">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={CLEANER_HOME_PATH}
        >
          {cleanerNotFoundCopy.action}
        </Link>
      </p>
    </div>
  );
}
