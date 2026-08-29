/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CustomerSettings } from "@/components/customer/settings/customer-settings";
import { customerSettingsCopy } from "@/config/customer";
import type { CustomerAccount } from "@/types/customer";

vi.mock("@/lib/customer/refresh", () => ({
  useCustomerRefresh: (): (() => void) => (): void => undefined,
}));

const account: CustomerAccount = {
  email: "ada@neatly.example",
  emailVerified: true,
  sessions: [
    {
      createdAt: "2026-08-29T10:00:00.000Z",
      current: true,
      expiresAt: "2026-09-05T10:00:00.000Z",
      id: "session-current",
    },
  ],
  status: "ACTIVE",
};

describe("CustomerSettings", (): void => {
  it("shows account security fields and keeps email read-only", (): void => {
    render(<CustomerSettings account={account} />);

    expect(
      screen.getByRole("heading", { name: customerSettingsCopy.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(account.email)).toBeInTheDocument();
    expect(
      screen.getByText(customerSettingsCopy.emailReadOnly),
    ).toBeInTheDocument();
    expect(screen.getByText(account.status)).toBeInTheDocument();
    expect(screen.getByText(customerSettingsCopy.verified)).toBeInTheDocument();
    expect(
      screen.getByLabelText(customerSettingsCopy.currentPasswordLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: customerSettingsCopy.logoutAllAction,
      }),
    ).toBeInTheDocument();
  });
});
