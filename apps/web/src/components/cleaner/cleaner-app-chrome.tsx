"use client";

import type { ReactElement } from "react";
import { CleanerHeader } from "@/components/cleaner/cleaner-header";
import { CleanerSidebar } from "@/components/cleaner/cleaner-sidebar";
import { useActivePathname } from "@/components/layout/navbar/use-active-pathname";
import { getCleanerPageTitle } from "@/config/cleaner-nav";
import type { CleanerNavbarIdentity } from "@/lib/cleaner/identity";
import { signOutCleaner } from "@/lib/cleaner/session";

interface CleanerAppChromeProps {
  identity: CleanerNavbarIdentity;
}

export function CleanerAppChrome({
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
      <CleanerSidebar identity={identity} pathname={pathname} />
    </>
  );
}
