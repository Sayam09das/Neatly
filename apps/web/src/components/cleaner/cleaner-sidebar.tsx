import type { ReactElement } from "react";
import { CleanerBrandLink } from "@/components/cleaner/cleaner-brand-link";
import { CleanerNavLink } from "@/components/cleaner/cleaner-nav-link";
import { cleanerNavbarCopy, cleanerShellCopy } from "@/config/cleaner";
import {
  getVisibleCleanerNavGroups,
  isCleanerNavItemActive,
} from "@/config/cleaner-nav";
import type { CleanerNavbarIdentity } from "@/lib/cleaner/identity";

interface CleanerSidebarProps {
  identity: CleanerNavbarIdentity;
  pathname: string;
}

export function CleanerSidebar({
  identity,
  pathname,
}: CleanerSidebarProps): ReactElement {
  const groups = getVisibleCleanerNavGroups();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-sticky hidden w-64 border-r border-border bg-background lg:flex"
      data-slot="cleaner-sidebar"
    >
      <div className="flex h-full w-full flex-col px-4 py-5">
        <CleanerBrandLink />
        <p className="mt-1 text-caption text-muted-foreground">
          {cleanerShellCopy.workspaceLabel}
        </p>
        <nav
          aria-label={cleanerNavbarCopy.primaryNavigationLabel}
          className="mt-8 min-h-0 flex-1 overflow-y-auto"
        >
          {groups.map((group) => (
            <div className="mt-6 first:mt-0" key={group.id}>
              <p className="px-3 text-caption font-medium text-muted-foreground uppercase tracking-wide">
                {group.label}
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <CleanerNavLink
                      href={item.href}
                      isActive={isCleanerNavItemActive(pathname, item.href)}
                      label={item.label}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-auto min-w-0 pt-4">
          <p className="truncate text-body-small font-medium text-foreground">
            {identity.name}
          </p>
          <p className="truncate text-caption text-muted-foreground">
            {cleanerNavbarCopy.roleLabel}
          </p>
        </div>
      </div>
    </aside>
  );
}
