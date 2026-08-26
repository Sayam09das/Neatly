import { describe, expect, it } from "vitest";
import { formatCountFigure } from "@/animations/count-up";

describe("formatCountFigure", (): void => {
  it("joins a published count with its suffix", (): void => {
    expect(formatCountFigure(100, "%")).toBe("100%");
    expect(formatCountFigure(12, "+")).toBe("12+");
    expect(formatCountFigure(4, "")).toBe("4");
  });
});
