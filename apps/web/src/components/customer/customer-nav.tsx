import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement } from "react";
import { CustomerBellIcon } from "@/components/customer/customer-icons";
import { CustomerNavLink } from "@/components/customer/customer-nav-link";
import { AUTH_ADMIN_HOME_PATH } from "@/config/auth";
import {
  CUSTOMER_LOGIN_PATH,
  CUSTOMER_PATHS,
  customerNavbarCopy,
} from "@/config/customer";
import { isCustomerNavItemActive } from "@/config/customer-nav";
import { navbarCta } from "@/config/landing";
import type { CustomerNavbarPresentation } from "@/lib/customer/navbar";

interface CustomerNavProps {
  pathname: string;
  presentation: CustomerNavbarPresentation;
  tone?: "account" | "public";
  unreadCount?: number | null;
}

export function CustomerNav({
  pathname,
  presentation,
  tone = "account",
  unreadCount = null,
}: CustomerNavProps): ReactElement {
  const links =
    tone === "account" ? presentation.primaryLinks : presentation.accountLinks;
  const isPublic = tone === "public";

  return (
    <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 lg:flex lg:gap-5">
      <nav aria-label={customerNavbarCopy.primaryNavigationLabel}>
        <ul className="flex items-center gap-1 xl:gap-2">
          {links.map((item) => (
            <li key={item.href}>
              <CustomerNavLink
                href={item.href}
                isActive={isCustomerNavItemActive(pathname, item.href)}
                label={item.label}
                tone={tone}
              />
            </li>
          ))}
        </ul>
      </nav>
      {presentation.showAdmin ? (
        <Link
          className={cn(
            "inline-flex min-h-touch items-center text-body-small font-medium",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isPublic
              ? "text-secondary-foreground/80 hover:text-secondary-foreground focus-visible:ring-offset-secondary"
              : "text-muted-foreground hover:text-foreground",
          )}
          href={AUTH_ADMIN_HOME_PATH}
        >
          {customerNavbarCopy.adminLabel}
        </Link>
      ) : null}
      {presentation.showNotifications ? (
        <Button
          asChild
          className={cn(
            isPublic &&
              "text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground focus-visible:ring-offset-secondary",
          )}
          size="icon"
          variant="ghost"
        >
          <Link
            aria-label={customerNavbarCopy.notificationsLabel}
            className="relative"
            href={CUSTOMER_PATHS.notifications}
          >
            <CustomerBellIcon />
            {unreadCount !== null && unreadCount > 0 ? (
              <span className="sr-only">{String(unreadCount)}</span>
            ) : null}
          </Link>
        </Button>
      ) : null}
      {presentation.showLogin ? (
        <Link
          className={cn(
            "inline-flex min-h-touch items-center text-body-small font-medium",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isPublic
              ? "text-secondary-foreground/80 hover:text-secondary-foreground focus-visible:ring-offset-secondary"
              : "text-muted-foreground hover:text-foreground",
          )}
          href={CUSTOMER_LOGIN_PATH}
        >
          {customerNavbarCopy.loginLabel}
        </Link>
      ) : null}
      {presentation.showQuote ? (
        <Button
          asChild
          className={cn(
            "uppercase",
            isPublic && "focus-visible:ring-offset-secondary",
          )}
          size="sm"
        >
          <Link href={navbarCta.href}>{navbarCta.label}</Link>
        </Button>
      ) : null}
    </div>
  );
}
