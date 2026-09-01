import { describe, expect, it } from "vitest";
import {
  contactInquirySchema,
  emptyContactInquiryValues,
} from "@/lib/validations/contact.schema";

describe("contactInquirySchema", (): void => {
  it("accepts a complete inquiry and drops a blank phone", (): void => {
    const parsed = contactInquirySchema.safeParse({
      ...emptyContactInquiryValues,
      email: "ada@neatly.example",
      fullName: "Ada Lovelace",
      message: "Do you clean small offices on weekday evenings?",
      subject: "Office hours",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.phone).toBeUndefined();
    }
  });

  it("rejects a missing name and a short message", (): void => {
    const parsed = contactInquirySchema.safeParse({
      ...emptyContactInquiryValues,
      email: "not-an-email",
      message: "Hi",
      subject: "Hi",
    });

    expect(parsed.success).toBe(false);
  });
});
