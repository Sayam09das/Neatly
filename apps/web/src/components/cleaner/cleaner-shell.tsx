import type { ReactElement, ReactNode } from "react";
import { CleanerAppChrome } from "@/components/cleaner/cleaner-app-chrome";
import { CleanerNavigationProvider } from "@/components/cleaner/cleaner-navigation-provider";
import { CLEANER_MAIN_CONTENT_ID, cleanerShellCopy } from "@/config/cleaner";
import type { CleanerNavbarIdentity } from "@/lib/cleaner/identity";

interface CleanerShellProps {
  children: ReactNode;
  identity: CleanerNavbarIdentity;
}

export function CleanerShell({
  children,
  identity,
}: CleanerShellProps): ReactElement {
  return (
    <CleanerNavigationProvider>
      <div
        className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden bg-background"
        data-slot="cleaner-shell"
      >
        <a
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-gutter focus-visible:z-tooltip focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-foreground"
          href={`#${CLEANER_MAIN_CONTENT_ID}`}
        >
          {cleanerShellCopy.skipToContent}
        </a>
        <CleanerAppChrome identity={identity}>{children}</CleanerAppChrome>
      </div>
    </CleanerNavigationProvider>
  );
}
