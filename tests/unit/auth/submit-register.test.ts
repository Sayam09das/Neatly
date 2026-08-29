import { describe, expect, it, vi } from "vitest";
import { submitCustomerRegister } from "@/lib/auth/submit-register";

describe("submitCustomerRegister", (): void => {
  it("maps a duplicate-email envelope to EMAIL_ALREADY_REGISTERED", async (): Promise<void> => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async (): Promise<{
          error: { code: string; message: string };
          success: false;
        }> => ({
          error: {
            code: "INVALID_INPUT",
            message: "An account with this email already exists.",
          },
          success: false,
        }),
        ok: false,
      }),
    );

    const result = await submitCustomerRegister({
      email: "sayam@neatly.example",
      name: "Sayam Das",
      password: "Customer@123",
    });

    expect(result).toEqual({
      code: "EMAIL_ALREADY_REGISTERED",
      status: "error",
    });
    vi.unstubAllGlobals();
  });
});
