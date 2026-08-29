"use client";

import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { CustomerMobileNav } from "@/components/customer/customer-mobile-nav";
import { CustomerNav } from "@/components/customer/customer-nav";
import { CustomerUserMenu } from "@/components/customer/customer-user-menu";
import { BrandLink } from "@/components/layout/navbar/brand-link";
import { useActivePathname } from "@/components/layout/navbar/use-active-pathname";
import { CUSTOMER_HEADER_HEIGHT_CLASS } from "@/config/customer";
import {
  type CustomerNavbarIdentity,
  getCustomerNavbarPresentation,
} from "@/lib/customer/navbar";
import { signOutCustomer } from "@/lib/customer/session";

interface CustomerNavbarProps {
  identity: CustomerNavbarIdentity;
  unreadCount?: number | null;
}

export function CustomerNavbar({
  identity,
  unreadCount = null,
}: CustomerNavbarProps): ReactElement {
  const pathname = useActivePathname();
  const presentation = getCustomerNavbarPresentation(
    { identity, role: "customer" },
    "account",
  );

  return (
    <header
      className="sticky top-0 z-sticky border-b border-border bg-background"
      data-slot="customer-navbar"
    >
      <div
        className={cn(
          "mx-auto flex w-full min-w-0 max-w-page items-center justify-between gap-4 px-gutter",
          CUSTOMER_HEADER_HEIGHT_CLASS,
        )}
      >
        <BrandLink className="text-foreground focus-visible:ring-offset-background" />
        <CustomerNav
          pathname={pathname}
          presentation={presentation}
          unreadCount={unreadCount}
        />
        <div className="flex items-center gap-2">
          <CustomerUserMenu
            identity={identity}
            onLogout={(): void => {
              void signOutCustomer();
            }}
            showAccountLinks
            showAdmin={false}
          />
          <CustomerMobileNav
            identity={identity}
            onLogout={(): void => {
              void signOutCustomer();
            }}
            pathname={pathname}
            presentation={presentation}
          />
        </div>
      </div>
    </header>
  );
}
