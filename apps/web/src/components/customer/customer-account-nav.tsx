"use client";

import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { CUSTOMER_PATHS, customerShellCopy } from "@/config/customer";
import {
  customerNavigation,
  isCustomerNavItemActive,
} from "@/config/customer-nav";
import { signOutCustomer } from "@/lib/customer/session";

export function CustomerAccountNav(): ReactElement {
  const pathname = usePathname() ?? CUSTOMER_PATHS.dashboard;

  return (
    <nav
      aria-label={customerShellCopy.navigationLabel}
      className="flex flex-wrap gap-x-1 gap-y-1"
    >
      {customerNavigation.map((item) => {
        const isActive = isCustomerNavItemActive(pathname, item.href);

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex min-h-touch items-center rounded-md px-3 text-body-small text-muted-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              "motion-safe:transition-colors motion-safe:duration-fast",
              isActive
                ? "bg-muted font-medium text-foreground"
                : "hover:text-foreground",
            )}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function CustomerSignOutButton(): ReactElement {
  return (
    <Button
      className="min-h-touch"
      onClick={() => {
        void signOutCustomer();
      }}
      type="button"
      variant="ghost"
    >
      {customerShellCopy.logoutLabel}
    </Button>
  );
}
