import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { BrandMark } from "@/components/layout/navbar/brand-link";
import {
  ADMIN_HOME_PATH,
  ADMIN_MAIN_CONTENT_ID,
  adminShellCopy,
} from "@/config/admin-ui";

interface AdminShellProps {
  children: ReactNode;
  headerEnd?: ReactNode;
  sidebar?: ReactNode;
}

export function AdminShell({
  children,
  headerEnd,
  sidebar,
}: AdminShellProps): ReactElement {
  return (
    <div
      className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-background"
      data-lenis-prevent=""
      data-slot="admin-shell"
    >
      <a
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-gutter focus-visible:z-tooltip focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-foreground"
        href={`#${ADMIN_MAIN_CONTENT_ID}`}
      >
        {adminShellCopy.skipToContent}
      </a>
      <header
        className="flex min-h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-gutter"
        data-slot="admin-header"
      >
        <Link
          aria-label={adminShellCopy.brandLabel}
          className="inline-flex min-h-touch min-w-0 items-center gap-2 rounded-sm text-h4 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          href={ADMIN_HOME_PATH}
        >
          <BrandMark />
          <span className="truncate">
            {adminShellCopy.brandName}
            <span className="ml-2 text-caption font-medium text-muted-foreground">
              {adminShellCopy.brandSuffix}
            </span>
          </span>
        </Link>
        <div
          className="flex min-h-touch min-w-0 items-center justify-end"
          data-slot="admin-header-actions"
        >
          {headerEnd}
        </div>
      </header>
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <aside
          aria-label={adminShellCopy.navigationLabel}
          className="hidden min-h-0 w-64 shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-border bg-background lg:flex"
          data-slot="admin-sidebar"
        >
          {sidebar}
        </aside>
        <main
          aria-label={adminShellCopy.mainLabel}
          className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto"
          data-slot="admin-main"
          id={ADMIN_MAIN_CONTENT_ID}
        >
          <div className="w-full min-w-0 px-gutter py-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
