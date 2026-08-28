/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminErrorPage from "@/app/admin/(app)/error";
import AdminAppLayout from "@/app/admin/(app)/layout";
import AdminLoading from "@/app/admin/(app)/loading";
import AdminNotFound from "@/app/admin/(app)/not-found";
import AdminHomePage from "@/app/admin/(app)/page";
import {
  ADMIN_HOME_PATH,
  adminErrorCopy,
  adminHomeCopy,
  adminNotFoundCopy,
  adminShellCopy,
} from "@/config/admin-ui";
import { AUTH_ADMIN_LOGIN_PATH } from "@/config/auth";
import { requireAdminPage } from "@/lib/auth/current-user";
import type { AuthUser } from "@/types/auth";

vi.mock("@/lib/auth/current-user", () => ({
  requireAdminPage: vi.fn(),
}));

const layoutAdmin: AuthUser = {
  email: "admin@neatly.example",
  id: "admin_layout_test",
  lastLoginAt: null,
  name: "Neatly Admin",
  role: "ADMIN",
  status: "ACTIVE",
};

describe("Admin application routes", (): void => {
  it("keeps the existing admin session gate on the app layout", async (): Promise<void> => {
    vi.mocked(requireAdminPage).mockResolvedValue(layoutAdmin);

    const view = await AdminAppLayout({
      children: <p>Protected shell child</p>,
    });

    render(view);

    expect(requireAdminPage).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("main", { name: adminShellCopy.mainLabel }),
    ).toBeInTheDocument();
    expect(screen.getByText("Protected shell child")).toBeInTheDocument();
    expect(screen.queryByText(AUTH_ADMIN_LOGIN_PATH)).not.toBeInTheDocument();
  });

  it("renders the admin home welcome state without dummy metrics", (): void => {
    render(<AdminHomePage />);

    expect(
      screen.getByRole("heading", { name: adminHomeCopy.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminHomeCopy.description)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
  });

  it("renders a stable loading placeholder inside the content region", (): void => {
    render(<AdminLoading />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText(adminShellCopy.loadingLabel)).toBeInTheDocument();
    expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBe(3);
  });

  it("renders a safe error state without implementation details", (): void => {
    const reset = vi.fn();

    render(
      <AdminErrorPage
        error={Object.assign(new Error("internal boom"), { digest: "abc123" })}
        reset={reset}
      />,
    );

    expect(
      screen.getByRole("heading", { name: adminErrorCopy.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminErrorCopy.description)).toBeInTheDocument();
    expect(screen.queryByText("internal boom")).not.toBeInTheDocument();
    expect(screen.queryByText("abc123")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminErrorCopy.action }),
    ).toBeInTheDocument();
  });

  it("renders a clean not-found state that stays inside admin", (): void => {
    render(<AdminNotFound />);

    expect(
      screen.getByRole("heading", { name: adminNotFoundCopy.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: adminNotFoundCopy.action }),
    ).toHaveAttribute("href", ADMIN_HOME_PATH);
  });
});
