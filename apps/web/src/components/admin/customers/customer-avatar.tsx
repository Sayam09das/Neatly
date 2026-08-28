"use client";

import type { ReactElement } from "react";
import { UserIcon } from "@/components/admin/admin-icons";
import { getCustomerInitials } from "@/lib/admin/customers";

interface CustomerAvatarProps {
  name: string | null;
}

export function CustomerAvatar({ name }: CustomerAvatarProps): ReactElement {
  const initials = getCustomerInitials(name);

  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-caption font-medium text-foreground"
      data-slot="customer-avatar"
    >
      {initials === null ? <UserIcon className="size-4" /> : initials}
    </span>
  );
}
