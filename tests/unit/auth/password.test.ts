import { describe, expect, it } from "vitest";
import {
  hashPassword,
  verifyPassword,
} from "../../../apps/server/src/lib/auth/password.ts";

describe("password hashing", (): void => {
  it("hashes passwords and verifies the original value", async (): Promise<void> => {
    const password = "correct-horse-battery-staple";
    const hash = await hashPassword(password, 4);

    expect(hash).not.toBe(password);
    expect(hash.startsWith("$2")).toBe(true);
    await expect(verifyPassword(password, hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong-password-value", hash)).resolves.toBe(
      false,
    );
  });
});
