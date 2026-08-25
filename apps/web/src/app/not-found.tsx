import { APP_NAME } from "@neatly/config";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound(): ReactElement {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-base">The page you requested does not exist.</p>
      <p className="mt-8">
        <Link
          className="inline-flex min-h-11 items-center text-base underline"
          href="/"
        >
          Back to {APP_NAME}
        </Link>
      </p>
    </main>
  );
}
