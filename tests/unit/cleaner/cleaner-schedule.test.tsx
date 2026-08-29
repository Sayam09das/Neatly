/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CleanerScheduleView } from "@/components/cleaner/schedule/cleaner-schedule";
import {
  CLEANER_PATHS,
  CLEANER_SCHEDULE_DATE_PARAM,
  cleanerJobPath,
  cleanerScheduleCopy,
  cleanerSurfaceCopy,
} from "@/config/cleaner";
import { parseCleanerScheduleSearchParams } from "@/lib/cleaner/jobs";
import {
  addUtcDays,
  isUtcToday,
  parseUtcDateParam,
  toUtcDateParam,
} from "@/lib/cleaner/schedule";
import type { CleanerJob, CleanerSchedule } from "@/types/cleaner";

const today = toUtcDateParam(new Date());
const previous = toUtcDateParam(
  addUtcDays(parseUtcDateParam(today) ?? new Date(), -1),
);
const next = toUtcDateParam(
  addUtcDays(parseUtcDateParam(today) ?? new Date(), 1),
);

const job: CleanerJob = {
  actions: { canComplete: false, canStart: true },
  customerName: "Ada",
  id: "booking_own_1",
  scheduledAt: `${today}T09:00:00.000Z`,
  service: { id: "service_1", name: "Home Refresh" },
  serviceAddress: "12 Harbour Street",
  status: "ASSIGNED",
  updatedAt: `${today}T08:00:00.000Z`,
};

function emptyWeek(date: string): CleanerSchedule["week"] {
  const selected = parseUtcDateParam(date) ?? new Date();
  const weekday = selected.getUTCDay();
  const start = addUtcDays(selected, weekday === 0 ? -6 : 1 - weekday);
  return Array.from({ length: 7 }, (_, index) => ({
    date: toUtcDateParam(addUtcDays(start, index)),
    jobCount: 0,
  }));
}

describe("CleanerScheduleView", (): void => {
  it("renders today's jobs and date navigation from backend data", (): void => {
    const schedule: CleanerSchedule = {
      date: today,
      jobs: [job],
      nextJob: job,
      summary: {
        firstStart: job.scheduledAt,
        jobCount: 1,
      },
      week: emptyWeek(today).map((day) =>
        day.date === today ? { ...day, jobCount: 1 } : day,
      ),
    };

    render(<CleanerScheduleView schedule={schedule} />);

    expect(
      screen.getByRole("heading", {
        name: cleanerSurfaceCopy.schedule.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(cleanerScheduleCopy.todayLabel).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Home Refresh").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ada").length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: cleanerScheduleCopy.viewJob })[0],
    ).toHaveAttribute("href", cleanerJobPath(job.id));
    expect(
      screen.getByRole("link", { name: cleanerScheduleCopy.previousDate }),
    ).toHaveAttribute(
      "href",
      `${CLEANER_PATHS.schedule}?${CLEANER_SCHEDULE_DATE_PARAM}=${previous}`,
    );
    expect(
      screen.getByRole("link", { name: cleanerScheduleCopy.nextDate }),
    ).toHaveAttribute(
      "href",
      `${CLEANER_PATHS.schedule}?${CLEANER_SCHEDULE_DATE_PARAM}=${next}`,
    );
    expect(screen.queryByText("11:00")).not.toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("shows distinct empty-day and empty-schedule states", (): void => {
    const emptyDay: CleanerSchedule = {
      date: today,
      jobs: [],
      nextJob: job,
      summary: { firstStart: null, jobCount: 0 },
      week: emptyWeek(today).map((day, index) =>
        index === 1 ? { ...day, jobCount: 1 } : day,
      ),
    };
    const { rerender } = render(<CleanerScheduleView schedule={emptyDay} />);

    expect(
      screen.getByText(cleanerScheduleCopy.emptyDayTitle),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(cleanerScheduleCopy.emptyScheduleTitle),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: cleanerScheduleCopy.viewAllJobs }),
    ).toHaveAttribute("href", CLEANER_PATHS.jobs);

    rerender(
      <CleanerScheduleView
        schedule={{
          date: today,
          jobs: [],
          nextJob: null,
          summary: { firstStart: null, jobCount: 0 },
          week: emptyWeek(today),
        }}
      />,
    );
    expect(
      screen.getByText(cleanerScheduleCopy.emptyScheduleTitle),
    ).toBeInTheDocument();
  });

  it("parses UTC date params without inventing values", (): void => {
    expect(parseCleanerScheduleSearchParams({ date: "2026-08-31" })).toBe(
      "2026-08-31",
    );
    expect(parseCleanerScheduleSearchParams({ date: "not-a-date" })).toBe("");
    expect(isUtcToday("2026-08-31", new Date("2026-08-31T18:00:00.000Z"))).toBe(
      true,
    );
    expect(isUtcToday("2026-08-31", new Date("2026-09-01T00:00:00.000Z"))).toBe(
      false,
    );
  });
});
