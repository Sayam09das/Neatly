/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CleanerShell } from "@/components/cleaner/cleaner-shell";
import { CleanerErrorState } from "@/components/cleaner/cleaner-states";
import {
  CLEANER_MAIN_CONTENT_ID,
  CLEANER_PATHS,
  cleanerErrorCopy,
  cleanerNavbarCopy,
  cleanerShellCopy,
} from "@/config/cleaner";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/cleaner",
}));

const shellIdentity = {
  email: "mia@neatly.example",
  name: "Mia Cleaner",
};

describe("cleaner shell chrome", (): void => {
  it("renders header, sidebar, and landmarks without invented job data", (): void => {
    render(
      <CleanerShell identity={shellIdentity}>
        <h1>Cleaner Dashboard</h1>
      </CleanerShell>,
    );

    expect(
      screen.getByRole("link", { name: cleanerShellCopy.skipToContent }),
    ).toHaveAttribute("href", `#${CLEANER_MAIN_CONTENT_ID}`);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", {
        name: cleanerNavbarCopy.primaryNavigationLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("main", { name: cleanerShellCopy.mainLabel }),
    ).toHaveAttribute("id", CLEANER_MAIN_CONTENT_ID);
    expect(
      screen.getAllByRole("link", { name: "Overview" })[0],
    ).toHaveAttribute("href", CLEANER_PATHS.home);
    expect(screen.getAllByRole("link", { name: "Jobs" })[0]).toHaveAttribute(
      "href",
      CLEANER_PATHS.jobs,
    );
    expect(
      screen.getAllByRole("link", { name: "Schedule" })[0],
    ).toHaveAttribute("href", CLEANER_PATHS.schedule);
    expect(
      screen.getAllByRole("link", { name: "Availability" })[0],
    ).toHaveAttribute("href", CLEANER_PATHS.availability);
    expect(
      screen.queryByRole("link", { name: "Earnings" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: cleanerNavbarCopy.menuOpenLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: cleanerNavbarCopy.notificationsLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: cleanerNavbarCopy.accountMenuLabel }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Mia Cleaner").length).toBeGreaterThan(0);
    expect(screen.queryByText("3")).not.toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
  });
});

describe("cleaner UI states", (): void => {
  it("renders a retryable error state", (): void => {
    render(<CleanerErrorState onRetry={(): void => undefined} />);

    expect(
      screen.getByRole("heading", { name: cleanerErrorCopy.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: cleanerErrorCopy.action }),
    ).toBeInTheDocument();
  });
});
