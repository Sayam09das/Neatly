import { loadServerEnv } from "@neatly/config/server";
import { z } from "@neatly/config/zod";
import { ADMIN_SESSION_TOKEN_HEADER } from "@/config/admin-api";
import {
  CLEANER_API_PATHS,
  CLEANER_JOBS_PAGE_PARAM,
  CLEANER_JOBS_SEARCH_MAX_LENGTH,
  CLEANER_JOBS_SEARCH_PARAM,
  CLEANER_JOBS_STATUS_PARAM,
  CLEANER_JOBS_WINDOW_PARAM,
  CLEANER_PATHS,
  CLEANER_SCHEDULE_DATE_PARAM,
  CLEANER_SESSION_REQUEST_TIMEOUT_MS,
  withCleanerApiId,
} from "@/config/cleaner";
import {
  type JsonApiFailure,
  type JsonApiResult,
  parseJsonApiResponse,
} from "@/lib/api/envelope";
import { cleanerRequest } from "@/lib/cleaner/request";
import { parseUtcDateParam } from "@/lib/cleaner/schedule";
import type {
  CleanerAvailability,
  CleanerJob,
  CleanerJobList,
  CleanerJobStatus,
  CleanerOverview,
  CleanerSchedule,
  CleanerWeekDayAvailability,
} from "@/types/cleaner";

export const CLEANER_JOB_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export const CLEANER_JOB_WINDOWS = ["today", "upcoming", "past"] as const;

export type CleanerJobWindow = (typeof CLEANER_JOB_WINDOWS)[number];

export interface CleanerJobsQuery {
  page: number;
  q: string;
  status: CleanerJobStatus | "";
  window: CleanerJobWindow | "";
}

export type CleanerOverviewLoadResult =
  | { ok: true; overview: CleanerOverview }
  | { ok: false; unauthorized: boolean };

export type CleanerJobListLoadResult =
  | { list: CleanerJobList; ok: true }
  | { ok: false; unauthorized: boolean };

export type CleanerJobLoadResult =
  | { job: CleanerJob; ok: true }
  | { notFound: true; ok: false; unauthorized: false }
  | { notFound: false; ok: false; unauthorized: boolean };

type SearchParamsInput = Record<string, string | string[] | undefined>;

const jobLoadFailure: JsonApiFailure = {
  code: "INTERNAL_ERROR",
  fields: {},
  forbidden: false,
  message: "Unable to complete this request. Please try again.",
  ok: false,
  status: 0,
  unauthorized: false,
};

const jobPartySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const cleanerJobSchema = z.object({
  actions: z.object({
    canComplete: z.boolean(),
    canStart: z.boolean(),
  }),
  customerName: z.string().nullable(),
  id: z.string().min(1),
  scheduledAt: z.string().nullable(),
  service: jobPartySchema.nullable(),
  serviceAddress: z.string().nullable(),
  status: z.enum(CLEANER_JOB_STATUSES),
  updatedAt: z.string().min(1),
});

const jobPayloadSchema = z.object({
  job: cleanerJobSchema,
});

