export interface AdminCustomer {
  address: string | null;
  avatarUrl: string | null;
  bookingCount: number | null;
  email: string | null;
  id: string;
  joinedAt: string | null;
  name: string | null;
  phone: string | null;
  statusLabel: string | null;
}

export interface AdminCustomerFilters {
  joinedFrom: string;
  joinedTo: string;
  query: string;
  status: string;
}

export interface AdminCustomerPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminCustomerFilterOption {
  id: string;
  label: string;
}

export interface AdminCustomerFilterCatalog {
  statuses: readonly AdminCustomerFilterOption[];
}

export type AdminCustomerPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | {
      customers: readonly AdminCustomer[];
      pagination?: AdminCustomerPagination;
      status: "ready";
    };
