import { describe, expect, it } from "vitest";
import { formatTrustFigure } from "@/components/sections/trust/trust-count";

describe("formatTrustFigure", (): void => {
  it("joins a published count with its suffix", (): void => {
    expect(formatTrustFigure(100, "%")).toBe("100%");
    expect(formatTrustFigure(12, "+")).toBe("12+");
    expect(formatTrustFigure(4, "")).toBe("4");
  });
});
