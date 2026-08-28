/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactElement, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ADMIN_PATHS, getAdminNavItems } from "@/config/admin-nav";
import { adminHeaderCopy, adminSidebarCopy } from "@/config/admin-ui";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin",
}));

describe("AdminSidebar", (): void => {
  it("renders every navigation group and PRD href", (): void => {
    render(<AdminSidebar collapsed={false} pathname={ADMIN_PATHS.quotes} />);

    expect(
      screen.getByRole("navigation", { name: "Admin navigation" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Operations")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();

    for (const item of getAdminNavItems()) {
      const links = screen.getAllByRole("link", { name: item.label });
      expect(links.length).toBeGreaterThan(0);

      for (const link of links) {
        expect(link).toHaveAttribute("href", item.href);
      }
    }

    expect(screen.queryByText("99+")).not.toBeInTheDocument();
    expect(screen.queryByText(/12 Bookings/)).not.toBeInTheDocument();
  });

  it("marks the matching item with aria-current and nested parents stay active", (): void => {
    const { rerender } = render(
      <AdminSidebar collapsed={false} pathname="/admin/quotes/123" />,
    );

    expect(screen.getByRole("link", { name: "Quotes" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute(
      "aria-current",
    );

    rerender(<AdminSidebar collapsed={false} pathname={ADMIN_PATHS.home} />);

    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Quotes" })).not.toHaveAttribute(
      "aria-current",
    );

    rerender(
      <AdminSidebar
        collapsed={false}
        pathname="/admin/bookings/booking_test"
      />,
    );

    expect(screen.getByRole("link", { name: "Bookings" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Quotes" })).not.toHaveAttribute(
      "aria-current",
    );

    rerender(
      <AdminSidebar
        collapsed={false}
        pathname="/admin/customers/customer_test"
      />,
    );

    expect(screen.getByRole("link", { name: "Customers" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Bookings" })).not.toHaveAttribute(
      "aria-current",
    );

    rerender(
      <AdminSidebar
        collapsed={false}
        pathname="/admin/services/service_test"
      />,
    );

    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Customers" })).not.toHaveAttribute(
      "aria-current",
    );

    rerender(
      <AdminSidebar collapsed={false} pathname="/admin/reviews/review_test" />,
    );

    expect(screen.getByRole("link", { name: "Reviews" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Services" })).not.toHaveAttribute(
      "aria-current",
    );

    rerender(
      <AdminSidebar collapsed={false} pathname={ADMIN_PATHS.notifications} />,
    );

    expect(screen.getByRole("link", { name: "Notifications" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Reviews" })).not.toHaveAttribute(
      "aria-current",
    );

    rerender(
      <AdminSidebar collapsed={false} pathname={ADMIN_PATHS.settings} />,
    );

    const settingsLinks = screen.getAllByRole("link", { name: "Settings" });
    expect(
      settingsLinks.some(
        (link) => link.getAttribute("aria-current") === "page",
      ),
    ).toBe(true);
    expect(
      screen.getByRole("link", { name: "Notifications" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("keeps accessible names when collapsed and exposes a tooltip", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminSidebar collapsed pathname={ADMIN_PATHS.home} />);

    const quotes = screen.getByRole("link", { name: "Quotes" });
    expect(quotes).toBeInTheDocument();

    await user.hover(quotes);
    expect(
      await screen.findByRole("tooltip", { name: "Quotes" }),
    ).toBeInTheDocument();
  });

  it("opens the mobile drawer from the header trigger and closes after a link is chosen", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminShell>
        <p>Admin content</p>
      </AdminShell>,
    );

    const trigger = screen.getByRole("button", {
      name: adminHeaderCopy.openNavigationLabel,
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName(adminSidebarCopy.drawerTitle);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const quotesLinks = screen.getAllByRole("link", { name: "Quotes" });
    const drawerQuotes = quotesLinks[0];

    if (drawerQuotes === undefined) {
      throw new Error("Expected a Quotes navigation link in the drawer.");
    }

    await user.click(drawerQuotes);

    await waitFor((): void => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile drawer with Escape and restores trigger focus", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminShell>
        <p>Admin content</p>
      </AdminShell>,
    );

    const trigger = screen.getByRole("button", {
      name: adminHeaderCopy.openNavigationLabel,
    });
    await user.click(trigger);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await waitFor((): void => {
      expect(trigger).toHaveFocus();
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps navigation links keyboard accessible", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminSidebar collapsed={false} pathname={ADMIN_PATHS.home} />);

    screen.getByRole("link", { name: "Overview" }).focus();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("link", { name: "Bookings" })).toHaveFocus();
  });

  it("toggles the desktop collapsed state", async (): Promise<void> => {
    const user = userEvent.setup();

    function CollapseHarness(): ReactElement {
      const [collapsed, setCollapsed] = useState(false);

      return (
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapsed={(): void => {
            setCollapsed((current) => !current);
          }}
          pathname={ADMIN_PATHS.home}
        />
      );
    }

    render(<CollapseHarness />);

    const collapse = screen.getByRole("button", {
      name: adminSidebarCopy.collapseLabel,
    });
    expect(collapse).toHaveAttribute("aria-expanded", "true");
    await user.click(collapse);

    expect(
      screen.getByRole("button", { name: adminSidebarCopy.expandLabel }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("link", { name: "Quotes" })).toBeInTheDocument();
  });
});
