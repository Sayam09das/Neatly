import { APP_NAME } from "@neatly/config";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound(): ReactElement {
  return (
    <main className="mx-auto max-w-content px-gutter py-section">
      <h1 className="text-h1 text-foreground tracking-tight">Page not found</h1>
      <p className="mt-4 text-body text-muted-foreground">
        The page you requested does not exist.
      </p>
      <p className="mt-8">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline"
          href="/"
        >
          Back to {APP_NAME}
        </Link>
      </p>
    </main>
  );
}
