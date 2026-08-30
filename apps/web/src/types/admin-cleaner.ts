export type AdminCleanerAccountState = "ACTIVE" | "INACTIVE" | "INVITED";

export interface AdminCleaner {
  accountState: AdminCleanerAccountState | null;
  accountStateLabel: string | null;
  createdAt: string | null;
  email: string | null;
  id: string;
  name: string | null;
  phone: string | null;
  statusLabel: string | null;
}

export interface AdminCleanerFilters {
  query: string;
  status: string;
}

export interface AdminCleanerPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminCleanerFilterOption {
  id: string;
  label: string;
}

export interface AdminCleanerFilterCatalog {
  statuses: readonly AdminCleanerFilterOption[];
}

export type AdminCleanerPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | {
      cleaners: readonly AdminCleaner[];
      pagination?: AdminCleanerPagination;
      status: "ready";
    };
