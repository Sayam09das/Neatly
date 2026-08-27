import {
  AUTH_RATE_LIMIT_MAX_ATTEMPTS,
  AUTH_RATE_LIMIT_WINDOW_MS,
} from "@/config/auth";

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export class MemoryRateLimiter {
  private readonly buckets = new Map<string, RateLimitBucket>();

  public constructor(
    private readonly maxAttempts: number = AUTH_RATE_LIMIT_MAX_ATTEMPTS,
    private readonly windowMs: number = AUTH_RATE_LIMIT_WINDOW_MS,
    private readonly now: () => number = Date.now,
  ) {}

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

  public peekRemaining(key: string): number {
    const timestamp = this.now();
    const existing = this.buckets.get(key);

    if (existing === undefined || existing.resetAt <= timestamp) {
      return this.maxAttempts;
    }

    return Math.max(this.maxAttempts - existing.count, 0);
  }

  public reset(key: string): void {
    this.buckets.delete(key);
  }
}

export const loginRateLimiter = new MemoryRateLimiter();
export const passwordResetRateLimiter = new MemoryRateLimiter();
