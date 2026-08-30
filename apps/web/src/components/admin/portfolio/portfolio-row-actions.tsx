"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { MoreIcon } from "@/components/admin/admin-icons";
import {
  adminPortfolioCopy,
  getAdminPortfolioDetailsPath,
} from "@/config/admin-portfolio";
import type { AdminPortfolioProject } from "@/types/admin-portfolio";

interface PortfolioRowActionsProps {
  project: AdminPortfolioProject;
}

export function PortfolioRowActions({
  project,
}: PortfolioRowActionsProps): ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={adminPortfolioCopy.actionsLabel}
          size="icon"
          variant="ghost"
        >
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {adminPortfolioCopy.comingSoonHint}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={getAdminPortfolioDetailsPath(project.id)}>
            {adminPortfolioCopy.viewAction}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminPortfolioCopy.editAction}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
