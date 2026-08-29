import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement } from "react";

export type CustomerNavLinkTone = "account" | "public" | "sidebar";

interface CustomerNavLinkProps {
  href: string;
  isActive: boolean;
  label: string;
  onNavigate?: () => void;
  tone?: CustomerNavLinkTone;
}

export function CustomerNavLink({
  href,
  isActive,
  label,
  onNavigate,
  tone = "account",
}: CustomerNavLinkProps): ReactElement {
  const isPublic = tone === "public";
  const isSidebar = tone === "sidebar";

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex min-h-touch items-center rounded-sm text-body-small font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "motion-safe:transition-colors motion-safe:duration-fast",
        isPublic
          ? "focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
          : "px-3 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isSidebar && "w-full justify-start",
        isPublic
          ? isActive
            ? "text-primary underline decoration-primary underline-offset-8"
            : "text-secondary-foreground/80 hover:text-secondary-foreground"
          : isActive
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground",
      )}
      href={href}
      onClick={onNavigate}
    >
      {label}
    </Link>
  );
}
