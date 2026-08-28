export type AdminServiceStatus = "active" | "inactive";

export interface AdminService {
  coverImageUrl: string | null;
  id: string;
  isActive: boolean | null;
  name: string | null;
  shortDescription: string | null;
  slug: string | null;
}

export interface AdminServiceFilters {
  query: string;
  status: string;
}

export interface AdminServicePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminServiceFilterOption {
  id: AdminServiceStatus;
  label: string;
}

export interface AdminServiceFilterCatalog {
  statuses: readonly AdminServiceFilterOption[];
}

export type AdminServicePresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | {
      pagination?: AdminServicePagination;
      services: readonly AdminService[];
      status: "ready";
    };
