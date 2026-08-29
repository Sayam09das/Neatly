export type CleanerStatus = "ACTIVE" | "INACTIVE";

export type CleanerJobStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface CleanerProfile {
  email: string | null;
  id: string;
  name: string;
  phone: string | null;
  status: CleanerStatus;
}

export interface CleanerJobParty {
  id: string;
  name: string;
}

export interface CleanerJobActions {
  canComplete: boolean;
  canStart: boolean;
}

export interface CleanerJob {
  actions: CleanerJobActions;
  customerName: string | null;
  id: string;
  scheduledAt: string | null;
  service: CleanerJobParty | null;
  serviceAddress: string | null;
  status: CleanerJobStatus;
  updatedAt: string;
}

export interface CleanerScheduleDay {
  date: string;
  jobCount: number;
}

export interface CleanerSchedule {
  date: string;
  jobs: CleanerJob[];
  nextJob: CleanerJob | null;
  summary: {
    firstStart: string | null;
    jobCount: number;
  };
  week: CleanerScheduleDay[];
}

export const CLEANER_WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type CleanerWeekday = (typeof CLEANER_WEEKDAYS)[number];

export interface CleanerWeekDayAvailability {
  available: boolean;
  day: CleanerWeekday;
  end: string | null;
  start: string | null;
}

export interface CleanerAvailabilityConflict {
  date: string;
  jobId: string;
  serviceName: string | null;
}

export interface CleanerAvailability {
  conflicts: CleanerAvailabilityConflict[];
  week: CleanerWeekDayAvailability[];
}

export interface CleanerOverviewSummary {
  assignedToday: number;
  completedToday: number;
  inProgress: number;
  upcoming: number;
}

export interface CleanerOverview {
  nextJob: CleanerJob | null;
  summary: CleanerOverviewSummary;
  todayJobs: CleanerJob[];
}

export interface CleanerJobList {
  items: CleanerJob[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CleanerNotification {
  createdAt: string;
  id: string;
  isRead: boolean;
  message: string;
  readAt: string | null;
  relatedHref: string | null;
  relatedLabel: string | null;
  title: string;
}

export interface CleanerReview {
  bookingId: string | null;
  content: string;
  id: string;
  rating: number;
}

export type CleanerLoadingVariant = "page" | "section" | "list" | "detail";
