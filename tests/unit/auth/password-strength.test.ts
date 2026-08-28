import { describe, expect, it } from "vitest";
import { getPasswordStrength } from "@/lib/auth/password-strength";

describe("getPasswordStrength", (): void => {
  it("returns null for an empty password", (): void => {
    expect(getPasswordStrength("")).toBeNull();
  });

  it("labels short passwords as weak", (): void => {
    expect(getPasswordStrength("abc")).toBe("weak");
  });

  it("labels longer mixed passwords as fair, good, or strong", (): void => {
    expect(getPasswordStrength("Abcdefghijkl")).toBe("fair");
    expect(getPasswordStrength("Abcdefghijkl1")).toBe("good");
    expect(getPasswordStrength("Abcdefghijkl1!")).toBe("strong");
  });
});
