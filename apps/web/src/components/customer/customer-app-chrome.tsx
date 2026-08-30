"use client";

import type { ReactElement, ReactNode } from "react";
import { CustomerHeader } from "@/components/customer/customer-header";
import { CustomerDesktopSidebar } from "@/components/customer/customer-sidebar";
import { useActivePathname } from "@/components/layout/navbar/use-active-pathname";
import { CUSTOMER_MAIN_CONTENT_ID, customerShellCopy } from "@/config/customer";
import { getCustomerPageTitle } from "@/config/customer-nav";
import type { CustomerNavbarIdentity } from "@/lib/customer/navbar";
import { signOutCustomer } from "@/lib/customer/session";

interface CustomerAppChromeProps {
  children?: ReactNode;
  identity: CustomerNavbarIdentity;
}

export function CustomerAppChrome({
  children,
  identity,
}: CustomerAppChromeProps): ReactElement {
  const pathname = useActivePathname();
  const pageTitle = getCustomerPageTitle(pathname);
  const logout = (): void => {
    void signOutCustomer();
  };

  return (
    <>
      <CustomerHeader
        identity={identity}
        onLogout={logout}
        pageTitle={pageTitle}
        pathname={pathname}
      />
      <div className="flex min-h-0 min-w-0 flex-1">
        <CustomerDesktopSidebar
          identity={identity}
          onLogout={logout}
          pathname={pathname}
        />
        <main
          aria-label={customerShellCopy.mainLabel}
          className="min-w-0 flex-1 overflow-x-hidden"
          data-slot="customer-main"
          id={CUSTOMER_MAIN_CONTENT_ID}
        >
          <div className="mx-auto w-full min-w-0 max-w-page px-gutter py-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
