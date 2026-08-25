import { APP_NAME } from "@neatly/config";
import { describe, expect, it } from "vitest";

describe("APP_NAME", (): void => {
  it("exports the Neatly product name", (): void => {
    expect(APP_NAME).toBe("Neatly");
  });
});
