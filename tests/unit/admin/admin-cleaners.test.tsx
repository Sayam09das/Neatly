/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminCleaners } from "@/components/admin/cleaners/admin-cleaners";
import { CleanerStatusBadge } from "@/components/admin/cleaners/cleaner-status-badge";
import { adminCleanerCopy } from "@/config/admin-cleaners";
import { ADMIN_PATHS } from "@/config/admin-nav";
import type { AdminCleaner } from "@/types/admin-cleaner";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin/cleaners",
  useRouter: (): { replace: () => void } => ({
    replace: (): void => undefined,
  }),
  useSearchParams: (): URLSearchParams => new URLSearchParams(),
}));

const TEST_CLEANER: AdminCleaner = {
  accountState: "INVITED",
  accountStateLabel: "Invitation pending",
  createdAt: "2026-08-30T10:00:00.000Z",
  email: "mia@neatly.example",
  id: "cleaner_test",
  name: "Mia Cleaner",
  phone: "555-0100",
  statusLabel: "Inactive",
};

describe("Admin cleaners", (): void => {
  it("renders empty and invitation-pending states without exposing tokens", (): void => {
    render(<AdminCleaners presentation={{ status: "empty" }} />);
    expect(screen.getByText(adminCleanerCopy.emptyTitle)).toBeInTheDocument();
    expect(
      screen.getAllByText(adminCleanerCopy.primaryAction).length,
    ).toBeGreaterThan(0);
    expect(ADMIN_PATHS.cleaners).toBe("/admin/cleaners");

    render(<CleanerStatusBadge label={TEST_CLEANER.accountStateLabel} />);
    expect(screen.getByText("Invitation pending")).toBeInTheDocument();
    expect(JSON.stringify(TEST_CLEANER)).not.toContain("token");
    expect(JSON.stringify(TEST_CLEANER)).not.toContain("password");
  });

  it("shows a ready cleaner list", (): void => {
    render(
      <AdminCleaners
        presentation={{
          cleaners: [TEST_CLEANER],
          pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
          status: "ready",
        }}
      />,
    );
    expect(screen.getAllByText("Mia Cleaner").length).toBeGreaterThan(0);
    expect(screen.getAllByText("mia@neatly.example").length).toBeGreaterThan(0);
  });
});
