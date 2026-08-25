import { cn } from "@neatly/utils";
import { describe, expect, it } from "vitest";

describe("cn", (): void => {
  it("merges class names and resolves Tailwind conflicts", (): void => {
    expect(cn("px-2", "px-4", false && "hidden")).toBe("px-4");
  });

  it("keeps design-system type sizes next to text color tokens", (): void => {
    expect(cn("text-h4 text-secondary-foreground")).toBe(
      "text-h4 text-secondary-foreground",
    );
    expect(cn("text-body-small text-secondary-foreground/80")).toBe(
      "text-body-small text-secondary-foreground/80",
    );
  });
});
