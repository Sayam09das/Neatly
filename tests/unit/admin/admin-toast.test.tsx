/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toaster } from "@/components/feedback/toaster";
import { clearToasts, toast } from "@/lib/toast";
import { Providers } from "@/providers";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin",
}));

vi.mock("@/providers/theme-provider", () => ({
  ThemeProvider: ({ children }: { children: ReactNode }): ReactNode => children,
}));

vi.mock("@/animations/lenis/smooth-scroll", () => ({
  SmoothScroll: ({ children }: { children: ReactNode }): ReactNode => children,
}));

afterEach((): void => {
  clearToasts();
});

describe("Global toast system", (): void => {
  it("mounts a single toaster from the application providers", (): void => {
    render(
      <Providers>
        <p>Provider child</p>
      </Providers>,
    );

    expect(document.querySelectorAll('[data-slot="toaster"]')).toHaveLength(1);
  });

  it("renders success, error, warning, and info toasts", async (): Promise<void> => {
    render(<Toaster />);

    toast.success({ title: "Saved successfully" });
    expect(await screen.findByText("Saved successfully")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute(
      "data-variant",
      "success",
    );

    clearToasts();
    toast.error({
      description: "Please try again.",
      title: "Something went wrong",
    });
    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Please try again.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveAttribute("data-variant", "error");

    clearToasts();
    toast.warning({ title: "Action requires attention" });
    expect(
      await screen.findByText("Action requires attention"),
    ).toBeInTheDocument();

    clearToasts();
    toast.info({ title: "New update available" });
    expect(await screen.findByText("New update available")).toBeInTheDocument();
  });

  it("dismisses a toast from the close button", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<Toaster />);
    toast.info({ title: "Dismissible notice" });

    expect(await screen.findByText("Dismissible notice")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Dismiss notification" }),
    );
    await waitFor((): void => {
      expect(screen.queryByText("Dismissible notice")).not.toBeInTheDocument();
    });
  });

  it("runs an optional toast action and then dismisses", async (): Promise<void> => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<Toaster />);
    toast.error({
      action: {
        label: "Retry",
        onClick: onRetry,
      },
      title: "Something went wrong",
    });

    await user.click(await screen.findByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    await waitFor((): void => {
      expect(
        screen.queryByText("Something went wrong"),
      ).not.toBeInTheDocument();
    });
  });
});
