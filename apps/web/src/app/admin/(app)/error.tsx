"use client";

import { Button } from "@neatly/ui";
import type { ReactElement } from "react";

interface AdminErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminErrorPage({
  reset,
}: AdminErrorPageProps): ReactElement {
  return (
    <main className="mx-auto max-w-content px-gutter py-section">
      <h1 className="text-h1 text-foreground tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        An unexpected error occurred. You can try again.
      </p>
      <Button className="mt-8" onClick={reset} variant="link">
        Try again
      </Button>
    </main>
  );
}
