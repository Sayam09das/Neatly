"use client";

import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { CustomerMobileNav } from "@/components/customer/customer-mobile-nav";
import { CustomerNavLink } from "@/components/customer/customer-nav-link";
import { CustomerUserMenu } from "@/components/customer/customer-user-menu";
import { BrandLink } from "@/components/layout/navbar/brand-link";
import { useActivePathname } from "@/components/layout/navbar/use-active-pathname";
import {
  CUSTOMER_HEADER_HEIGHT_CLASS,
  customerNavbarCopy,
} from "@/config/customer";
import {
  customerAppNavigation,
  getCustomerPageTitle,
  isCustomerNavItemActive,
} from "@/config/customer-nav";
import {
  type CustomerNavbarIdentity,
  getCustomerNavbarPresentation,
} from "@/lib/customer/navbar";
import { signOutCustomer } from "@/lib/customer/session";

interface CustomerAppChromeProps {
  identity: CustomerNavbarIdentity;
}

export function CustomerAppChrome({
  identity,
}: CustomerAppChromeProps): ReactElement {
  const pathname = useActivePathname();
  const presentation = getCustomerNavbarPresentation(
    { identity, role: "customer" },
    "account",
  );
  const pageTitle = getCustomerPageTitle(pathname);
  const logout = (): void => {
    void signOutCustomer();
  };

  return (
    <>
      <header
        className="sticky top-0 z-sticky border-b border-border bg-background"
        data-slot="customer-app-header"
      >
        <div
          className={cn(
            "flex w-full min-w-0 items-center justify-between gap-4 px-gutter lg:pl-[calc(16rem+1.5rem)]",
            CUSTOMER_HEADER_HEIGHT_CLASS,
          )}
        >
          <div className="flex min-w-0 items-center gap-4 lg:hidden">
            <BrandLink className="text-foreground focus-visible:ring-offset-background" />
          </div>
          <p className="hidden min-w-0 truncate text-h4 text-foreground lg:block">
            {pageTitle}
          </p>
          <div className="flex items-center gap-2">
            <CustomerUserMenu
              identity={identity}
              onLogout={logout}
              showAccountLinks
              showAdmin={false}
            />
            <CustomerMobileNav
              identity={identity}
              onLogout={logout}
              pathname={pathname}
              presentation={presentation}
              showAccountLinks
            />
          </div>
        </div>
      </header>
      <aside
        className="fixed inset-y-0 left-0 z-sticky hidden w-64 border-r border-border bg-background lg:flex"
        data-slot="customer-app-sidebar"
      >
        <div className="flex h-full w-full flex-col px-4 py-5">
          <BrandLink className="text-foreground focus-visible:ring-offset-background" />
          <nav
            aria-label={customerNavbarCopy.primaryNavigationLabel}
            className="mt-8"
          >
            <ul className="flex flex-col gap-1">
              {customerAppNavigation.map((item) => (
                <li key={item.href}>
                  <CustomerNavLink
                    href={item.href}
                    isActive={isCustomerNavItemActive(pathname, item.href)}
                    label={item.label}
                    tone="sidebar"
                  />
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-auto truncate text-caption text-muted-foreground">
            {identity.name}
          </p>
        </div>
      </aside>
    </>
  );
}
