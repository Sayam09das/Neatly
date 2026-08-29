"use client";

import {
  Button,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@neatly/ui";
import { type ReactElement, useEffect, useState } from "react";
import { getLenis } from "@/animations/lenis/smooth-scroll";
import { CleanerBrandLink } from "@/components/cleaner/cleaner-brand-link";
import { CleanerMenuIcon } from "@/components/cleaner/cleaner-icons";
import { CleanerNavLink } from "@/components/cleaner/cleaner-nav-link";
import {
  CLEANER_MOBILE_NAV_ID,
  cleanerNavbarCopy,
  cleanerShellCopy,
} from "@/config/cleaner";
import {
  getVisibleCleanerNavGroups,
  isCleanerNavItemActive,
} from "@/config/cleaner-nav";
import type { CleanerNavbarIdentity } from "@/lib/cleaner/identity";

interface CleanerMobileNavProps {
  identity: CleanerNavbarIdentity;
  onLogout: () => void;
  pathname: string;
}

export function CleanerMobileNav({
  identity,
  onLogout,
  pathname,
}: CleanerMobileNavProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const groups = getVisibleCleanerNavGroups();

  useEffect((): (() => void) => {
    return (): void => {
      getLenis()?.start();
    };
  }, []);

  function handleOpenChange(nextOpen: boolean): void {
    setIsOpen(nextOpen);
    const lenis = getLenis();

    if (nextOpen) {
      lenis?.stop();
      return;
    }

    lenis?.start();
  }

  return (
    <div className="lg:hidden">
      <Sheet onOpenChange={handleOpenChange} open={isOpen}>
        <SheetTrigger asChild>
          <Button
            aria-controls={CLEANER_MOBILE_NAV_ID}
            aria-expanded={isOpen}
            aria-label={cleanerNavbarCopy.menuOpenLabel}
            data-slot="cleaner-menu-trigger"
            size="icon"
            type="button"
            variant="ghost"
          >
            <CleanerMenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="gap-6"
          closeLabel={cleanerNavbarCopy.menuCloseLabel}
          data-lenis-prevent=""
          id={CLEANER_MOBILE_NAV_ID}
          side="left"
        >
          <SheetHeader>
            <SheetTitle className="sr-only">
              {cleanerNavbarCopy.menuTitle}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {cleanerNavbarCopy.menuDescription}
            </SheetDescription>
            <SheetClose asChild>
              <CleanerBrandLink />
            </SheetClose>
            <p className="text-caption text-muted-foreground">
              {cleanerShellCopy.workspaceLabel}
            </p>
          </SheetHeader>
          <nav aria-label={cleanerNavbarCopy.primaryNavigationLabel}>
            {groups.map((group) => (
              <div className="mt-4 first:mt-0" key={group.id}>
                <p className="px-3 text-caption font-medium text-muted-foreground uppercase tracking-wide">
                  {group.label}
                </p>
                <ul className="mt-2 flex flex-col gap-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <CleanerNavLink
                          href={item.href}
                          isActive={isCleanerNavItemActive(pathname, item.href)}
                          label={item.label}
                        />
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <Separator />
          <div className="px-3">
            <p className="truncate text-body-small font-medium">
              {identity.name}
            </p>
            <p className="mt-1 truncate text-caption text-muted-foreground">
              {cleanerNavbarCopy.roleLabel}
            </p>
          </div>
          <SheetFooter>
            <Button
              className="w-full"
              onClick={(): void => {
                handleOpenChange(false);
                onLogout();
              }}
              type="button"
              variant="ghost"
            >
              {cleanerShellCopy.logoutLabel}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
