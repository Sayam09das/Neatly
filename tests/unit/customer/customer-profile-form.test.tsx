/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CustomerProfileForm } from "@/components/customer/profile/customer-profile";
import { customerProfileCopy } from "@/config/customer";
import type { CustomerProfile } from "@/types/customer";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/dashboard/profile",
  useSearchParams: (): URLSearchParams => new URLSearchParams(),
}));

vi.mock("@/lib/customer/refresh", () => ({
  useCustomerRefresh: (): (() => void) => (): void => undefined,
}));

const profile: CustomerProfile = {
  address: "12 Harbour Street",
  email: "ada@neatly.example",
  id: "customer_1",
  name: "Ada Lovelace",
  phone: "5551234567",
  status: "ACTIVE",
};

describe("CustomerProfileForm", (): void => {
  it("shows real profile fields and keeps email read-only", (): void => {
    render(<CustomerProfileForm profile={profile} />);

    expect(
      screen.getByRole("heading", { name: customerProfileCopy.heading }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(customerProfileCopy.nameLabel)).toHaveValue(
      profile.name,
    );
    expect(screen.getByLabelText(customerProfileCopy.emailLabel)).toHaveValue(
      profile.email,
    );
    expect(
      screen.getByLabelText(customerProfileCopy.emailLabel),
    ).toBeDisabled();
    expect(screen.getByLabelText(customerProfileCopy.phoneLabel)).toHaveValue(
      profile.phone,
    );
    expect(screen.getByText("AL")).toBeInTheDocument();
  });
});
