/** @vitest-environment jsdom */

import { Button } from "@neatly/ui";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("Button", (): void => {
  it("renders a native button that can be activated from the keyboard", async (): Promise<void> => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Save quote</Button>);

    const button = screen.getByRole("button", { name: "Save quote" });
    button.focus();
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire clicks when disabled or loading", async (): Promise<void> => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    const { rerender } = render(
      <Button disabled onClick={onClick}>
        Save quote
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Save quote" }));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Save quote" })).toBeDisabled();

    rerender(
      <Button isLoading onClick={onClick}>
        Save quote
      </Button>,
    );

    const loadingButton = screen.getByRole("button", { name: "Save quote" });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute("aria-busy", "true");
    await user.click(loadingButton);
    expect(onClick).not.toHaveBeenCalled();
  });
});
