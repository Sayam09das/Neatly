/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CleanerSidebar } from "@/components/cleaner/cleaner-sidebar";
import {
  CLEANER_PATHS,
  cleanerShellCopy,
  cleanerSidebarCopy,
} from "@/config/cleaner";
import { getCleanerNavItems } from "@/config/cleaner-nav";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/cleaner/dashboard",
}));

const identity = {
  email: "mia@neatly.example",
  name: "Mia Cleaner",
};

describe("CleanerSidebar", (): void => {
  it("marks the matching item with aria-current and keeps nested jobs active", (): void => {
    const { rerender } = render(
      <CleanerSidebar
        identity={identity}
        onLogout={(): void => undefined}
        pathname="/cleaner/jobs/job_1"
      />,
    );

    expect(screen.getByRole("link", { name: "Jobs" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute(
      "aria-current",
    );

    rerender(
      <CleanerSidebar
        identity={identity}
        onLogout={(): void => undefined}
        pathname={CLEANER_PATHS.dashboard}
      />,
    );

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Jobs" })).not.toHaveAttribute(
      "aria-current",
    );

    rerender(
      <CleanerSidebar
        identity={identity}
        onLogout={(): void => undefined}
        pathname={CLEANER_PATHS.help}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Help & Support" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("exposes icon-only labels to assistive tech when collapsed", (): void => {
    render(
      <CleanerSidebar
        collapsed
        identity={identity}
        onLogout={(): void => undefined}
        pathname={CLEANER_PATHS.schedule}
      />,
    );

    for (const item of getCleanerNavItems()) {
      expect(
        screen.getByRole("link", { name: item.label }),
      ).toBeInTheDocument();
    }

    expect(
      screen.getByRole("button", { name: cleanerShellCopy.logoutLabel }),
    ).toBeInTheDocument();
  });

  it("toggles collapse without inventing a notification count", async (): Promise<void> => {
    const user = userEvent.setup();
    const onToggleCollapsed = vi.fn();

    render(
      <CleanerSidebar
        collapsed={false}
        identity={identity}
        onLogout={(): void => undefined}
        onToggleCollapsed={onToggleCollapsed}
        pathname={CLEANER_PATHS.dashboard}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: cleanerSidebarCopy.collapseLabel }),
    );
    expect(onToggleCollapsed).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("3")).not.toBeInTheDocument();
  });
});
