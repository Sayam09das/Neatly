import { describe, expect, it } from "vitest";
import {
  parseResetLinkView,
  parseVerifyEmailView,
  readSearchParam,
  withSearchParams,
} from "@/lib/auth/frontend-views";
import { getRemainingCooldownSeconds, maskEmail } from "@/lib/auth/mask-email";
import { resetPasswordFormSchema } from "@/lib/validations/auth-form.schema";
import { getFrontendAuthStatus } from "@/services/auth-form.service";

describe("maskEmail", (): void => {
  it("masks the local part and never invents an address", (): void => {
    expect(maskEmail("ada@neatly.example")).toBe("a***@neatly.example");
    expect(maskEmail("not-an-email")).toBeNull();
    expect(maskEmail("")).toBeNull();
  });
});

describe("getRemainingCooldownSeconds", (): void => {
  it("returns remaining seconds and reaches zero when elapsed", (): void => {
    expect(getRemainingCooldownSeconds(1_000, 46_000)).toBe(45);
    expect(getRemainingCooldownSeconds(46_000, 46_000)).toBe(0);
    expect(getRemainingCooldownSeconds(50_000, 46_000)).toBe(0);
  });
});

describe("frontend auth views", (): void => {
  it("reads a single search value and ignores unknown link states", (): void => {
    expect(readSearchParam("expired")).toBe("expired");
    expect(readSearchParam(["expired"])).toBeUndefined();
    expect(parseResetLinkView("expired")).toBe("expired");
    expect(parseResetLinkView("invalid")).toBe("invalid");
    expect(parseResetLinkView("abc123token")).toBeNull();
    expect(parseVerifyEmailView("verified")).toBe("verified");
    expect(parseVerifyEmailView("token-value")).toBeNull();
    expect(withSearchParams("/admin/reset-password", { link: "expired" })).toBe(
      "/admin/reset-password?link=expired",
    );
    expect(withSearchParams("/admin/verify-email", {})).toBe(
      "/admin/verify-email",
    );
  });
});

describe("getFrontendAuthStatus", (): void => {
  it("stays unknown until a real session is connected", (): void => {
    expect(getFrontendAuthStatus()).toBe("unknown");
  });
});

describe("resetPasswordFormSchema", (): void => {
  it("requires matching passwords that meet length rules", (): void => {
    expect(
      resetPasswordFormSchema.safeParse({
        confirmPassword: "correct-horse-battery-staple",
        password: "correct-horse-battery-staple",
      }).success,
    ).toBe(true);

    const mismatch = resetPasswordFormSchema.safeParse({
      confirmPassword: "different-password-value",
      password: "correct-horse-battery-staple",
    });
    expect(mismatch.success).toBe(false);
  });
});
