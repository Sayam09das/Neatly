import type { ReactElement, ReactNode } from "react";
import { CustomerNavbar } from "@/components/customer/customer-navbar";
import { SiteFooter } from "@/components/sections/site-footer";
import { CUSTOMER_MAIN_CONTENT_ID, customerShellCopy } from "@/config/customer";
import type { CustomerNavbarIdentity } from "@/lib/customer/navbar";

interface CustomerShellProps {
  children: ReactNode;
  identity: CustomerNavbarIdentity;
}

export function CustomerShell({
  children,
  identity,
}: CustomerShellProps): ReactElement {
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
      <CustomerNavbar identity={identity} />
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
      <SiteFooter
        area="account"
        session={{ identity, role: "customer" }}
        surface="solid"
      />
    </div>
  );
}
