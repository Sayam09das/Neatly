/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CustomerErrorPage from "@/app/dashboard/error";
import CustomerAppLayout from "@/app/dashboard/layout";
import CustomerLoading from "@/app/dashboard/loading";
import CustomerNotFound from "@/app/dashboard/not-found";
import CustomerDashboardPage from "@/app/dashboard/page";
import { AUTH_LOGIN_ALIAS_PATH } from "@/config/auth";
import {
  customerErrorCopy,
  customerNotFoundCopy,
  customerShellCopy,
  customerSurfaceCopy,
} from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";
import type { AuthUser } from "@/types/auth";

vi.mock("@/lib/auth/current-user", () => ({
  requireCustomerPage: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/dashboard",
}));

const layoutUser: AuthUser = {
  email: "ada@neatly.example",
  id: "customer_layout_test",
  lastLoginAt: null,
  name: "Ada",
  role: "STAFF",
  status: "ACTIVE",
};

describe("Customer application routes", (): void => {
  it("keeps the existing session gate on the customer layout", async (): Promise<void> => {
    vi.mocked(requireCustomerPage).mockResolvedValue(layoutUser);

    const view = await CustomerAppLayout({
      children: <p>Protected account child</p>,
    });

    render(view);

    expect(requireCustomerPage).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("main", { name: customerShellCopy.mainLabel }),
    ).toBeInTheDocument();
    expect(screen.getByText("Protected account child")).toBeInTheDocument();
    expect(screen.queryByText(AUTH_LOGIN_ALIAS_PATH)).not.toBeInTheDocument();
  });

  it("renders the account foundation without mock bookings or metrics", (): void => {
    render(<CustomerDashboardPage />);

    expect(
      screen.getByRole("heading", {
        name: customerSurfaceCopy.dashboard.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(customerSurfaceCopy.dashboard.description),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
  });

  it("renders loading, error, and not-found foundations", (): void => {
    const loading = render(<CustomerLoading />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    loading.unmount();

    const errorView = render(
      <CustomerErrorPage
        error={Object.assign(new Error("stack leak"), { digest: "d1" })}
        reset={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("heading", { name: customerErrorCopy.heading }),
    ).toBeInTheDocument();
    expect(screen.queryByText("stack leak")).not.toBeInTheDocument();
    errorView.unmount();

    render(<CustomerNotFound />);
    expect(
      screen.getByRole("heading", { name: customerNotFoundCopy.heading }),
    ).toBeInTheDocument();
  });
});
