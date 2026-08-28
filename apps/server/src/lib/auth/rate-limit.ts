import {
  AUTH_RATE_LIMIT_MAX_ATTEMPTS,
  AUTH_RATE_LIMIT_WINDOW_MS,
} from "../../config/auth.ts";

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export class MemoryRateLimiter {
  private readonly buckets = new Map<string, RateLimitBucket>();
  private readonly maxAttempts: number;
  private readonly now: () => number;
  private readonly windowMs: number;

  public constructor(
    maxAttempts: number = AUTH_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: number = AUTH_RATE_LIMIT_WINDOW_MS,
    now: () => number = Date.now,
  ) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.now = now;
  }

  public consume(key: string): boolean {
    const timestamp = this.now();
    const existing = this.buckets.get(key);

    if (existing === undefined || existing.resetAt <= timestamp) {
      this.buckets.set(key, {
        count: 1,
        resetAt: timestamp + this.windowMs,
      });
      return true;
    }

    if (existing.count >= this.maxAttempts) {
      return false;
    }

    existing.count += 1;
    return true;
  }

  public reset(key: string): void {
    this.buckets.delete(key);
  }
}
