import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement, SVGProps } from "react";
import { CustomerBellIcon } from "@/components/customer/customer-icons";
import { CustomerUserMenu } from "@/components/customer/customer-user-menu";
import { isNavItemActive } from "@/components/layout/navbar/is-nav-item-active";
import { AUTH_ADMIN_HOME_PATH } from "@/config/auth";
import {
  CUSTOMER_LOGIN_PATH,
  CUSTOMER_PATHS,
  customerNavbarCopy,
} from "@/config/customer";
import { isCustomerNavItemActive } from "@/config/customer-nav";
import {
  getPublishedPhone,
  landingNavLinks,
  navbarCta,
} from "@/config/landing";
import { signOutAdmin } from "@/lib/admin/session";
import type { CustomerNavbarSession } from "@/lib/customer/navbar";
import { getCustomerNavbarPresentation } from "@/lib/customer/navbar";
import { signOutCustomer } from "@/lib/customer/session";

interface DesktopNavProps {
  pathname: string;
  session?: CustomerNavbarSession | null;
}

export function DesktopNav({
  pathname,
  session = null,
}: DesktopNavProps): ReactElement {
  const phone = getPublishedPhone();
  const presentation = getCustomerNavbarPresentation(session, "public");

  return (
    <>
      <nav
        aria-label="Primary"
        className="hidden flex-1 justify-center lg:flex"
      >
        <ul className="flex items-center justify-center gap-6">
          {landingNavLinks.map((item) => {
            const isActive = isNavItemActive(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-touch items-center text-body-small font-medium transition-colors duration-normal ease-standard",
                    "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
                    isActive
                      ? "text-primary underline decoration-primary underline-offset-8"
                      : "text-secondary-foreground/80 hover:text-secondary-foreground",
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="hidden shrink-0 items-center gap-4 lg:flex">
        {phone === null ? null : (
          <a
            className="inline-flex min-h-touch items-center gap-2 rounded-sm text-body-small text-secondary-foreground/80 transition-colors duration-normal ease-standard hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            href={`tel:${phone}`}
          >
            <PhoneIcon />
            <span>{phone}</span>
          </a>
        )}
        {presentation.showLogin ? (
          <Link
            className="inline-flex min-h-touch items-center rounded-sm text-body-small font-medium text-secondary-foreground/80 transition-colors duration-normal ease-standard hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            href={CUSTOMER_LOGIN_PATH}
          >
            {customerNavbarCopy.loginLabel}
          </Link>
        ) : null}
        {presentation.showAdmin ? (
          <Link
            className="inline-flex min-h-touch items-center rounded-sm text-body-small font-medium text-secondary-foreground/80 transition-colors duration-normal ease-standard hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            href={AUTH_ADMIN_HOME_PATH}
          >
            {customerNavbarCopy.adminLabel}
          </Link>
        ) : null}
        {presentation.accountLinks.map((item) => (
          <Link
            className={cn(
              "hidden min-h-touch items-center rounded-sm text-body-small font-medium transition-colors duration-normal ease-standard xl:inline-flex",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
              isCustomerNavItemActive(pathname, item.href)
                ? "text-primary underline decoration-primary underline-offset-8"
                : "text-secondary-foreground/80 hover:text-secondary-foreground",
            )}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
        {presentation.showNotifications ? (
          <Button
            asChild
            className="text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground focus-visible:ring-offset-secondary"
            size="icon"
            variant="ghost"
          >
            <Link
              aria-label={customerNavbarCopy.notificationsLabel}
              href={CUSTOMER_PATHS.notifications}
            >
              <CustomerBellIcon />
            </Link>
          </Button>
        ) : null}
        {presentation.showQuote ? (
          <Button
            asChild
            className="uppercase focus-visible:ring-offset-secondary"
            size="sm"
          >
            <Link href={navbarCta.href}>
              {navbarCta.label}
              <ArrowUpRightIcon />
            </Link>
          </Button>
        ) : null}
        {session !== null && presentation.showUserMenu ? (
          <CustomerUserMenu
            identity={session.identity}
            onLogout={(): void => {
              if (presentation.mode === "admin") {
                void signOutAdmin();
                return;
              }

              void signOutCustomer();
            }}
            showAccountLinks={presentation.mode === "customer"}
            showAdmin={false}
            tone="public"
          />
        ) : null}
      </div>
    </>
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
