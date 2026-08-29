"use client";

import {
  Button,
  buttonVariants,
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
import { cn } from "@neatly/utils";
import Link from "next/link";
import { type ReactElement, useEffect, useState } from "react";
import { getLenis } from "@/animations/lenis/smooth-scroll";
import { CustomerMenuIcon } from "@/components/customer/customer-icons";
import { BrandLink } from "@/components/layout/navbar/brand-link";
import { AUTH_ADMIN_HOME_PATH } from "@/config/auth";
import {
  CUSTOMER_LOGIN_PATH,
  CUSTOMER_MOBILE_NAV_ID,
  customerNavbarCopy,
  customerShellCopy,
} from "@/config/customer";
import {
  customerAccountMenuItems,
  isCustomerNavItemActive,
} from "@/config/customer-nav";
import { navbarCta } from "@/config/landing";
import type {
  CustomerNavbarIdentity,
  CustomerNavbarPresentation,
} from "@/lib/customer/navbar";

interface CustomerMobileNavProps {
  identity: CustomerNavbarIdentity | null;
  onLogout: () => void;
  pathname: string;
  presentation: CustomerNavbarPresentation;
  showAccountLinks?: boolean;
  tone?: "account" | "public";
}

export function CustomerMobileNav({
  identity,
  onLogout,
  pathname,
  presentation,
  showAccountLinks = true,
  tone = "account",
}: CustomerMobileNavProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const isPublic = tone === "public";

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
            aria-controls={CUSTOMER_MOBILE_NAV_ID}
            aria-expanded={isOpen}
            aria-label={customerNavbarCopy.menuOpenLabel}
            className={cn(
              isPublic &&
                "text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground focus-visible:ring-offset-secondary",
            )}
            size="icon"
            type="button"
            variant="ghost"
          >
            <CustomerMenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent
          className={cn(
            "gap-6",
            isPublic && "bg-secondary text-secondary-foreground",
          )}
          closeLabel={customerNavbarCopy.menuCloseLabel}
          data-lenis-prevent=""
          id={CUSTOMER_MOBILE_NAV_ID}
          side="right"
        >
          <SheetHeader>
            <SheetTitle className="sr-only">
              {customerNavbarCopy.menuTitle}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {customerNavbarCopy.menuDescription}
            </SheetDescription>
            <SheetClose asChild>
              <BrandLink
                className={cn(
                  !isPublic &&
                    "text-foreground focus-visible:ring-offset-background",
                )}
              />
            </SheetClose>
          </SheetHeader>
          <nav aria-label={customerNavbarCopy.primaryNavigationLabel}>
            <ul className="flex flex-col gap-1">
              {presentation.primaryLinks.map((item) => {
                const isActive = isCustomerNavItemActive(pathname, item.href);

                return (
                  <li key={item.href}>
                    <SheetClose asChild>
                      <Link
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex min-h-touch items-center rounded-md px-3 text-body font-medium",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          "motion-safe:transition-colors motion-safe:duration-fast",
                          isPublic
                            ? isActive
                              ? "bg-secondary-foreground/10 text-primary"
                              : "text-secondary-foreground/90 hover:bg-secondary-foreground/10"
                            : isActive
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  </li>
                );
              })}
            </ul>
          </nav>
          {identity === null ? null : (
            <>
              <Separator
                className={isPublic ? "bg-secondary-foreground/15" : undefined}
              />
              <div className="px-3">
                <p className="truncate text-body-small font-medium">
                  {identity.name}
                </p>
                <p
                  className={cn(
                    "mt-1 truncate text-caption",
                    isPublic
                      ? "text-secondary-foreground/70"
                      : "text-muted-foreground",
                  )}
                >
                  {identity.email}
                </p>
              </div>
              {presentation.showAdmin ||
              (presentation.mode === "customer" && showAccountLinks) ? (
                <ul className="flex flex-col gap-1">
                  {presentation.showAdmin ? (
                    <li>
                      <SheetClose asChild>
                        <Link
                          className={mobileActionClassName(isPublic, false)}
                          href={AUTH_ADMIN_HOME_PATH}
                        >
                          {customerNavbarCopy.adminLabel}
                        </Link>
                      </SheetClose>
                    </li>
                  ) : null}
                  {presentation.mode === "customer" && showAccountLinks
                    ? customerAccountMenuItems.map((item) => (
                        <li key={item.href}>
                          <SheetClose asChild>
                            <Link
                              className={mobileActionClassName(
                                isPublic,
                                isCustomerNavItemActive(pathname, item.href),
                              )}
                              href={item.href}
                            >
                              {item.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))
                    : null}
                </ul>
              ) : null}
            </>
          )}
          <SheetFooter className="gap-3">
            {presentation.showLogin ? (
              <SheetClose asChild>
                <Link
                  className={cn(
                    buttonVariants({ size: "default", variant: "outline" }),
                    "w-full",
                    isPublic && "focus-visible:ring-offset-secondary",
                  )}
                  href={CUSTOMER_LOGIN_PATH}
                >
                  {customerNavbarCopy.loginLabel}
                </Link>
              </SheetClose>
            ) : null}
            {presentation.showQuote ? (
              <SheetClose asChild>
                <Link
                  className={cn(
                    buttonVariants({ size: "default" }),
                    "w-full uppercase",
                    isPublic && "focus-visible:ring-offset-secondary",
                  )}
                  href={navbarCta.href}
                >
                  {navbarCta.label}
                </Link>
              </SheetClose>
            ) : null}
            {identity === null ? null : (
              <Button
                className="w-full"
                onClick={(): void => {
                  handleOpenChange(false);
                  onLogout();
                }}
                type="button"
                variant="ghost"
              >
                {customerShellCopy.logoutLabel}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function mobileActionClassName(isPublic: boolean, isActive: boolean): string {
  return cn(
    "flex min-h-touch items-center rounded-md px-3 text-body font-medium",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    isPublic
      ? isActive
        ? "bg-secondary-foreground/10 text-primary"
        : "text-secondary-foreground/90 hover:bg-secondary-foreground/10"
      : isActive
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}
