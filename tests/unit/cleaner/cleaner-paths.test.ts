import { describe, expect, it } from "vitest";
import {
  CLEANER_ACTIVATE_PATH,
  CLEANER_API_PATHS,
  CLEANER_API_PREFIX,
  CLEANER_HOME_PATH,
  CLEANER_PATHS,
  cleanerJobPath,
} from "@/config/cleaner";
import {
  cleanerAccountMenuItems,
  cleanerAppNavigation,
  getCleanerNavItems,
  getCleanerPageTitle,
  getVisibleCleanerNavItems,
  isCleanerNavItemActive,
} from "@/config/cleaner-nav";
import { assertCleanerRequestPath } from "@/lib/cleaner/request";

describe("cleaner paths", (): void => {
  it("centralizes cleaner routes without identity query params", (): void => {
    expect(CLEANER_PATHS.home).toBe(CLEANER_HOME_PATH);
    expect(CLEANER_PATHS.dashboard).toBe("/cleaner/dashboard");
    expect(CLEANER_PATHS.jobs).toBe("/cleaner/jobs");
    expect(CLEANER_PATHS.schedule).toBe("/cleaner/schedule");
    expect(CLEANER_PATHS.availability).toBe("/cleaner/availability");
    expect(CLEANER_PATHS.earnings).toBe("/cleaner/earnings");
    expect(CLEANER_PATHS.profile).toBe("/cleaner/profile");
    expect(CLEANER_PATHS.settings).toBe("/cleaner/settings");
    expect(CLEANER_PATHS.notifications).toBe("/cleaner/notifications");
    expect(CLEANER_PATHS.reviews).toBe("/cleaner/reviews");
    expect(CLEANER_PATHS.help).toBe("/cleaner/help");
    expect(cleanerJobPath("job_1")).toBe("/cleaner/jobs/job_1");
    expect(CLEANER_API_PATHS.dashboard).toBe(`${CLEANER_API_PREFIX}/dashboard`);
    expect(CLEANER_API_PATHS.jobs).toBe(`${CLEANER_API_PREFIX}/jobs`);
    expect(CLEANER_API_PATHS.jobStart).toBe(
      `${CLEANER_API_PREFIX}/jobs/:id/start`,
    );
    expect(CLEANER_API_PATHS.jobComplete).toBe(
      `${CLEANER_API_PREFIX}/jobs/:id/complete`,
    );
    expect(CLEANER_API_PATHS.schedule).toBe(`${CLEANER_API_PREFIX}/schedule`);
    expect(CLEANER_API_PATHS.availability).toBe(
      `${CLEANER_API_PREFIX}/availability`,
    );
    expect(CLEANER_API_PATHS.me).toBe(`${CLEANER_API_PREFIX}/me`);
    expect(CLEANER_API_PATHS.activate).toBe(`${CLEANER_API_PREFIX}/activate`);
    expect(CLEANER_ACTIVATE_PATH).toBe("/cleaner/activate");
    expect(JSON.stringify(CLEANER_API_PATHS)).not.toContain("cleanerId");
    expect(JSON.stringify(CLEANER_API_PATHS)).not.toContain("userId=");
    expect(() => {
      assertCleanerRequestPath(`${CLEANER_API_PATHS.me}?userId=user_2`);
    }).toThrow(/session/);
  });
});

describe("cleaner navigation config", (): void => {
  it("covers cleaner workspace sections without dummy labels or reserved modules", (): void => {
    expect(getCleanerNavItems().map((item) => item.href)).toEqual([
      CLEANER_PATHS.dashboard,
      CLEANER_PATHS.jobs,
      CLEANER_PATHS.schedule,
      CLEANER_PATHS.availability,
      CLEANER_PATHS.notifications,
      CLEANER_PATHS.profile,
      CLEANER_PATHS.settings,
      CLEANER_PATHS.help,
    ]);
    expect(cleanerAppNavigation.some((item) => /\d/.test(item.label))).toBe(
      false,
    );
    expect(cleanerAppNavigation.map((item) => item.label)).not.toContain(
      "Earnings",
    );
    expect(cleanerAppNavigation.map((item) => item.label)).not.toContain(
      "Reviews",
    );
    expect(cleanerAccountMenuItems.map((item) => item.href)).toEqual([
      CLEANER_PATHS.profile,
      CLEANER_PATHS.settings,
    ]);
    expect(isCleanerNavItemActive("/cleaner", CLEANER_PATHS.dashboard)).toBe(
      true,
    );
    expect(
      isCleanerNavItemActive("/cleaner/dashboard", CLEANER_PATHS.dashboard),
    ).toBe(true);
    expect(
      isCleanerNavItemActive("/cleaner/jobs", CLEANER_PATHS.dashboard),
    ).toBe(false);
    expect(
      isCleanerNavItemActive("/cleaner/jobs/job_1", CLEANER_PATHS.jobs),
    ).toBe(true);
    expect(getCleanerPageTitle("/cleaner/jobs")).toBe("Jobs");
    expect(getCleanerPageTitle("/cleaner/dashboard")).toBe("Dashboard");
    expect(getVisibleCleanerNavItems().map((item) => item.href)).toEqual([
      CLEANER_PATHS.dashboard,
      CLEANER_PATHS.jobs,
      CLEANER_PATHS.schedule,
      CLEANER_PATHS.availability,
      CLEANER_PATHS.notifications,
      CLEANER_PATHS.profile,
      CLEANER_PATHS.settings,
      CLEANER_PATHS.help,
    ]);
  });
});
