import { describe, expect, it } from "vitest";
import { MemoryRateLimiter } from "../../../apps/server/src/lib/auth/rate-limit.ts";

describe("MemoryRateLimiter", (): void => {
  it("allows up to the configured number of attempts inside the window", (): void => {
    let now = 0;
    const limiter = new MemoryRateLimiter(2, 1_000, (): number => now);

    expect(limiter.consume("login:1.1.1.1")).toBe(true);
    expect(limiter.consume("login:1.1.1.1")).toBe(true);
    expect(limiter.consume("login:1.1.1.1")).toBe(false);

    now = 1_000;
    expect(limiter.consume("login:1.1.1.1")).toBe(true);
  });
});
