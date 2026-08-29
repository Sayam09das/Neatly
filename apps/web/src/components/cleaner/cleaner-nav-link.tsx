import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement } from "react";

interface CleanerNavLinkProps {
  href: string;
  isActive: boolean;
  label: string;
  onNavigate?: () => void;
}

export function CleanerNavLink({
  href,
  isActive,
  label,
  onNavigate,
}: CleanerNavLinkProps): ReactElement {
  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex min-h-touch w-full items-center justify-start rounded-sm px-3 text-body-small font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "motion-safe:transition-colors motion-safe:duration-fast",
        isActive
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
