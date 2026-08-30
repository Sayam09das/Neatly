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
  adminQuoteCopy,
  getAdminQuoteDetailsPath,
} from "@/config/admin-quotes";
import type { AdminQuote } from "@/types/admin-quote";

interface QuoteRowActionsProps {
  quote: AdminQuote;
}

export function QuoteRowActions({ quote }: QuoteRowActionsProps): ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={adminQuoteCopy.actionsLabel}
          size="icon"
          variant="ghost"
        >
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{adminQuoteCopy.viewAction}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={getAdminQuoteDetailsPath(quote.id)}>
            {adminQuoteCopy.viewAction}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
