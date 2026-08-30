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
import { adminBlogCopy, getAdminBlogDetailsPath } from "@/config/admin-blog";
import type { AdminBlogPost } from "@/types/admin-blog";

interface BlogRowActionsProps {
  post: AdminBlogPost;
}

export function BlogRowActions({ post }: BlogRowActionsProps): ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={adminBlogCopy.actionsLabel}
          size="icon"
          variant="ghost"
        >
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{adminBlogCopy.comingSoonHint}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={getAdminBlogDetailsPath(post.id)}>
            {adminBlogCopy.viewAction}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>{adminBlogCopy.editAction}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
