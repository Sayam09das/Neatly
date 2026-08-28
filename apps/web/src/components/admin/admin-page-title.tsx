"use client";

import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { getAdminPageTitle } from "@/config/admin-nav";
import { ADMIN_HOME_PATH } from "@/config/admin-ui";

interface AdminPageTitleProps {
  title?: string;
}

export function AdminPageTitle({ title }: AdminPageTitleProps): ReactElement {
  const pathname = usePathname() ?? ADMIN_HOME_PATH;
  const resolvedTitle = title ?? getAdminPageTitle(pathname);

  return (
    <p
      className="truncate text-h4 text-foreground"
      data-slot="admin-page-title"
    >
      {resolvedTitle}
    </p>
  );
}
