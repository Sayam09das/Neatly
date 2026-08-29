/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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

describe("CustomerNavbar", (): void => {
  it("marks the exact dashboard route and not nested bookings", (): void => {
    useActivePathname.mockReturnValue("/dashboard");
    render(<CustomerNavbar identity={identity} />);

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Bookings" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("marks bookings without activating dashboard", (): void => {
    useActivePathname.mockReturnValue("/dashboard/bookings");
    render(<CustomerNavbar identity={identity} />);

    expect(screen.getByRole("link", { name: "Bookings" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("opens the account menu with safe identity and logout", async (): Promise<void> => {
    useActivePathname.mockReturnValue("/dashboard");
    const user = userEvent.setup();
    render(<CustomerNavbar identity={identity} />);

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
      screen.getByRole("menuitem", { name: "Notifications" }),
    ).toHaveAttribute("href", CUSTOMER_PATHS.notifications);

    await user.click(
      screen.getByRole("menuitem", { name: customerShellCopy.logoutLabel }),
    );
    expect(signOutCustomer).toHaveBeenCalledTimes(1);
  });

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

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("does not invent a notification count", (): void => {
    useActivePathname.mockReturnValue("/dashboard");
    render(<CustomerNavbar identity={identity} />);

    expect(screen.queryByText("3")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: customerNavbarCopy.notificationsLabel }),
    ).toBeInTheDocument();
  });
});
