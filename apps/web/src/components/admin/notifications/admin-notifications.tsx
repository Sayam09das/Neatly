"use client";

import {
  Button,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@neatly/ui";
import { motion } from "framer-motion";
import { type ReactElement, useId, useState } from "react";
import { getMotionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { FilterIcon } from "@/components/admin/admin-icons";
import { AdminListPagination } from "@/components/admin/admin-list-pagination";
import { NotificationsList } from "@/components/admin/notifications/notification-item";
import { NotificationsFilterChips } from "@/components/admin/notifications/notifications-filter-chips";
import {
  NotificationsEmptyState,
  NotificationsError,
  NotificationsLoading,
  NotificationsNoMatchesState,
  NotificationsUnavailableCard,
} from "@/components/admin/notifications/notifications-states";
import { ADMIN_SEARCH_DEBOUNCE_MS } from "@/config/admin-api";
import {
  adminNotificationCopy,
  adminNotificationFilterCatalog,
  defaultAdminNotificationFilters,
} from "@/config/admin-notifications";
import {
  type AdminNotificationList,
  filterNotifications,
  hasActiveNotificationFilters,
  listAdminNotifications,
  markAllAdminNotificationsRead,
  shouldRenderNotificationPagination,
} from "@/lib/admin/notifications";
import { useAdminListState } from "@/lib/admin/use-admin-list-state";
import {
  type AdminQueryState,
  useAdminQuery,
} from "@/lib/admin/use-admin-query";
import { useDebouncedValue } from "@/lib/admin/use-debounced-value";
import { toast } from "@/lib/toast";
import type {
  AdminNotificationFilters,
  AdminNotificationPresentation,
} from "@/types/admin-notification";

interface AdminNotificationsProps {
  presentation?: AdminNotificationPresentation;
}

export function AdminNotifications({
  presentation,
}: AdminNotificationsProps): ReactElement {
  if (presentation === undefined) {
    return <AdminNotificationsLive />;
  }

  return <AdminNotificationsView presentation={presentation} />;
}

function AdminNotificationsLive(): ReactElement {
  const { filters, page, setFilters, setPage } = useAdminListState({
    defaults: defaultAdminNotificationFilters,
  });
  const debouncedQuery = useDebouncedValue(
    filters.query,
    ADMIN_SEARCH_DEBOUNCE_MS,
  );
  const requestKey = JSON.stringify({
    page,
    query: debouncedQuery,
    readState: filters.readState,
  });
  const query = useAdminQuery({
    enabled: true,
    request: (signal) =>
      listAdminNotifications(
        {
          page,
          query: debouncedQuery,
          readState: filters.readState,
        },
        { signal },
      ),
    requestKey,
  });

  return (
    <AdminNotificationsView
      filters={filters}
      onFiltersChange={setFilters}
      onMutated={query.retry}
      onPageChange={setPage}
      presentation={toLiveNotificationPresentation(
        query,
        hasActiveNotificationFilters(filters),
      )}
    />
  );
}

interface AdminNotificationsViewProps {
  filters?: AdminNotificationFilters;
  onFiltersChange?: (filters: AdminNotificationFilters) => void;
  onMutated?: () => void;
  onPageChange?: (page: number) => void;
  presentation: AdminNotificationPresentation;
}

function AdminNotificationsView({
  filters: filtersProp,
  onFiltersChange,
  onMutated,
  onPageChange,
  presentation,
}: AdminNotificationsViewProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const searchId = useId();
  const readStateId = useId();
  const [localFilters, setLocalFilters] = useState<AdminNotificationFilters>(
    defaultAdminNotificationFilters,
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const filters = filtersProp ?? localFilters;
  const setFilters = onFiltersChange ?? setLocalFilters;
  const source =
    presentation.status === "ready" ? presentation.notifications : [];
  const visible = filterNotifications(source, {
    query: filters.query,
    readState:
      onFiltersChange !== undefined && filters.readState === "unread"
        ? ""
        : filters.readState,
  });
  const hasActiveFilters = hasActiveNotificationFilters(filters);
  const canMarkAll = presentation.status === "ready" && visible.length > 0;

  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-notifications"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <h1 className="text-h1 text-foreground tracking-tight">
              {adminNotificationCopy.heading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminNotificationCopy.description}
            </p>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <motion.div
            className="flex flex-col gap-3"
            variants={{
              hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
              visible: {
                opacity: 1,
                y: 0,
                transition: getMotionTransition(prefersReducedMotion),
              },
            }}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <div className="min-w-0 flex-1">
                <Label className="sr-only" htmlFor={searchId}>
                  {adminNotificationCopy.searchLabel}
                </Label>
                <Input
                  aria-label={adminNotificationCopy.searchLabel}
                  id={searchId}
                  onChange={(event): void => {
                    setFilters({ ...filters, query: event.target.value });
                  }}
                  placeholder={adminNotificationCopy.searchPlaceholder}
                  type="search"
                  value={filters.query}
                />
              </div>
              <div className="hidden min-w-0 md:block md:w-48">
                <Label htmlFor={readStateId}>
                  {adminNotificationCopy.readStateLabel}
                </Label>
                <select
                  className="mt-1.5 flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  id={readStateId}
                  onChange={(event): void => {
                    setFilters({ ...filters, readState: event.target.value });
                  }}
                  value={filters.readState}
                >
                  <option value="">{adminNotificationCopy.readStateAll}</option>
                  {adminNotificationFilterCatalog.readStates.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Sheet onOpenChange={setFiltersOpen} open={filtersOpen}>
                  <Button
                    aria-expanded={filtersOpen}
                    onClick={(): void => setFiltersOpen(true)}
                    type="button"
                    variant="outline"
                  >
                    <FilterIcon />
                    {adminNotificationCopy.filtersLabel}
                  </Button>
                  <SheetContent
                    closeLabel={adminNotificationCopy.closeFiltersLabel}
                    side="right"
                  >
                    <SheetHeader>
                      <SheetTitle>
                        {adminNotificationCopy.filterSheetTitle}
                      </SheetTitle>
                      <SheetDescription>
                        {adminNotificationCopy.filterSheetDescription}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4">
                      <Label htmlFor={`${readStateId}-sheet`}>
                        {adminNotificationCopy.readStateLabel}
                      </Label>
                      <select
                        className="mt-1.5 flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2 text-body"
                        id={`${readStateId}-sheet`}
                        onChange={(event): void => {
                          setFilters({
                            ...filters,
                            readState: event.target.value,
                          });
                        }}
                        value={filters.readState}
                      >
                        <option value="">
                          {adminNotificationCopy.readStateAll}
                        </option>
                        {adminNotificationFilterCatalog.readStates.map(
                          (option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </SheetContent>
                </Sheet>
                <Button
                  disabled={!canMarkAll || markingAll}
                  onClick={(): void => {
                    if (onMutated === undefined) {
                      return;
                    }

                    void (async (): Promise<void> => {
                      setMarkingAll(true);
                      const result = await markAllAdminNotificationsRead();
                      setMarkingAll(false);

                      if (!result.ok) {
                        toast.error({
                          title: adminNotificationCopy.markAllError,
                        });
                        return;
                      }

                      onMutated();
                      toast.success({
                        title: adminNotificationCopy.markAllSuccess,
                      });
                    })();
                  }}
                  type="button"
                  variant="outline"
                >
                  {adminNotificationCopy.markAllAction}
                </Button>
              </div>
            </div>
            <NotificationsFilterChips
              filters={filters}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={(): void => {
                setFilters(defaultAdminNotificationFilters);
              }}
              onFiltersChange={setFilters}
            />
          </motion.div>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          {presentation.status === "loading" ? (
            <NotificationsUnavailableCard>
              <NotificationsLoading />
            </NotificationsUnavailableCard>
          ) : null}
          {presentation.status === "error" ? (
            <NotificationsUnavailableCard>
              <NotificationsError onRetry={presentation.onRetry} />
            </NotificationsUnavailableCard>
          ) : null}
          {presentation.status === "empty" ? (
            <NotificationsUnavailableCard>
              <NotificationsEmptyState />
            </NotificationsUnavailableCard>
          ) : null}
          {presentation.status === "ready" && visible.length === 0 ? (
            <NotificationsUnavailableCard>
              {hasActiveFilters ? (
                <NotificationsNoMatchesState
                  onClearFilters={(): void => {
                    setFilters(defaultAdminNotificationFilters);
                  }}
                />
              ) : (
                <NotificationsEmptyState />
              )}
            </NotificationsUnavailableCard>
          ) : null}
          {presentation.status === "ready" && visible.length > 0 ? (
            <NotificationsList notifications={visible} onMutated={onMutated} />
          ) : null}
          {presentation.status === "ready" &&
          shouldRenderNotificationPagination(
            presentation.pagination,
            visible.length,
          ) &&
          presentation.pagination !== undefined ? (
            <AdminListPagination
              ariaLabel={adminNotificationCopy.paginationLabel}
              nextLabel={adminNotificationCopy.paginationNext}
              onPageChange={onPageChange}
              pageLabel={adminNotificationCopy.paginationPageLabel}
              pagination={presentation.pagination}
              previousLabel={adminNotificationCopy.paginationPrevious}
              slot="notifications-pagination"
            />
          ) : null}
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

function toLiveNotificationPresentation(
  query: AdminQueryState<AdminNotificationList>,
  hasActiveFilters: boolean,
): AdminNotificationPresentation {
  if (query.status === "loading") {
    return { status: "loading" };
  }

  if (query.status === "error") {
    return { onRetry: query.retry, status: "error" };
  }

  if (query.data === null || query.data.notifications.length === 0) {
    return hasActiveFilters
      ? {
          notifications: [],
          pagination: query.data?.pagination,
          status: "ready",
        }
      : { status: "empty" };
  }

  return {
    notifications: query.data.notifications,
    pagination: query.data.pagination,
    status: "ready",
  };
}