const jobPaginationSchema = z.object({
  limit: z.number().int().positive(),
  page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

const jobListPayloadSchema = z.object({
  items: z.array(cleanerJobSchema),
  pagination: jobPaginationSchema,
});

const overviewPayloadSchema = z.object({
  overview: z.object({
    nextJob: cleanerJobSchema.nullable(),
    summary: z.object({
      assignedToday: z.number().int().nonnegative(),
      completedToday: z.number().int().nonnegative(),
      inProgress: z.number().int().nonnegative(),
      upcoming: z.number().int().nonnegative(),
    }),
    todayJobs: z.array(cleanerJobSchema),
  }),
});

export function parseCleanerJobsSearchParams(
  searchParams: SearchParamsInput,
): CleanerJobsQuery {
  const q = readSearchParam(searchParams, CLEANER_JOBS_SEARCH_PARAM)
    .trim()
    .slice(0, CLEANER_JOBS_SEARCH_MAX_LENGTH);
  const pageValue = Number.parseInt(
    readSearchParam(searchParams, CLEANER_JOBS_PAGE_PARAM),
    10,
  );
  const statusValue = readSearchParam(searchParams, CLEANER_JOBS_STATUS_PARAM);
  const windowValue = readSearchParam(searchParams, CLEANER_JOBS_WINDOW_PARAM);

  return {
    page: Number.isInteger(pageValue) && pageValue >= 1 ? pageValue : 1,
    q,
    status: isJobStatus(statusValue) ? statusValue : "",
    window: isJobWindow(windowValue) ? windowValue : "",
  };
}

export function cleanerJobsHref(query: CleanerJobsQuery): string {
  const params = new URLSearchParams();

  if (query.q !== "") {
    params.set(CLEANER_JOBS_SEARCH_PARAM, query.q);
  }

  if (query.status !== "") {
    params.set(CLEANER_JOBS_STATUS_PARAM, query.status);
  }

  if (query.window !== "") {
    params.set(CLEANER_JOBS_WINDOW_PARAM, query.window);
  }

  if (query.page > 1) {
    params.set(CLEANER_JOBS_PAGE_PARAM, String(query.page));
  }

  const encoded = params.toString();
  return encoded === ""
    ? CLEANER_PATHS.jobs
    : `${CLEANER_PATHS.jobs}?${encoded}`;
}

export function cleanerJobsHasFilters(query: CleanerJobsQuery): boolean {
  return query.q !== "" || query.status !== "" || query.window !== "";
}

export function parseCleanerScheduleSearchParams(
  searchParams: SearchParamsInput,
): string {
  const value = readSearchParam(searchParams, CLEANER_SCHEDULE_DATE_PARAM);
  return parseUtcDateParam(value) === null ? "" : value;
}

export async function loadCleanerOverview(
  sessionToken: string | undefined,
): Promise<CleanerOverviewLoadResult> {
  const result = await requestCleanerJson(
    CLEANER_API_PATHS.dashboard,
    sessionToken,
  );

  if (!result.ok) {
    return { ok: false, unauthorized: result.unauthorized };
  }

  const parsed = overviewPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return { ok: false, unauthorized: false };
  }

  return { ok: true, overview: parsed.data.overview };
}

export async function loadCleanerJobs(
  query: CleanerJobsQuery,
  sessionToken: string | undefined,
): Promise<CleanerJobListLoadResult> {
  const env = loadServerEnv();
  const origin = env.NEATLY_API_URL.endsWith("/")
    ? env.NEATLY_API_URL.slice(0, -1)
    : env.NEATLY_API_URL;
  const url = new URL(CLEANER_API_PATHS.jobs, `${origin}/`);

  if (query.q !== "") {
    url.searchParams.set("search", query.q);
  }

  if (query.status !== "") {
    url.searchParams.set("status", query.status);
  }

  if (query.window !== "") {
    url.searchParams.set("window", query.window);
  }

  if (query.page > 1) {
    url.searchParams.set("page", String(query.page));
  }

  const result = await requestCleanerJson(url, sessionToken);

  if (!result.ok) {
    return { ok: false, unauthorized: result.unauthorized };
  }

  const parsed = jobListPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return { ok: false, unauthorized: false };
  }

  return {
    list: {
      items: parsed.data.items,
      pagination: {
        page: parsed.data.pagination.page,
        pageSize: parsed.data.pagination.limit,
        total: parsed.data.pagination.total,
        totalPages: parsed.data.pagination.totalPages,
      },
    },
    ok: true,
  };
}

export async function mutateCleanerJob(
  id: string,
  action: "start" | "complete",
): Promise<JsonApiResult<CleanerJob>> {
  const path =
    action === "start"
      ? withCleanerApiId(CLEANER_API_PATHS.jobStart, id)
      : withCleanerApiId(CLEANER_API_PATHS.jobComplete, id);
  const result = await cleanerRequest<unknown>(path, { method: "POST" });

  if (!result.ok) {
    return result;
  }

  const parsed = jobPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return jobLoadFailure;
  }

  return {
    data: parsed.data.job,
    ok: true,
    status: result.status,
  };
}

export async function loadCleanerJob(
  id: string,
  sessionToken: string | undefined,
): Promise<CleanerJobLoadResult> {
  const result = await requestCleanerJson(
    withCleanerApiId(CLEANER_API_PATHS.job, id),
    sessionToken,
  );

  if (!result.ok) {
    if (result.status === 404 || result.forbidden) {
      return { notFound: true, ok: false, unauthorized: false };
    }

    return {
      notFound: false,
      ok: false,
      unauthorized: result.unauthorized,
    };
  }

  const parsed = jobPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return { notFound: false, ok: false, unauthorized: false };
  }

  return { job: parsed.data.job, ok: true };
}

