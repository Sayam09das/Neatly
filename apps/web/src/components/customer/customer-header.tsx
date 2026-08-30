import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement } from "react";
import { CustomerBrandLink } from "@/components/customer/customer-brand-link";
import { CustomerBellIcon } from "@/components/customer/customer-icons";
import { CustomerMobileNav } from "@/components/customer/customer-mobile-nav";
import { useOptionalCustomerRealtime } from "@/components/customer/customer-realtime-provider";
import { CustomerUserMenu } from "@/components/customer/customer-user-menu";
import {
  CUSTOMER_HEADER_HEIGHT_CLASS,
  CUSTOMER_PATHS,
  customerNavbarCopy,
  customerShellCopy,
} from "@/config/customer";
import type { CustomerNavbarIdentity } from "@/lib/customer/navbar";
import { getCustomerNavbarPresentation } from "@/lib/customer/navbar";

interface CustomerHeaderProps {
  identity: CustomerNavbarIdentity;
  onLogout: () => void;
  pageTitle: string;
  pathname: string;
}

export function CustomerHeader({
  identity,
  onLogout,
  pageTitle,
  pathname,
}: CustomerHeaderProps): ReactElement {
  const presentation = getCustomerNavbarPresentation(
    { identity, role: "customer" },
    "account",
  );
  const unreadCount = useOptionalCustomerRealtime()?.unreadCount ?? 0;

  return (
    <header
      className="sticky top-0 z-sticky border-b border-border bg-background"
      data-slot="customer-app-header"
    >
      <div
        className={cn(
          "flex w-full min-w-0 items-center justify-between gap-3 px-gutter",
          CUSTOMER_HEADER_HEIGHT_CLASS,
        )}
      >
        <div className="flex min-w-0 items-center gap-2 lg:hidden">
          <CustomerMobileNav
            identity={identity}
            onLogout={onLogout}
            pathname={pathname}
            presentation={presentation}
            showAccountLinks={false}
          />
          <div className="min-w-0">
            <CustomerBrandLink />
            <p className="truncate text-caption text-muted-foreground">
              {customerShellCopy.workspaceLabel}
            </p>
          </div>
        </div>
        <p className="hidden min-w-0 truncate text-h4 text-foreground lg:block">
          {pageTitle}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {presentation.showNotifications ? (
            <Button asChild size="icon" variant="ghost">
              <Link
                aria-label={customerNavbarCopy.notificationsLabel}
                className="relative"
                href={CUSTOMER_PATHS.notifications}
              >
                <CustomerBellIcon />
                {unreadCount > 0 ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary"
                    />
                    <span className="sr-only">{String(unreadCount)}</span>
                  </>
                ) : null}
              </Link>
            </Button>
          ) : null}
          <CustomerUserMenu
            identity={identity}
            onLogout={onLogout}
            showAccountLinks
            showAdmin={false}
          />
        </div>
      </div>
    </header>
  );
}
