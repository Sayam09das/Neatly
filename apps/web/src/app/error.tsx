"use client";

import type { ReactElement } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps): ReactElement {
  return (
    <main className="mx-auto max-w-content px-gutter py-section">
      <h1 className="text-h1 text-foreground tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        An unexpected error occurred. You can try again.
      </p>
      <button
        className="mt-8 inline-flex min-h-touch min-w-touch items-center text-button text-primary underline"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </main>
  );
}
