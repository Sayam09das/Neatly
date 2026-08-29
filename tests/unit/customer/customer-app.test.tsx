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
  customerDashboardCopy,
  customerErrorCopy,
  customerNotFoundCopy,
  customerShellCopy,
} from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";
import { loadCustomerOverview } from "@/lib/customer/booking";
import { readCustomerSessionToken } from "@/lib/customer/session-token";
import type { AuthUser } from "@/types/auth";
import type { CustomerOverview } from "@/types/customer";

vi.mock("@/lib/auth/current-user", () => ({
  requireCustomerPage: vi.fn(),
}));

vi.mock("@/lib/customer/booking", () => ({
  loadCustomerOverview: vi.fn(),
}));

vi.mock("@/lib/customer/session-token", () => ({
  readCustomerSessionToken: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  usePathname: (): string => "/dashboard",
  useRouter: (): { refresh: () => void } => ({ refresh: vi.fn() }),
}));

vi.mock("@/components/customer/customer-realtime-provider", () => ({
  CustomerRealtimeProvider: ({ children }: { children: unknown }): unknown =>
    children,
  useOptionalCustomerRealtime: (): null => null,
}));

const layoutUser: AuthUser = {
  email: "ada@neatly.example",
  id: "customer_layout_test",
  lastLoginAt: null,
  name: "Ada",
  role: "STAFF",
  status: "ACTIVE",
};

const emptyOverview: CustomerOverview = {
  recentBookings: [],
  summary: {
    completed: 0,
    pending: 0,
    total: 0,
    upcoming: 0,
  },
  upcomingBooking: null,
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
    expect(screen.getAllByText(layoutUser.name).length).toBeGreaterThan(0);
    expect(screen.queryByText(layoutUser.id)).not.toBeInTheDocument();
    expect(screen.queryByText(AUTH_LOGIN_ALIAS_PATH)).not.toBeInTheDocument();
  });

  it("renders the overview from real session data without mock bookings", async (): Promise<void> => {
    vi.mocked(requireCustomerPage).mockResolvedValue(layoutUser);
    vi.mocked(readCustomerSessionToken).mockResolvedValue("session-token");
    vi.mocked(loadCustomerOverview).mockResolvedValue({
      ok: true,
      overview: emptyOverview,
    });

    const view = await CustomerDashboardPage();
    render(view);

    expect(
      screen.getByRole("heading", { name: "Welcome, Ada" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(customerDashboardCopy.nextBookingEmptyTitle),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
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
