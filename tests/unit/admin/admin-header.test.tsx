/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AdminHeader } from "@/components/admin/admin-header";
import { ADMIN_HOME_PATH, adminHeaderCopy } from "@/config/admin-ui";

describe("AdminHeader", (): void => {
  it("renders the title, breadcrumbs, and action slot", (): void => {
    render(
      <AdminHeader
        actions={<button type="button">Page action</button>}
        breadcrumbs={[
          { href: ADMIN_HOME_PATH, label: adminHeaderCopy.homeBreadcrumb },
        ]}
        title={adminHeaderCopy.homeTitle}
      />,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText(adminHeaderCopy.homeTitle)).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: adminHeaderCopy.breadcrumbLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: adminHeaderCopy.homeBreadcrumb }),
    ).toHaveAttribute("href", ADMIN_HOME_PATH);
    expect(
      screen.getByRole("button", { name: "Page action" }),
    ).toBeInTheDocument();
  });

  it("exposes accessible icon actions without fake notification counts", (): void => {
    render(<AdminHeader title={adminHeaderCopy.homeTitle} />);

    const notifications = screen.getByRole("link", {
      name: adminHeaderCopy.notificationsLabel,
    });
    const navigation = screen.getByRole("button", {
      name: adminHeaderCopy.openNavigationLabel,
    });

    expect(notifications).toBeInTheDocument();
    expect(notifications).toHaveAttribute("href", "/admin/notifications");
    expect(navigation).toBeInTheDocument();
    expect(navigation.className).toContain("lg:hidden");
    expect(notifications.textContent).not.toMatch(/\d/);
    expect(screen.queryByText("99+")).not.toBeInTheDocument();
    expect(screen.queryByText("12")).not.toBeInTheDocument();
    expect(screen.queryByText("5")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminHeaderCopy.accountMenuLabel }),
    ).toBeInTheDocument();
  });

  it("opens the account menu without calling logout APIs", async (): Promise<void> => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<AdminHeader />);

    await user.click(
      screen.getByRole("button", { name: adminHeaderCopy.accountMenuLabel }),
    );

    expect(
      await screen.findByRole("menuitem", {
        name: adminHeaderCopy.profileItem,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: adminHeaderCopy.settingsItem }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: adminHeaderCopy.logoutItem }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("menuitem", { name: adminHeaderCopy.logoutItem }),
    );
    await waitFor((): void => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("keeps the header from overflowing the viewport row", (): void => {
    const { container } = render(
      <AdminHeader
        breadcrumbs={[
          { href: ADMIN_HOME_PATH, label: adminHeaderCopy.homeBreadcrumb },
        ]}
        title={adminHeaderCopy.homeTitle}
      />,
    );

    const header = container.querySelector('[data-slot="admin-header"]');
    expect(header).toBeInstanceOf(HTMLElement);
    expect(header?.className).toContain("min-w-0");
    expect(
      container.querySelector('[data-slot="admin-mobile-nav-trigger"]')
        ?.className,
    ).toContain("lg:hidden");
  });
});
