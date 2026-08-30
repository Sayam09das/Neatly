import { APP_NAME } from "@neatly/config";
import { AUTH_LOGIN_ALIAS_PATH } from "@/config/auth";

export const CLEANER_HOME_PATH = "/cleaner";
export const CLEANER_ACTIVATE_PATH = `${CLEANER_HOME_PATH}/activate`;
export const CLEANER_LOGIN_PATH = AUTH_LOGIN_ALIAS_PATH;
export const CLEANER_MAIN_CONTENT_ID = "cleaner-main-content";
export const CLEANER_HEADER_HEIGHT_CLASS = "min-h-16";
export const CLEANER_MOBILE_NAV_ID = "cleaner-mobile-navigation";
export const CLEANER_JOBS_SEARCH_MAX_LENGTH = 80;
export const CLEANER_JOBS_SEARCH_PARAM = "q";
export const CLEANER_JOBS_STATUS_PARAM = "status";
export const CLEANER_JOBS_WINDOW_PARAM = "window";
export const CLEANER_JOBS_PAGE_PARAM = "page";
export const CLEANER_JOBS_SEARCH_INPUT_ID = "cleaner-jobs-search";
export const CLEANER_JOBS_STATUS_INPUT_ID = "cleaner-jobs-status";
export const CLEANER_JOBS_WINDOW_INPUT_ID = "cleaner-jobs-window";

export const CLEANER_PATHS = {
  availability: `${CLEANER_HOME_PATH}/availability`,
  dashboard: `${CLEANER_HOME_PATH}/dashboard`,
  earnings: `${CLEANER_HOME_PATH}/earnings`,
  help: `${CLEANER_HOME_PATH}/help`,
  home: CLEANER_HOME_PATH,
  jobs: `${CLEANER_HOME_PATH}/jobs`,
  notifications: `${CLEANER_HOME_PATH}/notifications`,
  profile: `${CLEANER_HOME_PATH}/profile`,
  reviews: `${CLEANER_HOME_PATH}/reviews`,
  schedule: `${CLEANER_HOME_PATH}/schedule`,
  settings: `${CLEANER_HOME_PATH}/settings`,
} as const;

export const CLEANER_SIDEBAR_EXPANDED_WIDTH = "16rem";
export const CLEANER_SIDEBAR_COLLAPSED_WIDTH = "4rem";

export const CLEANER_API_PREFIX = "/api/v1/cleaner";

export const CLEANER_API_PATHS = {
  activate: `${CLEANER_API_PREFIX}/activate`,
  availability: `${CLEANER_API_PREFIX}/availability`,
  dashboard: `${CLEANER_API_PREFIX}/dashboard`,
  earnings: `${CLEANER_API_PREFIX}/earnings`,
  job: `${CLEANER_API_PREFIX}/jobs/:id`,
  jobComplete: `${CLEANER_API_PREFIX}/jobs/:id/complete`,
  jobStart: `${CLEANER_API_PREFIX}/jobs/:id/start`,
  jobs: `${CLEANER_API_PREFIX}/jobs`,
  me: `${CLEANER_API_PREFIX}/me`,
  notifications: `${CLEANER_API_PREFIX}/notifications`,
  reviews: `${CLEANER_API_PREFIX}/reviews`,
  schedule: `${CLEANER_API_PREFIX}/schedule`,
} as const;

export const CLEANER_SCHEDULE_DATE_PARAM = "date";
export const CLEANER_WEEKDAY_LABELS = {
  friday: "Friday",
  monday: "Monday",
  saturday: "Saturday",
  sunday: "Sunday",
  thursday: "Thursday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
} as const;

export const FORBIDDEN_CLEANER_AUTH_QUERY_KEYS = [
  "cleanerId",
  "userId",
] as const;

export const CLEANER_SESSION_REQUEST_TIMEOUT_MS = 8_000;

export const cleanerJobStatusLabels = {
  ASSIGNED: "Assigned",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In progress",
  PENDING: "Pending",
} as const;

