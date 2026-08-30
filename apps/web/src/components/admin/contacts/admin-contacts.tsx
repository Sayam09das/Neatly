"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { ContactsMetrics } from "@/components/admin/contacts/contacts-metrics";
import { ContactsTable } from "@/components/admin/contacts/contacts-table";
import { ContactsToolbar } from "@/components/admin/contacts/contacts-toolbar";
import {
  adminContactCopy,
  defaultAdminContactFilters,
} from "@/config/admin-contacts";
import {
  filterContacts,
  hasActiveContactFilters,
  paginateContacts,
} from "@/lib/admin/contacts";
import { useAdminListState } from "@/lib/admin/use-admin-list-state";
import type {
  AdminContact,
  AdminContactFilters,
  AdminContactPagination,
  AdminContactPresentation,
} from "@/types/admin-contact";

interface AdminContactsProps {
  presentation?: AdminContactPresentation;
}

export function AdminContacts({
  presentation,
}: AdminContactsProps): ReactElement {
  if (presentation === undefined) {
    return <AdminContactsLive />;
  }

  return <AdminContactsView presentation={presentation} />;
}

function AdminContactsLive(): ReactElement {
  const { filters, page, setFilters, setPage } = useAdminListState({
    defaults: defaultAdminContactFilters,
  });
  const hasActiveFilters = hasActiveContactFilters(filters);

  return (
    <AdminContactsView
      filters={filters}
      onFiltersChange={setFilters}
      onPageChange={setPage}
      page={page}
      presentation={
        hasActiveFilters
          ? { contacts: [], status: "ready" }
          : { status: "empty" }
      }
    />
  );
}

interface AdminContactsViewProps {
  filters?: AdminContactFilters;
  onFiltersChange?: (filters: AdminContactFilters) => void;
  onPageChange?: (page: number) => void;
  page?: number;
  presentation: AdminContactPresentation;
}

function AdminContactsView({
  filters: filtersProp,
  onFiltersChange,
  onPageChange,
  page: pageProp,
  presentation,
}: AdminContactsViewProps): ReactElement {
  const [localFilters, setLocalFilters] = useState<AdminContactFilters>(
    defaultAdminContactFilters,
  );
  const [localPage, setLocalPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = filtersProp ?? localFilters;
  const setFilters = (next: AdminContactFilters): void => {
    if (onFiltersChange === undefined) {
      setLocalFilters(next);
      setLocalPage(1);
      return;
    }

    onFiltersChange(next);
  };
  const page = pageProp ?? localPage;
  const setPage = onPageChange ?? setLocalPage;
  const sourceContacts = getSourceContacts(presentation);
  const filteredContacts =
    onFiltersChange === undefined
      ? filterContacts(sourceContacts, filters)
      : sourceContacts;
  const paged = resolveVisibleContacts(
    filteredContacts,
    page,
    presentation,
    onFiltersChange,
  );
  const hasActiveFilters = hasActiveContactFilters(filters);

  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-contacts"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <h1 className="text-h1 text-foreground tracking-tight">
              {adminContactCopy.heading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminContactCopy.description}
            </p>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <ContactsMetrics
            contacts={sourceContacts}
            presentation={presentation}
          />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <ContactsToolbar
            filters={filters}
            filtersOpen={filtersOpen}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminContactFilters);
            }}
            onFiltersChange={setFilters}
            onFiltersOpenChange={setFiltersOpen}
          />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <ContactsTable
            contacts={paged.contacts}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminContactFilters);
            }}
            onPageChange={setPage}
            pagination={paged.pagination}
            presentation={presentation}
          />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

function getSourceContacts(
  presentation: AdminContactPresentation,
): readonly AdminContact[] {
  return presentation.status === "ready" ? presentation.contacts : [];
}

function resolveVisibleContacts(
  contacts: readonly AdminContact[],
  page: number,
  presentation: AdminContactPresentation,
  onFiltersChange: ((filters: AdminContactFilters) => void) | undefined,
): {
  contacts: readonly AdminContact[];
  pagination: AdminContactPagination | undefined;
} {
  if (
    onFiltersChange !== undefined &&
    presentation.status === "ready" &&
    presentation.pagination !== undefined
  ) {
    return {
      contacts,
      pagination: presentation.pagination,
    };
  }

  const paged = paginateContacts(contacts, page);

  return {
    contacts: paged.contacts,
    pagination: paged.pagination,
  };
}
