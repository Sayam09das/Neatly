/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import {
  prepareAccentPath,
  revealAccentPath,
} from "@/components/sections/accent-stroke";

describe("accent stroke helpers", (): void => {
  it("prepares dash attributes from path length and can reveal immediately", (): void => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.getTotalLength = (): number => 120;

    const length = prepareAccentPath(path);

    expect(length).toBe(120);
    expect(path.getAttribute("stroke-dasharray")).toBe("120");
    expect(path.getAttribute("stroke-dashoffset")).toBe("120");

    revealAccentPath(path);
    expect(path.getAttribute("stroke-dashoffset")).toBe("0");
  });

  it("treats a missing getTotalLength as a zero-length path", (): void => {
    const attributes = new Map<string, string>();
    const path = {
      setAttribute: (name: string, value: string): void => {
        attributes.set(name, value);
      },
    } as unknown as SVGPathElement;

    expect(prepareAccentPath(path)).toBe(0);
    expect(attributes.get("stroke-dasharray")).toBe("0");
    expect(attributes.get("stroke-dashoffset")).toBe("0");
  });
});