export const cleanerSurfaceCopy = {
  bookingDetail: {
    title: "Job",
  },
  home: {
    description: "Here's what needs your attention today.",
    heading: "Cleaner Dashboard",
    title: "Cleaner",
  },
  availability: {
    description: "Set when you're available for cleaning jobs.",
    heading: "Availability",
    title: "Availability",
  },
  jobs: {
    description: "View and manage the cleaning jobs assigned to you.",
    heading: "Jobs",
    title: "Jobs",
  },
  schedule: {
    description: "View your assigned cleaning jobs by date and time.",
    heading: "Schedule",
    title: "Schedule",
  },
  notifications: {
    description:
      "Job assignments, schedule changes, and updates will appear here.",
    heading: "Notifications",
    title: "Notifications",
  },
  profile: {
    description: "Your cleaner account details will appear here.",
    heading: "Profile",
    title: "Profile",
  },
  settings: {
    description: "Account and workspace preferences will appear here.",
    heading: "Settings",
    title: "Settings",
  },
  help: {
    description:
      "Find answers about jobs, availability, and your cleaner account.",
    heading: "Help & Support",
    title: "Help & Support",
  },
} as const;

export const cleanerShellCopy = {
  brandHomeLabel: `${APP_NAME} cleaner home`,
  loadingLabel: "Loading cleaner workspace",
  logoutLabel: "Log out",
  mainLabel: "Cleaner workspace",
  navigationLabel: "Cleaner navigation",
  skipToContent: "Skip to content",
  workspaceLabel: "Cleaner",
} as const;

export const cleanerNavbarCopy = {
  accountMenuLabel: "Open account menu",
  menuCloseLabel: "Close menu",
  menuDescription: "Cleaner workspace navigation",
  menuOpenLabel: "Open menu",
  menuTitle: "Menu",
  notificationsEmpty: "You have no notifications yet.",
  notificationsLabel: "Notifications",
  primaryNavigationLabel: "Primary",
  profileItem: "Profile",
  roleLabel: "Cleaner",
  settingsItem: "Settings",
} as const;

export const cleanerSidebarCopy = {
  collapseLabel: "Collapse sidebar",
  expandLabel: "Expand sidebar",
} as const;

export const cleanerDashboardCopy = {
  assignedToday: "Assigned today",
  completedToday: "Completed today",
  dateFallback: "Today",
  emptyAction: "View jobs",
  emptyDescription: "No jobs have been assigned yet.",
  emptyTitle: "You're ready to get started.",
  greetingAfternoon: "Good afternoon",
  greetingAfternoonNamed: "Good afternoon, {name}",
  greetingEvening: "Good evening",
  greetingEveningNamed: "Good evening, {name}",
  greetingMorning: "Good morning",
  greetingMorningNamed: "Good morning, {name}",
  inProgress: "In progress",
  nextJobEmptyAction: "View jobs",
  nextJobEmptyDescription: "No upcoming jobs are assigned to you.",
  nextJobEmptyTitle: "You're all caught up.",
  nextJobHeading: "Next job",
  overviewHeading: "Today's overview",
  quickActionsHeading: "Quick actions",
  summaryIntro: "Here's what needs your attention today.",
  todayJobsEmpty: "No jobs are scheduled for today.",
  todayJobsHeading: "Today's jobs",
  unnamedCustomer: "Customer",
  unnamedService: "Assigned service",
  upcoming: "Upcoming",
  viewAllJobs: "View all jobs",
  viewJob: "View job",
  viewJobs: "View jobs",
} as const;

export const cleanerJobsCopy = {
  allStatuses: "All statuses",
  allWindows: "All dates",
  clearFilters: "Clear filters",
  emptyDescription: "When new jobs are assigned to you, they'll appear here.",
  emptyTitle: "No jobs assigned yet.",
  filterLabel: "Status",
  filteredEmptyDescription: "Try a different status, date, or search.",
  filteredEmptyTitle: "No jobs match your filters.",
  paginationLabel: "Jobs pagination",
  paginationNext: "Next",
  paginationPrevious: "Previous",
  searchLabel: "Search",
  searchPlaceholder: "Search service, customer, or location",
  tableCaption: "Assigned jobs",
  unnamedCustomer: "Customer",
  unnamedService: "Assigned service",
  viewJob: "View job",
  windowLabel: "Date",
  windowPast: "Past",
  windowToday: "Today",
  windowUpcoming: "Upcoming",
} as const;

export const cleanerJobDetailCopy = {
  backToJobs: "Back to jobs",
  breadcrumbCurrent: "Job",
  breadcrumbDashboard: "Overview",
  breadcrumbJobs: "Jobs",
  breadcrumbLabel: "Breadcrumb",
  customerHeading: "Customer",
  locationHeading: "Location",
  locationUnavailable: "Location not provided.",
  scheduleHeading: "Schedule",
  scheduleUnavailable: "Schedule not set.",
  statusLabel: "Status",
  unnamedCustomer: "Customer",
  unnamedService: "Assigned service",
} as const;

