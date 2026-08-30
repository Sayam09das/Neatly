"use client";

import type { ReactElement, ReactNode } from "react";
import { CleanerHeader } from "@/components/cleaner/cleaner-header";
import { CleanerDesktopSidebar } from "@/components/cleaner/cleaner-sidebar";
import { useActivePathname } from "@/components/layout/navbar/use-active-pathname";
import { CLEANER_MAIN_CONTENT_ID, cleanerShellCopy } from "@/config/cleaner";
import { getCleanerPageTitle } from "@/config/cleaner-nav";
import type { CleanerNavbarIdentity } from "@/lib/cleaner/identity";
import { signOutCleaner } from "@/lib/cleaner/session";

interface CleanerAppChromeProps {
  children: ReactNode;
  identity: CleanerNavbarIdentity;
}

export function CleanerAppChrome({
  children,
  identity,
}: CleanerAppChromeProps): ReactElement {
  const pathname = useActivePathname();
  const pageTitle = getCleanerPageTitle(pathname);
  const logout = (): void => {
    void signOutCleaner();
  };

  return (
    <>
      <CleanerHeader
        identity={identity}
        onLogout={logout}
        pageTitle={pageTitle}
        pathname={pathname}
      />
      <div className="flex min-h-0 min-w-0 flex-1">
        <CleanerDesktopSidebar
          identity={identity}
          onLogout={logout}
          pathname={pathname}
        />
        <main
          aria-label={cleanerShellCopy.mainLabel}
          className="min-w-0 flex-1 overflow-x-hidden"
          data-slot="cleaner-main"
          id={CLEANER_MAIN_CONTENT_ID}
        >
          <div className="mx-auto w-full min-w-0 max-w-page px-gutter py-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
