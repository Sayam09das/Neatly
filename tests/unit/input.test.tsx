/** @vitest-environment jsdom */

import { Input, Label } from "@neatly/ui";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Input", (): void => {
  it("associates with a label and accepts typed values", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="name@example.com" />
      </>,
    );

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("placeholder", "name@example.com");

    await user.type(input, "ada@example.com");
    expect(input).toHaveValue("ada@example.com");
  });

  it("exposes disabled and invalid states", (): void => {
    render(
      <Input
        aria-invalid="true"
        aria-label="Phone"
        disabled
        placeholder="Phone"
      />,
    );

    const input = screen.getByLabelText("Phone");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});
