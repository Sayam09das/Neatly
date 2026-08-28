/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  ADMIN_HOME_PATH,
  ADMIN_MAIN_CONTENT_ID,
  adminHomeCopy,
  adminShellCopy,
} from "@/config/admin-ui";

const DUMMY_DASHBOARD_COPY = [
  "revenue",
  "bookings",
  "customers",
  "cleaners",
  "statistics",
];

function getSlot(name: string): HTMLElement {
  const node = document.querySelector(`[data-slot="${name}"]`);

  if (!(node instanceof HTMLElement)) {
    throw new Error(`Missing admin slot: ${name}`);
  }

  return node;
}

describe("AdminShell", (): void => {
  it("renders header, sidebar, and main landmarks without dashboard data", (): void => {
    render(
      <AdminShell>
        <h1>{adminHomeCopy.heading}</h1>
      </AdminShell>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("complementary", {
        name: adminShellCopy.navigationLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("main", { name: adminShellCopy.mainLabel }),
    ).toHaveAttribute("id", ADMIN_MAIN_CONTENT_ID);
    expect(
      screen.getByRole("link", { name: adminShellCopy.skipToContent }),
    ).toHaveAttribute("href", `#${ADMIN_MAIN_CONTENT_ID}`);
    expect(
      screen.getByRole("link", { name: adminShellCopy.brandLabel }),
    ).toHaveAttribute("href", ADMIN_HOME_PATH);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

    const markup = document.body.textContent ?? "";

    for (const phrase of DUMMY_DASHBOARD_COPY) {
      expect(markup.toLowerCase()).not.toContain(phrase);
    }
  });

  it("keeps the sidebar off the permanent mobile viewport and scrolls only the main pane", (): void => {
    render(
      <AdminShell>
        <p>Shell content</p>
      </AdminShell>,
    );

    const shell = getSlot("admin-shell");
    const sidebar = getSlot("admin-sidebar");
    const main = getSlot("admin-main");

    expect(shell).toHaveAttribute("data-lenis-prevent");
    expect(shell.className).toContain("overflow-hidden");
    expect(sidebar.className).toContain("hidden");
    expect(sidebar.className).toContain("lg:flex");
    expect(sidebar.className).toContain("overflow-x-hidden");
    expect(main.className).toContain("overflow-x-hidden");
    expect(main.className).toContain("overflow-y-auto");
    expect(getSlot("admin-header")).toBeInTheDocument();
  });
});
