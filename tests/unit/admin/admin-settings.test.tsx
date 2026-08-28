/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import AdminSettingsPage from "@/app/admin/(app)/settings/page";
import { AdminSettings } from "@/components/admin/settings/admin-settings";
import { ADMIN_PATHS } from "@/config/admin-nav";
import { adminSettingsCopy } from "@/config/admin-settings";
import { AUTH_PASSWORD_MIN_LENGTH } from "@/config/auth";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin/settings",
  useSearchParams: (): { get: (key: string) => string | null } => ({
    get: (): string | null => null,
  }),
}));

vi.mock("@/providers/theme-provider", () => ({
  useTheme: (): {
    setTheme: (theme: "dark" | "light" | "system") => void;
    theme: "light";
  } => ({
    setTheme: (): void => undefined,
    theme: "light",
  }),
}));

function renderSettings(ui: ReactElement): ReturnType<typeof render> {
  return render(ui);
}

const FORBIDDEN_FAKE_SETTINGS_COPY = [
  "John Doe",
  "Jane Admin",
  "admin@example.com",
  "555-0100",
  "Saved successfully",
  "Settings saved",
  "Two-factor authentication",
];

describe("Admin settings page", (): void => {
  it("renders the title, navigation, and profile form without fake values", (): void => {
    renderSettings(<AdminSettingsPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminSettingsCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminSettingsCopy.description)).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: adminSettingsCopy.navLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminSettingsCopy.profileTitle }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByLabelText(adminSettingsCopy.nameLabel)).toHaveValue("");
    expect(screen.getByLabelText(adminSettingsCopy.emailLabel)).toHaveValue("");
    expect(
      screen.getByRole("button", { name: adminSettingsCopy.saveLabel }),
    ).toBeDisabled();

    const markup = document.body.textContent ?? "";

    for (const phrase of FORBIDDEN_FAKE_SETTINGS_COPY) {
      expect(markup).not.toContain(phrase);
    }
  });

  it("renders loading and error states", async (): Promise<void> => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = renderSettings(
      <AdminSettings presentation={{ status: "loading" }} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByText(adminSettingsCopy.loadingLabel),
    ).toBeInTheDocument();

    rerender(
      <AdminSettings
        presentation={{
          onRetry,
          status: "error",
        }}
      />,
    );

    expect(screen.getByText(adminSettingsCopy.errorTitle)).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminSettingsCopy.retryLabel }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("switches sections, validates password, and shows unavailable instead of a fake save", async (): Promise<void> => {
    const user = userEvent.setup();

    renderSettings(<AdminSettings presentation={{ status: "ready" }} />);

    await user.click(
      screen.getByRole("button", { name: adminSettingsCopy.accountTitle }),
    );
    expect(
      screen.getByText(adminSettingsCopy.accountRoleLabel),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(adminSettingsCopy.emptyValue).length,
    ).toBeGreaterThan(0);

    await user.click(
      screen.getByRole("button", {
        name: adminSettingsCopy.notificationsTitle,
      }),
    );
    expect(
      screen.getByLabelText(adminSettingsCopy.notificationEmailLabel),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: adminSettingsCopy.appearanceTitle }),
    );
    expect(
      screen.getByRole("button", { name: adminSettingsCopy.themeSystem }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: adminSettingsCopy.securityTitle }),
    );

    const newPassword = screen.getByLabelText(
      adminSettingsCopy.newPasswordLabel,
    );
    const confirmPassword = screen.getByLabelText(
      adminSettingsCopy.confirmPasswordLabel,
    );

    await user.type(newPassword, "short");
    await user.type(confirmPassword, "short");
    await user.click(
      screen.getByRole("button", { name: adminSettingsCopy.saveLabel }),
    );
    expect(
      screen.getByText(
        `Use at least ${String(AUTH_PASSWORD_MIN_LENGTH)} characters.`,
      ),
    ).toBeInTheDocument();

    const showButtons = screen.getAllByRole("button", {
      name: adminSettingsCopy.showPasswordLabel,
    });
    const firstShow = showButtons[0];

    if (firstShow === undefined) {
      throw new Error("Expected a show password control.");
    }

    await user.click(firstShow);
    expect(
      screen.getByRole("button", { name: adminSettingsCopy.hidePasswordLabel }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: adminSettingsCopy.profileTitle }),
    );
    await user.type(screen.getByLabelText(adminSettingsCopy.nameLabel), " ");
    await user.clear(screen.getByLabelText(adminSettingsCopy.nameLabel));
    await user.type(
      screen.getByLabelText(adminSettingsCopy.nameLabel),
      "Admin",
    );
    expect(
      screen.getByText(adminSettingsCopy.unsavedLabel),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminSettingsCopy.saveLabel }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: adminSettingsCopy.unavailableTitle,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Saved successfully")).not.toBeInTheDocument();
    expect(ADMIN_PATHS.settings).toBe("/admin/settings");
  });

  it("keeps business fields empty until site settings are connected", async (): Promise<void> => {
    const user = userEvent.setup();

    renderSettings(<AdminSettings presentation={{ status: "ready" }} />);

    await user.click(
      screen.getByRole("button", { name: adminSettingsCopy.businessTitle }),
    );

    expect(
      screen.getByLabelText(adminSettingsCopy.businessNameLabel),
    ).toHaveValue("");
    expect(
      screen.getByLabelText(adminSettingsCopy.businessPhoneLabel),
    ).toHaveValue("");
  });
});
