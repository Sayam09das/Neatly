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
import { type ReactElement, type SVGProps, useEffect, useState } from "react";
import { getLenis } from "@/animations/lenis/smooth-scroll";
import { BrandLink } from "@/components/layout/navbar/brand-link";
import { isNavItemActive } from "@/components/layout/navbar/is-nav-item-active";
import { AUTH_ADMIN_HOME_PATH } from "@/config/auth";
import {
  CUSTOMER_LOGIN_PATH,
  customerNavbarCopy,
  customerShellCopy,
} from "@/config/customer";
import {
  customerAccountMenuItems,
  isCustomerNavItemActive,
} from "@/config/customer-nav";
import {
  getPublishedPhone,
  landingFooter,
  landingNavLinks,
  navbarCta,
} from "@/config/landing";
import { signOutAdmin } from "@/lib/admin/session";
import type { CustomerNavbarSession } from "@/lib/customer/navbar";
import { getCustomerNavbarPresentation } from "@/lib/customer/navbar";
import { signOutCustomer } from "@/lib/customer/session";

const PUBLIC_MOBILE_NAV_ID = "primary-mobile-navigation";

interface MobileNavProps {
  pathname: string;
  session?: CustomerNavbarSession | null;
}

export function MobileNav({
  pathname,
  session = null,
}: MobileNavProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const phone = getPublishedPhone();
  const presentation = getCustomerNavbarPresentation(session, "public");

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
    <div className="ml-auto lg:hidden">
      <Sheet onOpenChange={handleOpenChange} open={isOpen}>
        <SheetTrigger
          aria-controls={PUBLIC_MOBILE_NAV_ID}
          aria-expanded={isOpen}
          aria-label="Open menu"
          className={cn(
            buttonVariants({ size: "icon", variant: "ghost" }),
            "text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground focus-visible:ring-offset-secondary",
          )}
        >
          <MenuIcon />
        </SheetTrigger>
        <SheetContent
          className="gap-8 bg-secondary text-secondary-foreground"
          closeLabel="Close menu"
          data-lenis-prevent
          id={PUBLIC_MOBILE_NAV_ID}
          side="right"
        >
          <SheetHeader>
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Primary site navigation
            </SheetDescription>
            <SheetClose asChild>
              <BrandLink />
            </SheetClose>
          </SheetHeader>
          <nav aria-label="Primary">
            <ul className="flex flex-col gap-1">
              {landingNavLinks.map((item) => {
                const isActive = isNavItemActive(pathname, item.href);

                return (
                  <li key={item.href}>
                    <SheetClose asChild>
                      <Link
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex min-h-touch items-center rounded-md px-3 text-body font-medium transition-colors duration-normal ease-standard",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
                          isActive
                            ? "bg-secondary-foreground/10 text-primary"
                            : "text-secondary-foreground/90 hover:bg-secondary-foreground/10 hover:text-secondary-foreground",
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
          <Separator className="bg-secondary-foreground/15" />
          <div className="flex flex-col gap-3">
            <p className="text-label text-secondary-foreground/70">Call</p>
            {phone === null ? (
              <p className="text-body-small text-secondary-foreground/80">
                {landingFooter.placeholderContact.phone}
              </p>
            ) : (
              <SheetClose asChild>
                <a
                  className="inline-flex min-h-touch items-center gap-2 rounded-sm text-body text-secondary-foreground transition-colors duration-normal ease-standard hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
                  href={`tel:${phone}`}
                >
                  <PhoneIcon />
                  {phone}
                </a>
              </SheetClose>
            )}
          </div>
          {session !== null ? (
            <>
              <Separator className="bg-secondary-foreground/15" />
              <div className="px-3">
                <p className="truncate text-body font-medium">
                  {session.identity.name}
                </p>
                <p className="mt-1 truncate text-body-small text-secondary-foreground/70">
                  {session.identity.email}
                </p>
              </div>
              {presentation.mode === "customer" ? (
                <ul className="flex flex-col gap-1">
                  {presentation.accountLinks.map((item) => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <Link
                          className={cn(
                            "flex min-h-touch items-center rounded-md px-3 text-body font-medium",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
                            isCustomerNavItemActive(pathname, item.href)
                              ? "bg-secondary-foreground/10 text-primary"
                              : "text-secondary-foreground/90 hover:bg-secondary-foreground/10",
                          )}
                          href={item.href}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                  {customerAccountMenuItems.map((item) => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <Link
                          className="flex min-h-touch items-center rounded-md px-3 text-body font-medium text-secondary-foreground/90 hover:bg-secondary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
                          href={item.href}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              ) : null}
              {presentation.showAdmin ? (
                <SheetClose asChild>
                  <Link
                    className="flex min-h-touch items-center rounded-md px-3 text-body font-medium text-secondary-foreground/90 hover:bg-secondary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
                    href={AUTH_ADMIN_HOME_PATH}
                  >
                    {customerNavbarCopy.adminLabel}
                  </Link>
                </SheetClose>
              ) : null}
            </>
          ) : null}
          <SheetFooter>
            {presentation.showLogin ? (
              <SheetClose asChild>
                <Link
                  className={cn(
                    buttonVariants({ size: "default", variant: "outline" }),
                    "w-full focus-visible:ring-offset-secondary",
                  )}
                  href={CUSTOMER_LOGIN_PATH}
                >
                  {customerNavbarCopy.loginLabel}
                </Link>
              </SheetClose>
            ) : null}
            <SheetClose asChild>
              <Link
                className={cn(
                  buttonVariants({ size: "default" }),
                  "w-full uppercase focus-visible:ring-offset-secondary",
                )}
                href={navbarCta.href}
              >
                {navbarCta.label}
                <ArrowUpRightIcon />
              </Link>
            </SheetClose>
            {session === null ? null : (
              <Button
                className="w-full text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground focus-visible:ring-offset-secondary"
                onClick={(): void => {
                  handleOpenChange(false);
                  if (presentation.mode === "admin") {
                    void signOutAdmin();
                    return;
                  }
                  void signOutCustomer();
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

function MenuIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.2 2.5h2.1l.9 2.3-1.3 1.3a9 9 0 0 0 4 4l1.3-1.3 2.3.9v2.1c0 .6-.5 1.1-1.1 1.1C6.4 13 3 9.6 3 5.6c0-.6.5-1.1 1.1-1.1Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      viewBox="0 0 16 16"
      width="14"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
