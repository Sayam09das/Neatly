import { beforeEach, describe, expect, it, vi } from "vitest";
import { HTTP_STATUS } from "../../../apps/server/src/config/constants.ts";
import { API_PATHS } from "../../../apps/server/src/contracts/v1.ts";
import { AuthError } from "../../../apps/server/src/lib/auth/errors.ts";
import { getAuthService } from "../../../apps/server/src/lib/auth/runtime.ts";
import { getDomainServices } from "../../../apps/server/src/lib/domain/runtime.ts";
import { dispatchApi, parseJsonBody } from "./http-harness";

vi.mock("../../../apps/server/src/lib/auth/runtime.ts", () => ({
  getAuthService: vi.fn(),
}));

vi.mock("../../../apps/server/src/lib/domain/runtime.ts", () => ({
  getDomainServices: vi.fn(),
}));

const mockedAuth = vi.mocked(getAuthService);
const mockedDomain = vi.mocked(getDomainServices);

const createdUser = {
  email: "sayam@neatly.example",
  id: "user-customer-1",
  lastLoginAt: null,
  name: "Sayam Das",
  role: "STAFF" as const,
  status: "ACTIVE" as const,
};

const registerPayload = {
  email: "sayam@neatly.example",
  name: "Sayam Das",
  password: "Customer@123",
};

interface Envelope<T> {
  data: T;
  error: { code: string; message: string } | null;
  success: boolean;
}

describe("Customer register API", (): void => {
  const registerUser = vi.fn();
  const ensureForSession = vi.fn();

  beforeEach((): void => {
    registerUser.mockReset();
    ensureForSession.mockReset();
    registerUser.mockResolvedValue(createdUser);
    ensureForSession.mockResolvedValue({ id: "customer-1" });
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedAuth.mockReturnValue({ registerUser } as never);
    mockedDomain.mockReturnValue({
      customers: { ensureForSession },
    } as never);
  });

  it("creates an unverified customer without a session", async (): Promise<void> => {
    const response = await dispatchApi({
      body: JSON.stringify(registerPayload),
      headers: { "content-type": "application/json" },
      method: "POST",
      url: API_PATHS.customerRegister,
    });
    const body = parseJsonBody(response.body) as Envelope<{
      user: { email: string; role: string };
    }>;

    expect(response.statusCode).toBe(HTTP_STATUS.CREATED);
    expect(body.success).toBe(true);
    expect(body.data.user.email).toBe(createdUser.email);
    expect(body.data.user.role).toBe("STAFF");
    expect(response.body).not.toContain("password");
    expect(registerUser).toHaveBeenCalledWith(registerPayload, {
      role: "STAFF",
    });
    expect(ensureForSession).toHaveBeenCalledWith({
      email: createdUser.email,
      id: createdUser.id,
      name: createdUser.name,
    });
  });

  it("rejects extra role or customerId fields", async (): Promise<void> => {
    const response = await dispatchApi({
      body: JSON.stringify({
        ...registerPayload,
        customerId: "other-customer",
        role: "ADMIN",
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
      url: API_PATHS.customerRegister,
    });
    const body = parseJsonBody(response.body) as Envelope<null>;

    expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(body.error?.code).toBe("INVALID_INPUT");
    expect(registerUser).not.toHaveBeenCalled();
    expect(ensureForSession).not.toHaveBeenCalled();
  });

  it("returns a safe duplicate-email error", async (): Promise<void> => {
    registerUser.mockRejectedValue(
      new AuthError(
        "INVALID_INPUT",
        "An account with this email already exists.",
        [
          {
            field: "email",
            issue: "An account with this email already exists.",
          },
        ],
      ),
    );

    const response = await dispatchApi({
      body: JSON.stringify(registerPayload),
      headers: { "content-type": "application/json" },
      method: "POST",
      url: API_PATHS.customerRegister,
    });
    const body = parseJsonBody(response.body) as Envelope<null>;

    expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(body.error?.code).toBe("INVALID_INPUT");
    expect(body.error?.message).toBe(
      "An account with this email already exists.",
    );
    expect(ensureForSession).not.toHaveBeenCalled();
  });
});
