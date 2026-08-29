import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";

interface FooterLinkProps {
  children: ReactNode;
  href: string;
}

const linkClassName = cn(
  "inline-flex min-h-touch items-center text-body-small text-secondary-foreground/80",
  "motion-safe:transition-[color,transform] motion-safe:duration-normal motion-safe:ease-standard",
  "hover:text-accent motion-safe:hover:translate-x-1",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
);

export function FooterLink({ children, href }: FooterLinkProps): ReactElement {
  const isResourceLink = href.startsWith("mailto:") || href.startsWith("tel:");
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  if (isResourceLink) {
    return (
      <a className={linkClassName} href={href}>
        {children}
      </a>
    );
  }

  if (isExternal) {
    return (
      <a
        className={linkClassName}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={linkClassName} href={href}>
      {children}
    </Link>
  );
}
