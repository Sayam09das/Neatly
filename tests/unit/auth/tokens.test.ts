import { describe, expect, it } from "vitest";
import { generateAuthToken, hashAuthToken } from "@/lib/auth/tokens";

const SECRET = "test-session-secret-value-32-chars-min";

describe("auth tokens", (): void => {
  it("generates opaque hex tokens and hashes them with the session secret", (): void => {
    const token = generateAuthToken();

    expect(token).toMatch(/^[a-f0-9]{64}$/);
    expect(hashAuthToken(token, SECRET)).not.toBe(token);
    expect(hashAuthToken(token, SECRET)).toBe(hashAuthToken(token, SECRET));
    expect(hashAuthToken(token, SECRET)).not.toBe(
      hashAuthToken(token, "a-different-session-secret-value-32"),
    );
  });
});
