/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Navbar } from "@/components/layout/navbar";
import { AUTH_ADMIN_HOME_PATH } from "@/config/auth";
import {
  CUSTOMER_LOGIN_PATH,
  CUSTOMER_PATHS,
  customerNavbarCopy,
} from "@/config/customer";
import { landingNavLinks, navbarCta } from "@/config/landing";

const { useActivePathname } = vi.hoisted(() => ({
  useActivePathname: vi.fn((): string => "/"),
}));

vi.mock("@/components/layout/navbar/use-active-pathname", () => ({
  useActivePathname,
}));

describe("Navbar", (): void => {
  beforeEach((): void => {
    useActivePathname.mockReturnValue("/");
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });
  });

  it("renders the logo, PRD links, and quote CTA", (): void => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: "Neatly home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();

    for (const item of landingNavLinks) {
      const links = screen.getAllByRole("link", { name: item.label });
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveAttribute("href", item.href);
    }

    const cta = screen.getAllByRole("link", { name: navbarCta.label });
    expect(cta[0]).toHaveAttribute("href", navbarCta.href);
    expect(
      screen.getAllByRole("link", { name: customerNavbarCopy.loginLabel })[0],
    ).toHaveAttribute("href", CUSTOMER_LOGIN_PATH);
    expect(screen.queryByText("+123 456 789 0")).not.toBeInTheDocument();
    expect(screen.queryByText("3")).not.toBeInTheDocument();
  });

  it("exposes an accessible menu button and opens a closeable sheet", async (): Promise<void> => {
    const user = userEvent.setup();
    render(<Navbar />);

    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Menu");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toBeInTheDocument();

    for (const item of landingNavLinks) {
      expect(
        screen.getAllByRole("link", { name: item.label }).length,
      ).toBeGreaterThan(0);
    }

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps keyboard focus inside the open menu", async (): Promise<void> => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");

    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("marks nested service routes as the active Services link", (): void => {
    useActivePathname.mockReturnValue("/services/deep-clean");
    render(<Navbar />);

    const services = screen.getAllByRole("link", { name: "Services" })[0];
    const about = screen.getAllByRole("link", { name: "About" })[0];

    expect(services).toHaveAttribute("aria-current", "page");
    expect(about).not.toHaveAttribute("aria-current");
  });

  it("does not mark Home-only paths as nested destinations", (): void => {
    render(<Navbar />);

    for (const item of landingNavLinks) {
      expect(
        screen.getAllByRole("link", { name: item.label })[0],
      ).not.toHaveAttribute("aria-current");
    }
  });

  it("elevates the header after scrolling past the threshold", async (): Promise<void> => {
    render(<Navbar />);
    const header = screen.getByRole("banner");
    expect(header.className).not.toMatch(/backdrop-blur-md/);

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 24,
      writable: true,
    });
    window.dispatchEvent(new Event("scroll"));

    await waitFor((): void => {
      expect(header.className).toMatch(/backdrop-blur-md/);
    });
  });

  it("keeps admin visitors on public navigation without customer account links", (): void => {
    render(
      <Navbar
        session={{
          identity: { email: "ops@neatly.example", name: "Ops" },
          role: "ADMIN",
        }}
      />,
    );

    expect(
      screen.getAllByRole("link", { name: customerNavbarCopy.adminLabel })[0],
    ).toHaveAttribute("href", AUTH_ADMIN_HOME_PATH);
    expect(
      screen.queryByRole("link", { name: customerNavbarCopy.loginLabel }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: customerNavbarCopy.notificationsLabel,
      }),
    ).not.toBeInTheDocument();
  });

  it("exposes customer account actions for a non-admin public session", (): void => {
    render(
      <Navbar
        session={{
          identity: { email: "ada@neatly.example", name: "Ada" },
          role: "CUSTOMER",
        }}
      />,
    );

    expect(
      screen.getAllByRole("link", { name: "Overview" })[0],
    ).toHaveAttribute("href", CUSTOMER_PATHS.dashboard);
    expect(
      screen.queryByRole("link", {
        name: customerNavbarCopy.notificationsLabel,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: customerNavbarCopy.adminLabel }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("3")).not.toBeInTheDocument();
  });
});
