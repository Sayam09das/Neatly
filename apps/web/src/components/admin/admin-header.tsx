import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import {
  AdminHeaderActions,
  AdminMobileNavTrigger,
} from "@/components/admin/admin-header-actions";
import { AdminPageTitle } from "@/components/admin/admin-page-title";
import { BrandMark } from "@/components/layout/navbar/brand-link";
import {
  ADMIN_HOME_PATH,
  adminHeaderCopy,
  adminShellCopy,
} from "@/config/admin-ui";

export interface AdminBreadcrumbItem {
  href?: string;
  label: string;
}

export interface AdminHeaderProps {
  actions?: ReactNode;
  breadcrumbs?: readonly AdminBreadcrumbItem[];
  onOpenNavigation?: () => void;
  title?: string;
}

export function AdminHeader({
  actions,
  breadcrumbs,
  onOpenNavigation,
  title,
}: AdminHeaderProps): ReactElement {
  return (
    <header
      className="flex min-h-14 min-w-0 shrink-0 items-center gap-3 border-b border-border bg-background px-gutter"
      data-slot="admin-header"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <AdminMobileNavTrigger onOpenNavigation={onOpenNavigation} />
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
        <AdminHeaderContext breadcrumbs={breadcrumbs} title={title} />
      </div>
      <AdminHeaderActions actions={actions} />
    </header>
  );
}

interface AdminHeaderContextProps {
  breadcrumbs?: readonly AdminBreadcrumbItem[];
  title?: string;
}

function AdminHeaderContext({
  breadcrumbs,
  title,
}: AdminHeaderContextProps): ReactElement {
  return (
    <div className="hidden min-w-0 items-center gap-3 lg:flex">
      {breadcrumbs !== undefined && breadcrumbs.length > 0 ? (
        <>
          <AdminBreadcrumbs items={breadcrumbs} showCurrentPage={false} />
          <span aria-hidden="true" className="text-muted-foreground">
            /
          </span>
        </>
      ) : null}
      {title !== undefined ? (
        <p className="truncate text-h4 text-foreground">{title}</p>
      ) : (
        <AdminPageTitle />
      )}
    </div>
  );
}

interface AdminBreadcrumbsProps {
  items: readonly AdminBreadcrumbItem[];
  showCurrentPage: boolean;
}

function AdminBreadcrumbs({
  items,
  showCurrentPage,
}: AdminBreadcrumbsProps): ReactElement {
  return (
    <nav aria-label={adminHeaderCopy.breadcrumbLabel} className="min-w-0">
      <ol className="flex min-w-0 items-center gap-2 text-caption text-muted-foreground">
        {items.map((item, index): ReactElement => {
          const isLast = index === items.length - 1;
          const isCurrent = isLast && showCurrentPage;

          return (
            <li className="flex min-w-0 items-center gap-2" key={item.label}>
              {index > 0 ? (
                <span aria-hidden="true" className="text-muted-foreground">
                  /
                </span>
              ) : null}
              {item.href !== undefined && !isCurrent ? (
                <Link
                  className="truncate rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn("truncate", isCurrent && "text-foreground")}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