export const cleanerWorkflowCopy = {
  assignedHint: "This job is assigned to you and ready to start.",
  cancelledHint:
    "This job was cancelled. No further workflow actions are available.",
  completeAction: "Complete Job",
  completeBusy: "Completing…",
  completeConfirm: "Complete Job",
  completeDescription:
    "Mark this cleaning job as complete? This cannot be undone from here.",
  completeError: "Unable to complete this job.",
  completeKeep: "Cancel",
  completeSuccess: "Job completed.",
  completeTitle: "Complete this cleaning job?",
  completedHint: "This job is complete.",
  confirmedHint: "This job is confirmed and waiting to be assigned for work.",
  currentStatus: "Current status",
  inProgressHint: "This job is in progress.",
  lastUpdated: "Last updated",
  pendingHint: "This job is not ready to start yet.",
  progressHeading: "Job progress",
  staleError:
    "This job can no longer be updated. Please refresh the page and try again.",
  startAction: "Start Job",
  startBusy: "Starting…",
  startError: "Unable to start this job.",
  startSuccess: "Job started.",
  stepAssigned: "Assigned",
  stepCompleted: "Completed",
  stepInProgress: "In progress",
} as const;

export const cleanerScheduleCopy = {
  emptyDayDescription:
    "You don't have any cleaning jobs assigned for this date.",
  emptyDayTitle: "No jobs scheduled",
  emptyScheduleDescription: "Your assigned cleaning jobs will appear here.",
  emptyScheduleTitle: "No jobs scheduled yet.",
  firstStart: "First start",
  jobCount: "Today's jobs",
  nextDate: "Next day",
  nextJobHeading: "Next job",
  previousDate: "Previous day",
  today: "Today",
  todayLabel: "Today",
  unnamedCustomer: "Customer",
  unnamedService: "Assigned service",
  viewAllJobs: "View all jobs",
  viewJob: "View job",
  weekHeading: "This week",
} as const;

export const cleanerAvailabilityCopy = {
  availableLabel: "Available",
  conflictDescription:
    "You already have a job scheduled on a day marked unavailable. Existing jobs are not changed.",
  conflictHeading: "Existing jobs on unavailable days",
  discardAction: "Discard changes",
  emptyDescription:
    "Set your weekly working hours so Neatly knows when you're available.",
  emptyTitle: "No availability set",
  endLabel: "End",
  loadError: "We couldn't load your availability.",
  saveAction: "Save Availability",
  saveBusy: "Saving…",
  saveError: "We couldn't save your availability.",
  saveSuccess: "Availability updated.",
  scheduleLink: "View Schedule",
  startLabel: "Start",
  unavailableLabel: "Unavailable",
  validationRange: "End time must be after the start time.",
  validationRequired: "Enter a start and end time.",
  weekHeading: "Weekly availability",
} as const;

export const cleanerActivateCopy = {
  confirmPasswordLabel: "Confirm password",
  confirmPasswordPlaceholder: "Confirm password",
  description: "Set up your Cleaner account.",
  emailLabel: "Email",
  expiredAction: "Request a new invitation",
  expiredDescription: "This invitation is no longer valid.",
  expiredHeading: "Invitation expired",
  heading: "Welcome to Neatly",
  headingId: "cleaner-activate-heading",
  invalidDescription: "This invitation link is no longer valid.",
  invalidHeading: "Invalid invitation",
  loginAction: "Back to sign in",
  passwordLabel: "Password",
  passwordPlaceholder: "Password",
  submit: "Activate Account",
  submitting: "Activating...",
  title: "Activate your cleaner account",
} as const;

export const cleanerErrorCopy = {
  action: "Try again",
  description: "We could not load this page. Please try again.",
  heading: "Something went wrong",
} as const;

export const cleanerNotFoundCopy = {
  action: "Back to workspace",
  description: "That cleaner page is not available.",
  heading: "Page not found",
} as const;

export function cleanerJobPath(id: string): string {
  return `${CLEANER_PATHS.jobs}/${encodeURIComponent(id)}`;
}

export function withCleanerApiId(path: string, id: string): string {
  return path.replace(":id", encodeURIComponent(id));
}
