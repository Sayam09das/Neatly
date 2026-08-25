"use client";

import type { ReactElement } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps): ReactElement {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-4 text-base">
        An unexpected error occurred. You can try again.
      </p>
      <button
        className="mt-8 inline-flex min-h-11 min-w-11 items-center text-base underline"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </main>
  );
}
