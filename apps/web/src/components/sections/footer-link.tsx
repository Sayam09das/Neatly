import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";

interface FooterLinkProps {
  children: ReactNode;
  href: string;
}

const linkClassName = cn(
  "inline-flex min-h-touch items-center text-body-small text-secondary-foreground/80",
  "transition-[color,transform] duration-normal ease-standard",
  "hover:translate-x-1 hover:text-accent",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
);

export function FooterLink({ children, href }: FooterLinkProps): ReactElement {
  const isResourceLink = href.startsWith("mailto:") || href.startsWith("tel:");

  if (isResourceLink) {
    return (
      <a className={linkClassName} href={href}>
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
