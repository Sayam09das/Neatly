import { describe, expect, it } from "vitest";
import {
  forgotPasswordSchema,
  loginSchema,
  registerUserSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@/lib/validations/auth.schema";

describe("auth validation schemas", (): void => {
  it("accepts valid registration, login, reset, and verification payloads", (): void => {
    expect(
      registerUserSchema.safeParse({
        name: "Neatly Admin",
        email: "admin@neatly.example",
        password: "correct-horse-battery-staple",
      }).success,
    ).toBe(true);
    expect(
      loginSchema.safeParse({
        email: "admin@neatly.example",
        password: "any-password",
      }).success,
    ).toBe(true);
    expect(
      forgotPasswordSchema.safeParse({
        email: "admin@neatly.example",
      }).success,
    ).toBe(true);
    expect(
      resetPasswordSchema.safeParse({
        token: "reset-token",
        password: "correct-horse-battery-staple",
      }).success,
    ).toBe(true);
    expect(verifyEmailSchema.safeParse({ token: "verify-token" }).success).toBe(
      true,
    );
  });

  it("rejects malformed authentication input", (): void => {
    expect(registerUserSchema.safeParse({}).success).toBe(false);
    expect(
      loginSchema.safeParse({ email: "not-an-email", password: "" }).success,
    ).toBe(false);
    expect(forgotPasswordSchema.safeParse({ email: "" }).success).toBe(false);
    expect(
      resetPasswordSchema.safeParse({
        token: "",
        password: "short",
      }).success,
    ).toBe(false);
    expect(verifyEmailSchema.safeParse({ token: "" }).success).toBe(false);
  });
});
