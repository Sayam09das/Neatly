/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CustomerShell } from "@/components/customer/customer-shell";
import {
  CustomerBookingsEmptyState,
  CustomerErrorState,
  CustomerLoadingState,
  CustomerPageState,
  CustomerResourceUnavailableState,
} from "@/components/customer/customer-states";
import {
  CUSTOMER_HOME_PATH,
  CUSTOMER_MAIN_CONTENT_ID,
  customerEmptyCopy,
  customerErrorCopy,
  customerNotFoundCopy,
  customerShellCopy,
} from "@/config/customer";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/dashboard",
}));

describe("CustomerShell", (): void => {
  it("renders landmarks, skip link, and account navigation without business records", (): void => {
    render(
      <CustomerShell>
        <h1>Your account</h1>
      </CustomerShell>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", {
        name: customerShellCopy.navigationLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("main", { name: customerShellCopy.mainLabel }),
    ).toHaveAttribute("id", CUSTOMER_MAIN_CONTENT_ID);
    expect(
      screen.getByRole("link", { name: customerShellCopy.skipToContent }),
    ).toHaveAttribute("href", `#${CUSTOMER_MAIN_CONTENT_ID}`);
    expect(
      screen.getByRole("link", { name: customerShellCopy.brandLabel }),
    ).toHaveAttribute("href", CUSTOMER_HOME_PATH);
    expect(
      screen.getByRole("button", { name: customerShellCopy.logoutLabel }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/booking_#/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
  });
});

describe("customer UI states", (): void => {
  it("renders loading, empty, error, and unavailable states without fake records", (): void => {
    const { unmount } = render(<CustomerLoadingState variant="list" />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(
      screen.getByText(customerShellCopy.loadingLabel),
    ).toBeInTheDocument();
    unmount();

    render(<CustomerBookingsEmptyState />);
    expect(
      screen.getByRole("heading", { name: customerEmptyCopy.bookings.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(customerEmptyCopy.bookings.description),
    ).toBeInTheDocument();
  });

  it("keeps error and not-found copy free of internals", (): void => {
    render(<CustomerErrorState />);
    expect(
      screen.getByRole("heading", { name: customerErrorCopy.heading }),
    ).toBeInTheDocument();
    expect(screen.queryByText("prisma")).not.toBeInTheDocument();

    render(<CustomerResourceUnavailableState />);
    expect(
      screen.getByRole("heading", { name: customerNotFoundCopy.heading }),
    ).toBeInTheDocument();
    expect(screen.queryByText("does not exist")).not.toBeInTheDocument();
  });

  it("switches on the shared presentation model", (): void => {
    render(
      <CustomerPageState presentation={{ data: "ok", status: "success" }}>
        {(data) => <p>{data}</p>}
      </CustomerPageState>,
    );

    expect(screen.getByText("ok")).toBeInTheDocument();
  });
});