const schedulePayloadSchema = z.object({
  schedule: z.object({
    date: z.string().min(1),
    jobs: z.array(cleanerJobSchema),
    nextJob: cleanerJobSchema.nullable(),
    summary: z.object({
      firstStart: z.string().nullable(),
      jobCount: z.number().int().nonnegative(),
    }),
    week: z.array(
      z.object({
        date: z.string().min(1),
        jobCount: z.number().int().nonnegative(),
      }),
    ),
  }),
});

const availabilityDaySchema = z.object({
  available: z.boolean(),
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  end: z.string().nullable(),
  start: z.string().nullable(),
});

const availabilityPayloadSchema = z.object({
  availability: z.object({
    conflicts: z.array(
      z.object({
        date: z.string().min(1),
        jobId: z.string().min(1),
        serviceName: z.string().nullable(),
      }),
    ),
    week: z.array(availabilityDaySchema),
  }),
});

export type CleanerScheduleLoadResult =
  | { ok: true; schedule: CleanerSchedule }
  | { ok: false; unauthorized: boolean };

export type CleanerAvailabilityLoadResult =
  | { availability: CleanerAvailability; ok: true }
  | { ok: false; unauthorized: boolean };

export async function loadCleanerSchedule(
  date: string,
  sessionToken: string | undefined,
): Promise<CleanerScheduleLoadResult> {
  const env = loadServerEnv();
  const origin = env.NEATLY_API_URL.endsWith("/")
    ? env.NEATLY_API_URL.slice(0, -1)
    : env.NEATLY_API_URL;
  const url = new URL(CLEANER_API_PATHS.schedule, `${origin}/`);

  if (date !== "") {
    url.searchParams.set("date", date);
  }

  const result = await requestCleanerJson(url, sessionToken);

  if (!result.ok) {
    return { ok: false, unauthorized: result.unauthorized };
  }

  const parsed = schedulePayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return { ok: false, unauthorized: false };
  }

  return { ok: true, schedule: parsed.data.schedule };
}

export async function loadCleanerAvailability(
  sessionToken: string | undefined,
): Promise<CleanerAvailabilityLoadResult> {
  const result = await requestCleanerJson(
    CLEANER_API_PATHS.availability,
    sessionToken,
  );

  if (!result.ok) {
    return { ok: false, unauthorized: result.unauthorized };
  }

  const parsed = availabilityPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return { ok: false, unauthorized: false };
  }

  return { availability: parsed.data.availability, ok: true };
}

export async function saveCleanerAvailability(
  week: readonly CleanerWeekDayAvailability[],
): Promise<JsonApiResult<CleanerAvailability>> {
  const result = await cleanerRequest<unknown>(CLEANER_API_PATHS.availability, {
    body: JSON.stringify({ week }),
    method: "PATCH",
  });

  if (!result.ok) {
    return result;
  }

  const parsed = availabilityPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return jobLoadFailure;
  }

  return {
    data: parsed.data.availability,
    ok: true,
    status: result.status,
  };
}

async function requestCleanerJson(
  path: string | URL,
  sessionToken: string | undefined,
): Promise<JsonApiResult<unknown>> {
  const env = loadServerEnv();
  const origin = env.NEATLY_API_URL.endsWith("/")
    ? env.NEATLY_API_URL.slice(0, -1)
    : env.NEATLY_API_URL;
  const url = path instanceof URL ? path : new URL(path, `${origin}/`);

  try {
    const headers = new Headers({ accept: "application/json" });

    if (sessionToken !== undefined && sessionToken.trim() !== "") {
      headers.set(ADMIN_SESSION_TOKEN_HEADER, sessionToken);
    }

    const response = await fetch(url, {
      cache: "no-store",
      headers,
      signal: AbortSignal.timeout(CLEANER_SESSION_REQUEST_TIMEOUT_MS),
    });

    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return parseJsonApiResponse(response.status, body);
  } catch {
    return jobLoadFailure;
  }
}

function isJobStatus(value: string): value is CleanerJobStatus {
  return (CLEANER_JOB_STATUSES as readonly string[]).includes(value);
}

function isJobWindow(value: string): value is CleanerJobWindow {
  return (CLEANER_JOB_WINDOWS as readonly string[]).includes(value);
}

function readSearchParam(searchParams: SearchParamsInput, key: string): string {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}
