import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import {
  CustomerAccountNav,
  CustomerSignOutButton,
} from "@/components/customer/customer-account-nav";
import {
  CUSTOMER_HOME_PATH,
  CUSTOMER_MAIN_CONTENT_ID,
  customerShellCopy,
} from "@/config/customer";

interface CustomerShellProps {
  children: ReactNode;
}

export function CustomerShell({ children }: CustomerShellProps): ReactElement {
  return (
    <div
      className="flex min-h-dvh flex-col bg-background"
      data-slot="customer-shell"
    >
      <a
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-gutter focus-visible:z-tooltip focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-foreground"
        href={`#${CUSTOMER_MAIN_CONTENT_ID}`}
      >
        {customerShellCopy.skipToContent}
      </a>
      <header className="border-b border-border">
        <div className="mx-auto flex w-full min-w-0 max-w-page flex-col gap-4 px-gutter py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link
            aria-label={customerShellCopy.brandLabel}
            className="inline-flex min-h-touch items-center text-body font-medium text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            href={CUSTOMER_HOME_PATH}
          >
            {customerShellCopy.brandName}
          </Link>
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:flex-1 lg:justify-end lg:gap-6">
            <CustomerAccountNav />
            <CustomerSignOutButton />
          </div>
        </div>
      </header>
      <main
        aria-label={customerShellCopy.mainLabel}
        className="min-w-0 flex-1"
        data-slot="customer-main"
        id={CUSTOMER_MAIN_CONTENT_ID}
      >
        <div className="mx-auto w-full min-w-0 max-w-page px-gutter py-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
