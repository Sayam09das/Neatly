import type { ReactElement, ReactNode } from "react";
import {
  type AdminBreadcrumbItem,
  AdminHeader,
} from "@/components/admin/admin-header";
import { AdminNavigationProvider } from "@/components/admin/admin-navigation-provider";
import { AdminRealtimeProvider } from "@/components/admin/admin-realtime-provider";
import {
  AdminDesktopSidebar,
  AdminMobileSidebar,
} from "@/components/admin/admin-sidebar";
import { ADMIN_MAIN_CONTENT_ID, adminShellCopy } from "@/config/admin-ui";

interface AdminShellProps {
  actions?: ReactNode;
  breadcrumbs?: readonly AdminBreadcrumbItem[];
  children: ReactNode;
  onOpenNavigation?: () => void;
  title?: string;
}

export function AdminShell({
  actions,
  breadcrumbs,
  children,
  onOpenNavigation,
  title,
}: AdminShellProps): ReactElement {
  return (
    <AdminNavigationProvider>
      <AdminRealtimeProvider>
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
          <AdminHeader
            actions={actions}
            breadcrumbs={breadcrumbs}
            onOpenNavigation={onOpenNavigation}
            title={title}
          />
          <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
            <AdminDesktopSidebar />
            <AdminMobileSidebar />
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
      </AdminRealtimeProvider>
    </AdminNavigationProvider>
  );
}
