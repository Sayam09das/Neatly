import { cn } from "@neatly/utils";
import { describe, expect, it } from "vitest";

describe("cn", (): void => {
  it("merges class names and resolves Tailwind conflicts", (): void => {
    expect(cn("px-2", "px-4", false && "hidden")).toBe("px-4");
  });
});
