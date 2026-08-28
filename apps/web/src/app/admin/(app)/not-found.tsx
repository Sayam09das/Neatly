import Link from "next/link";
import type { ReactElement } from "react";
import { ADMIN_HOME_PATH, adminNotFoundCopy } from "@/config/admin-ui";

export default function AdminNotFound(): ReactElement {
  return (
    <section className="max-w-prose">
      <h1 className="text-h1 text-foreground tracking-tight">
        {adminNotFoundCopy.heading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        {adminNotFoundCopy.description}
      </p>
      <p className="mt-8">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline"
          href={ADMIN_HOME_PATH}
        >
          {adminNotFoundCopy.action}
        </Link>
      </p>
    </section>
  );
}
