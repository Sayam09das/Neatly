/** @vitest-environment jsdom */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@neatly/ui";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Dialog", (): void => {
  it("opens from the trigger, names the dialog, and closes on Escape", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open details</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quote details</DialogTitle>
            <DialogDescription>Review the submitted request.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open details" }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Quote details");
    expect(dialog).toHaveAccessibleDescription("Review the submitted request.");
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
