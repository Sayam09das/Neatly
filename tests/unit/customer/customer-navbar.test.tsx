/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CustomerAppChrome } from "@/components/customer/customer-app-chrome";
import { CustomerNavbar } from "@/components/customer/customer-navbar";
import {
  CUSTOMER_PATHS,
  customerNavbarCopy,
  customerShellCopy,
} from "@/config/customer";
import { signOutCustomer } from "@/lib/customer/session";

const { useActivePathname } = vi.hoisted(() => ({
  useActivePathname: vi.fn((): string => "/dashboard"),
}));

vi.mock("@/components/layout/navbar/use-active-pathname", () => ({
  useActivePathname,
}));

vi.mock("@/lib/customer/session", () => ({
  signOutCustomer: vi.fn(),
}));

const identity = {
  email: "ada@neatly.example",
  name: "Ada",
};

describe("CustomerAppChrome", (): void => {
  it("marks the exact dashboard route and not nested bookings", (): void => {
    useActivePathname.mockReturnValue("/dashboard");
    render(<CustomerAppChrome identity={identity} />);

    expect(
      screen.getAllByRole("link", { name: "Overview" })[0],
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getAllByRole("link", { name: "Bookings" })[0],
    ).not.toHaveAttribute("aria-current");
  });

  it("marks bookings without activating overview", (): void => {
    useActivePathname.mockReturnValue("/dashboard/bookings");
    render(<CustomerAppChrome identity={identity} />);

    expect(
      screen.getAllByRole("link", { name: "Bookings" })[0],
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getAllByRole("link", { name: "Overview" })[0],
    ).not.toHaveAttribute("aria-current");
  });

  it("opens the account menu with real identity and existing logout", async (): Promise<void> => {
    useActivePathname.mockReturnValue("/dashboard");
    const user = userEvent.setup();
    render(<CustomerAppChrome identity={identity} />);

    await user.click(
      screen.getByRole("button", { name: customerNavbarCopy.accountMenuLabel }),
    );

    expect(await screen.findByText(identity.email)).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Profile" })).toHaveAttribute(
      "href",
      CUSTOMER_PATHS.profile,
    );
    expect(screen.getByRole("menuitem", { name: "Settings" })).toHaveAttribute(
      "href",
      CUSTOMER_PATHS.settings,
    );
    expect(
      screen.queryByRole("menuitem", { name: "Notifications" }),
    ).toBeNull();

    await user.click(
      screen.getByRole("menuitem", { name: customerShellCopy.logoutLabel }),
    );
    expect(signOutCustomer).toHaveBeenCalledTimes(1);
  });

  it("does not invent a notification count", (): void => {
    useActivePathname.mockReturnValue("/dashboard");
    render(<CustomerAppChrome identity={identity} />);

    expect(screen.queryByText("3")).not.toBeInTheDocument();
    const notificationLinks = screen.getAllByRole("link", {
      name: customerNavbarCopy.notificationsLabel,
    });
    expect(notificationLinks.length).toBeGreaterThan(0);
    for (const link of notificationLinks) {
      expect(link).toHaveAttribute("href", CUSTOMER_PATHS.notifications);
    }
  });
});

describe("CustomerNavbar", (): void => {
  it("opens an accessible mobile menu that closes on Escape", async (): Promise<void> => {
    useActivePathname.mockReturnValue("/dashboard");
    const user = userEvent.setup();
    render(<CustomerNavbar identity={identity} />);

    const trigger = screen.getByRole("button", {
      name: customerNavbarCopy.menuOpenLabel,
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "href",
      CUSTOMER_PATHS.dashboard,
    );

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
