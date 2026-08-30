"use client";

import { Card } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { ContactCardList } from "@/components/admin/contacts/contact-card";
import { ContactsDesktopTable } from "@/components/admin/contacts/contacts-desktop-table";
import { ContactsPagination } from "@/components/admin/contacts/contacts-pagination";
import {
  ContactsEmptyState,
  ContactsError,
  ContactsLoading,
  ContactsNoMatchesState,
} from "@/components/admin/contacts/contacts-states";
import { shouldRenderContactPagination } from "@/lib/admin/contacts";
import type {
  AdminContact,
  AdminContactPagination,
  AdminContactPresentation,
} from "@/types/admin-contact";

interface ContactsTableProps {
  contacts: readonly AdminContact[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onPageChange?: (page: number) => void;
  pagination?: AdminContactPagination;
  presentation: AdminContactPresentation;
}

export function ContactsTable({
  contacts,
  hasActiveFilters,
  onClearFilters,
  onPageChange,
  pagination,
  presentation,
}: ContactsTableProps): ReactElement {
  return (
    <div className="flex flex-col gap-4" data-slot="contacts-table">
      <ContactsTableBody
        contacts={contacts}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        presentation={presentation}
      />
      {presentation.status === "ready" &&
      shouldRenderContactPagination(pagination, contacts.length) &&
      pagination !== undefined ? (
        <ContactsPagination
          onPageChange={onPageChange}
          pagination={pagination}
        />
      ) : null}
    </div>
  );
}

interface ContactsTableBodyProps {
  contacts: readonly AdminContact[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  presentation: AdminContactPresentation;
}

function ContactsTableBody({
  contacts,
  hasActiveFilters,
  onClearFilters,
  presentation,
}: ContactsTableBodyProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <ContactsLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <ContactsError onRetry={presentation.onRetry} />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <ContactsEmptyState />
      </Card>
    );
  }

  if (contacts.length === 0) {
    return (
      <Card className="p-6 shadow-none">
        {hasActiveFilters ? (
          <ContactsNoMatchesState onClearFilters={onClearFilters} />
        ) : (
          <ContactsEmptyState />
        )}
      </Card>
    );
  }

  return (
    <AnimatePresence initial={false}>
      <motion.div
        animate="visible"
        initial={prefersReducedMotion ? false : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: prefersReducedMotion ? 0 : motionDuration.micro,
            },
          },
        }}
      >
        <ContactCardList contacts={contacts} />
        <ContactsDesktopTable contacts={contacts} />
      </motion.div>
    </AnimatePresence>
  );
}
