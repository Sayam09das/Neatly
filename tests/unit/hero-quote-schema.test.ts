import { describe, expect, it } from "vitest";
import { heroQuoteSchema } from "@/components/sections/hero/quote-schema";

describe("heroQuoteSchema", (): void => {
  it("accepts a complete preview request", (): void => {
    const result = heroQuoteSchema.safeParse({
      email: "alex@example.com",
      fullName: "Alex Rivera",
      message: "Weekend visit if possible.",
      service: "residential",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty preview request", (): void => {
    const result = heroQuoteSchema.safeParse({
      email: "",
      fullName: "",
      message: "",
      service: "",
    });

    expect(result.success).toBe(false);
  });
});
