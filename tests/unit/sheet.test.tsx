/** @vitest-environment jsdom */

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@neatly/ui";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Sheet", (): void => {
  it("opens a side panel and restores the trigger after Escape", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open menu</SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Site menu</SheetTitle>
            <SheetDescription>Navigate the public pages.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );

    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Site menu");
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });
});
