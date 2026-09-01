import { describe, expect, it } from "vitest";
import {
  emptyPublicNewsletterValues,
  publicNewsletterSchema,
} from "@/lib/validations/public-newsletter.schema";

describe("publicNewsletterSchema", (): void => {
  it("accepts a trimmed email", (): void => {
    const parsed = publicNewsletterSchema.safeParse({
      ...emptyPublicNewsletterValues,
      email: "ada@neatly.example",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects a missing email", (): void => {
    const parsed = publicNewsletterSchema.safeParse({
      email: "not-an-email",
    });

    expect(parsed.success).toBe(false);
  });
});
