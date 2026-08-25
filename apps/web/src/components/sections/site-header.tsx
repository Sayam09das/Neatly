import { APP_NAME } from "@neatly/config";
import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { landingCtas, landingNavLinks } from "@/config/landing";

export function SiteHeader(): ReactElement {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-gutter py-4 md:flex-row md:items-center md:justify-between">
        <Link className="text-h4 text-foreground" href="/">
          {APP_NAME}
        </Link>
        <nav aria-label="Primary">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {landingNavLinks.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex min-h-touch items-center text-body-small text-foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Button asChild>
          <Link href={landingCtas.primary.href}>
            {landingCtas.primary.label}
          </Link>
        </Button>
      </div>
    </header>
  );
}
