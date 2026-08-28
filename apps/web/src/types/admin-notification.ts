export type AdminNotificationReadState = "read" | "unread";

export interface AdminNotification {
  createdAt: string | null;
  id: string;
  isRead: boolean | null;
  message: string | null;
  relatedHref: string | null;
  relatedLabel: string | null;
  title: string | null;
}

export interface AdminNotificationFilters {
  query: string;
  readState: string;
}

export interface AdminNotificationPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminNotificationFilterOption {
  id: string;
  label: string;
}

export interface AdminNotificationFilterCatalog {
  readStates: readonly AdminNotificationFilterOption[];
}

export type AdminNotificationPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | {
      notifications: readonly AdminNotification[];
      pagination?: AdminNotificationPagination;
      status: "ready";
    };
