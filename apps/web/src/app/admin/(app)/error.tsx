"use client";

import { Button } from "@neatly/ui";
import type { ReactElement } from "react";
import { adminErrorCopy } from "@/config/admin-ui";

interface AdminErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminErrorPage({
  reset,
}: AdminErrorPageProps): ReactElement {
  return (
    <section className="max-w-prose">
      <h1 className="text-h1 text-foreground tracking-tight">
        {adminErrorCopy.heading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        {adminErrorCopy.description}
      </p>
      <Button className="mt-8" onClick={reset} variant="link">
        {adminErrorCopy.action}
      </Button>
    </section>
  );
}
