import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { CleanerBrandLink } from "@/components/cleaner/cleaner-brand-link";
import { CleanerMobileNav } from "@/components/cleaner/cleaner-mobile-nav";
import { CleanerNotificationsTrigger } from "@/components/cleaner/cleaner-notifications";
import { CleanerUserMenu } from "@/components/cleaner/cleaner-user-menu";
import {
  CLEANER_HEADER_HEIGHT_CLASS,
  cleanerShellCopy,
} from "@/config/cleaner";
import type { CleanerNavbarIdentity } from "@/lib/cleaner/identity";

interface CleanerHeaderProps {
  identity: CleanerNavbarIdentity;
  onLogout: () => void;
  pageTitle: string;
  pathname: string;
}

export function CleanerHeader({
  identity,
  onLogout,
  pageTitle,
  pathname,
}: CleanerHeaderProps): ReactElement {
  return (
    <header
      className="sticky top-0 z-sticky border-b border-border bg-background"
      data-slot="cleaner-header"
    >
      <div
        className={cn(
          "flex w-full min-w-0 items-center justify-between gap-3 px-gutter lg:pl-[calc(16rem+1.5rem)]",
          CLEANER_HEADER_HEIGHT_CLASS,
        )}
      >
        <div className="flex min-w-0 items-center gap-2 lg:hidden">
          <CleanerMobileNav
            identity={identity}
            onLogout={onLogout}
            pathname={pathname}
          />
          <div className="min-w-0">
            <CleanerBrandLink />
            <p className="truncate text-caption text-muted-foreground">
              {cleanerShellCopy.workspaceLabel}
            </p>
          </div>
        </div>
        <p className="hidden min-w-0 truncate text-h4 text-foreground lg:block">
          {pageTitle}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <CleanerNotificationsTrigger />
          <CleanerUserMenu identity={identity} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
