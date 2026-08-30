/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CleanerShell } from "@/components/cleaner/cleaner-shell";
import { CleanerErrorState } from "@/components/cleaner/cleaner-states";
import {
  CLEANER_MAIN_CONTENT_ID,
  cleanerErrorCopy,
  cleanerNavbarCopy,
  cleanerShellCopy,
} from "@/config/cleaner";
import { getCleanerNavItems } from "@/config/cleaner-nav";

const { useActivePathname } = vi.hoisted(() => ({
  useActivePathname: vi.fn((): string => "/cleaner/dashboard"),
}));

vi.mock("next/navigation", () => ({
  usePathname: (): string => useActivePathname(),
}));

vi.mock("@/components/layout/navbar/use-active-pathname", () => ({
  useActivePathname,
}));

const shellIdentity = {
  email: "mia@neatly.example",
  name: "Mia Cleaner",
};

const forbiddenNavLabels = [
  "Earnings",
  "Reviews",
  "Services",
  "Apply for Service",
  "Customers",
  "Cleaners",
  "Quotes",
];

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

    for (const item of getCleanerNavItems()) {
      const links = screen.getAllByRole("link", { name: item.label });
      expect(links.length).toBeGreaterThan(0);

      const firstLink = links[0];

      if (firstLink === undefined) {
        throw new Error(`Expected a ${item.label} navigation link.`);
      }

      expect(firstLink).toHaveAttribute("href", item.href);
    }

    const dashboardLinks = screen.getAllByRole("link", { name: "Dashboard" });
    expect(
      dashboardLinks.some(
        (link) => link.getAttribute("aria-current") === "page",
      ),
    ).toBe(true);
    expect(
      screen.getAllByRole("button", { name: cleanerShellCopy.logoutLabel })
        .length,
    ).toBeGreaterThan(0);

    for (const label of forbiddenNavLabels) {
      expect(
        screen.queryByRole("link", { name: label }),
      ).not.toBeInTheDocument();
    }

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
