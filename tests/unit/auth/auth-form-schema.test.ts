import { describe, expect, it } from "vitest";
import { registerFormSchema } from "@/lib/validations/auth-form.schema";

describe("registerFormSchema", (): void => {
  it("accepts matching name, email, and passwords", (): void => {
    expect(
      registerFormSchema.safeParse({
        confirmPassword: "correct-horse-battery-staple",
        email: "ada@neatly.example",
        name: "Ada Lovelace",
        password: "correct-horse-battery-staple",
      }).success,
    ).toBe(true);
  });

  it("requires a full name", (): void => {
    const result = registerFormSchema.safeParse({
      confirmPassword: "correct-horse-battery-staple",
      email: "ada@neatly.example",
      name: "",
      password: "correct-horse-battery-staple",
    });

    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords", (): void => {
    const result = registerFormSchema.safeParse({
      confirmPassword: "different-password-value",
      email: "ada@neatly.example",
      name: "Ada Lovelace",
      password: "correct-horse-battery-staple",
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(
      result.error.issues.some((issue) => issue.path[0] === "confirmPassword"),
    ).toBe(true);
  });
});
