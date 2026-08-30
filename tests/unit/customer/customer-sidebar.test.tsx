/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CustomerSidebar } from "@/components/customer/customer-sidebar";
import {
  CUSTOMER_PATHS,
  customerNavbarCopy,
  customerShellCopy,
  customerSidebarCopy,
} from "@/config/customer";
import {
  CUSTOMER_NAV_GROUP_LABELS,
  getCustomerNavItems,
} from "@/config/customer-nav";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/dashboard",
}));

const identity = {
  email: "ada@neatly.example",
  name: "Ada Lovelace",
};

describe("CustomerSidebar", (): void => {
  it("renders the requested groups and marks the matching item", (): void => {
    const { rerender } = render(
      <CustomerSidebar
        identity={identity}
        onLogout={(): void => undefined}
        pathname="/dashboard/bookings/booking_1"
      />,
    );

    expect(screen.getByText(CUSTOMER_NAV_GROUP_LABELS.overview)).toBeVisible();
    expect(screen.getByText(CUSTOMER_NAV_GROUP_LABELS.booking)).toBeVisible();
    expect(screen.getByText(CUSTOMER_NAV_GROUP_LABELS.account)).toBeVisible();
    expect(screen.getByText(CUSTOMER_NAV_GROUP_LABELS.support)).toBeVisible();
    expect(
      screen.getAllByText(customerShellCopy.workspaceLabel).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(customerNavbarCopy.roleLabel).length,
    ).toBeGreaterThan(0);

    expect(screen.getByRole("link", { name: "My Bookings" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(
      screen.queryByRole("link", { name: "Reviews" }),
    ).not.toBeInTheDocument();

    rerender(
      <CustomerSidebar
        identity={identity}
        onLogout={(): void => undefined}
        pathname={CUSTOMER_PATHS.dashboard}
      />,
    );

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "My Bookings" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("exposes icon-only labels to assistive tech when collapsed", (): void => {
    render(
      <CustomerSidebar
        collapsed
        identity={identity}
        onLogout={(): void => undefined}
        pathname={CUSTOMER_PATHS.quotes}
      />,
    );

    for (const item of getCustomerNavItems()) {
      expect(
        screen.getByRole("link", { name: item.label }),
      ).toBeInTheDocument();
    }

    expect(
      screen.getByRole("button", { name: customerShellCopy.logoutLabel }),
    ).toBeInTheDocument();
  });

  it("toggles collapse without inventing a notification count", async (): Promise<void> => {
    const user = userEvent.setup();
    const onToggleCollapsed = vi.fn();

    render(
      <CustomerSidebar
        collapsed={false}
        identity={identity}
        onLogout={(): void => undefined}
        onToggleCollapsed={onToggleCollapsed}
        pathname={CUSTOMER_PATHS.dashboard}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: customerSidebarCopy.collapseLabel }),
    );
    expect(onToggleCollapsed).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("3")).not.toBeInTheDocument();
  });
});
