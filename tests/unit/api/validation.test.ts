import type { IncomingMessage, ServerResponse } from "node:http";
import { z } from "@neatly/config/zod";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  API_ERROR_CODES,
  HTTP_STATUS,
  VALIDATION_FAILED_MESSAGE,
} from "../../../apps/server/src/config/constants.ts";
import { API_PATHS } from "../../../apps/server/src/contracts/v1.ts";
import {
  AuthenticationError,
  AuthorizationError,
  InternalServerError,
  ValidationError,
} from "../../../apps/server/src/lib/errors.ts";
import { logInfo } from "../../../apps/server/src/lib/logger.ts";
import { normalizeError } from "../../../apps/server/src/lib/normalize-error.ts";
import {
  mapPrismaError,
  Prisma,
} from "../../../apps/server/src/lib/prisma-error.ts";
import {
  bindRequestContext,
  createRequestContext,
} from "../../../apps/server/src/lib/request-context.ts";
import {
  loginSchema,
  registerUserSchema,
} from "../../../apps/server/src/lib/validations/auth.schema.ts";
import { parseWithSchema } from "../../../apps/server/src/lib/validations/parse.ts";
import {
  bookingStatusSchema,
  booleanQuerySchema,
  dateTimeSchema,
  idParamSchema,
  idSchema,
  paginationQuerySchema,
  userRoleSchema,
} from "../../../apps/server/src/lib/validations/primitives.ts";
import { handleRequestError } from "../../../apps/server/src/middleware/error-handler.ts";
import {
  validateHeaders,
  validateParams,
  validateQuery,
} from "../../../apps/server/src/middleware/validate.ts";
import { dispatchApi, parseJsonBody } from "./http-harness";

interface Envelope<T> {
  data: T;
  error: {
    code: string;
    details?: readonly { field: string; issue: string }[];
    fields?: Record<string, string>;
    message: string;
    requestId?: string;
  } | null;
  success: boolean;
}

const nestedSchema = z.strictObject({
  address: z.strictObject({
    city: z.string().min(1, "Enter a city."),
    postalCode: z.string().min(1, "Enter a postal code."),
  }),
});

const VALID_PASSWORD = "correct-horse-battery-staple";

function jsonLogin(body: unknown): ReturnType<typeof dispatchApi> {
  return dispatchApi({
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
    url: API_PATHS.authLogin,
  });
}

describe("request validation", (): void => {
  it("accepts a structurally valid login body", (): void => {
    expect(
      parseWithSchema(loginSchema, {
        email: "  Admin@Neatly.example ",
        password: VALID_PASSWORD,
      }),
    ).toEqual({
      email: "admin@neatly.example",
      password: VALID_PASSWORD,
    });
  });

  it("rejects a missing required field", async (): Promise<void> => {
    const response = await jsonLogin({ email: "admin@neatly.example" });
    const body = parseJsonBody(response.body) as Envelope<null>;

    expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(body.error?.code).toBe(API_ERROR_CODES.INVALID_INPUT);
    expect(body.error?.message).toBe(VALIDATION_FAILED_MESSAGE);
    expect(body.error?.fields?.password).toBeDefined();
    expect(body.error?.requestId).toBe(response.headers["x-request-id"]);
  });

  it("rejects an invalid email", async (): Promise<void> => {
    const response = await jsonLogin({
      email: "not-an-email",
      password: VALID_PASSWORD,
    });
    const body = parseJsonBody(response.body) as Envelope<null>;

    expect(body.error?.code).toBe(API_ERROR_CODES.INVALID_INPUT);
    expect(body.error?.fields?.email).toBe("Enter a valid email.");
  });

  it("rejects an invalid password on register without echoing it", async (): Promise<void> => {
    const secret = "tiny";
    const response = await dispatchApi({
      body: JSON.stringify({
        email: "admin@neatly.example",
        name: "Neatly Admin",
        password: secret,
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
      url: API_PATHS.authRegister,
    });
    const body = parseJsonBody(response.body) as Envelope<null>;

    expect(body.error?.code).toBe(API_ERROR_CODES.INVALID_INPUT);
    expect(body.error?.fields?.password).toMatch(/at least/i);
    expect(JSON.stringify(body)).not.toContain(secret);
  });

  it("rejects unknown fields to prevent mass assignment", async (): Promise<void> => {
    const response = await dispatchApi({
      body: JSON.stringify({
        email: "admin@neatly.example",
        name: "Neatly Admin",
        password: VALID_PASSWORD,
        role: "ADMIN",
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
      url: API_PATHS.authRegister,
    });
    const body = parseJsonBody(response.body) as Envelope<null>;

    expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(body.error?.fields?.role).toBe("This field is not allowed.");
    expect(JSON.stringify(body)).not.toContain(VALID_PASSWORD);
  });
});

describe("shared schemas", (): void => {
  it("rejects an invalid database id", (): void => {
    expect((): void => {
      parseWithSchema(idSchema, "user_1");
    }).toThrow(ValidationError);
    expect(parseWithSchema(idSchema, "clx0abc123def456789012345")).toBe(
      "clx0abc123def456789012345",
    );
  });

  it("rejects an invalid enum value", (): void => {
    try {
      parseWithSchema(userRoleSchema, "CUSTOMER");
      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ValidationError);
      if (!(error instanceof ValidationError)) {
        return;
      }
      expect(error.details?.[0]?.issue).toBe("This value is not allowed.");
    }

    expect(parseWithSchema(bookingStatusSchema, "PENDING")).toBe("PENDING");
  });

  it("rejects a malformed date without using the server timezone", (): void => {
    expect((): void => {
      parseWithSchema(dateTimeSchema, "2026-13-40T00:00:00Z");
    }).toThrow(ValidationError);
    expect((): void => {
      parseWithSchema(dateTimeSchema, "2026-08-28T18:00:00");
    }).toThrow(ValidationError);

    const parsed = parseWithSchema(dateTimeSchema, "2026-08-28T18:00:00+05:30");
    expect(parsed.toISOString()).toBe("2026-08-28T12:30:00.000Z");
  });

  it("identifies nested validation paths", (): void => {
    try {
      parseWithSchema(nestedSchema, { address: { city: "", postalCode: "" } });
      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ValidationError);
      if (!(error instanceof ValidationError)) {
        return;
      }
      const fields = error.details?.map((item) => item.field) ?? [];
      expect(fields).toContain("address.city");
      expect(fields).toContain("address.postalCode");
    }
  });

  it("coerces boolean query flags and rejects malformed values", (): void => {
    expect(parseWithSchema(booleanQuerySchema, "true")).toBe(true);
    expect((): void => {
      parseWithSchema(booleanQuerySchema, "1");
    }).toThrow(ValidationError);
  });

  it("validates query, params, and headers through middleware", async (): Promise<void> => {
    const context = createRequestContext({
      ip: "127.0.0.1",
      method: "GET",
      path: "/items",
    });
    context.params = { id: "not-a-cuid" };
    const req = {
      headers: { "x-session-token": "session-token" },
      url: "/items?page=2&limit=20",
    } as unknown as IncomingMessage;
    const res = {} as unknown as ServerResponse;

    await validateQuery(paginationQuerySchema)(req, res, context);
    expect(context.input.query).toEqual({ limit: 20, page: 2, skip: 20 });

    await validateHeaders(z.object({ "x-session-token": z.string().min(1) }))(
      req,
      res,
      context,
    );
    expect(context.input.headers).toEqual({
      "x-session-token": "session-token",
    });

    expect((): void => {
      void validateParams(idParamSchema)(req, res, context);
    }).toThrow(ValidationError);
  });
});

describe("error mapping", (): void => {
  it("maps Prisma unique and missing-record errors without leaking SQL", (): void => {
    const unique = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed on the fields: (`email`)",
      {
        clientVersion: "6.19.3",
        code: "P2002",
        meta: { target: ["User.email"] },
      },
    );
    const missing = new Prisma.PrismaClientKnownRequestError(
      "Record to update not found.",
      {
        clientVersion: "6.19.3",
        code: "P2025",
      },
    );

    const conflict = mapPrismaError(unique);
    const notFound = mapPrismaError(missing);

    expect(conflict?.statusCode).toBe(HTTP_STATUS.CONFLICT);
    expect(conflict?.message).not.toMatch(/email|user|sql|constraint/i);
    expect(notFound?.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
    expect(notFound?.message).not.toMatch(/prisma|sql/i);
  });

  it("maps unexpected errors to a generic production response with a request ID", (): void => {
    const req = {
      headers: {},
      method: "GET",
      url: "/",
    } as unknown as IncomingMessage;
    const context = bindRequestContext(
      req,
      createRequestContext({
        ip: "127.0.0.1",
        method: "GET",
        path: "/",
        requestId: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
      }),
    );
    const headers: Record<string, string> = {};
    let payload = "";
    const res = {
      end(data?: string): void {
        payload = data ?? "";
      },
      headersSent: false,
      setHeader(name: string, value: string): void {
        headers[name] = value;
      },
      statusCode: 200,
    } as unknown as ServerResponse;

    handleRequestError(
      new Error("ECONNREFUSED postgres://neatly:secret@localhost/neatly"),
      req,
      res,
      "production",
    );
    const body = JSON.parse(payload) as Envelope<null>;

    expect(res.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(body.error?.code).toBe(API_ERROR_CODES.INTERNAL_ERROR);
    expect(body.error?.requestId).toBe(context.requestId);
    expect(body.error?.message).toBe("An unexpected error occurred.");
    expect(payload).not.toContain("secret");
    expect(payload).not.toContain("postgres");
    expect(normalizeError(new Error("boom"))).toBeInstanceOf(
      InternalServerError,
    );
  });

  it("keeps authentication and authorization envelopes stable", async (): Promise<void> => {
    const unauthenticated = await dispatchApi({
      method: "GET",
      url: API_PATHS.admin,
    });
    const unauthenticatedBody = parseJsonBody(
      unauthenticated.body,
    ) as Envelope<null>;

    expect(unauthenticated.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(unauthenticatedBody.error?.code).toBe(API_ERROR_CODES.UNAUTHORIZED);
    expect(unauthenticatedBody.error?.requestId).toBeDefined();
    expect(normalizeError(new AuthenticationError()).statusCode).toBe(401);
    expect(normalizeError(new AuthorizationError()).statusCode).toBe(403);
  });
});

describe("sensitive value protection", (): void => {
  afterEach((): void => {
    vi.restoreAllMocks();
  });

  it("does not log password values", (): void => {
    const writes: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk): boolean => {
      writes.push(String(chunk));
      return true;
    });

    logInfo("request", {
      password: "super-secret-password",
      requestId: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
    });

    expect(writes.join("")).not.toContain("super-secret-password");
    expect(writes.join("")).toContain("aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee");
  });

  it("does not assign a role from prototype keys", (): void => {
    const parsed = registerUserSchema.safeParse(
      JSON.parse(
        `{"email":"admin@neatly.example","name":"Neatly Admin","password":"${VALID_PASSWORD}","__proto__":{"role":"ADMIN"}}`,
      ) as unknown,
    );

    expect(({} as { role?: string }).role).toBeUndefined();

    if (parsed.success) {
      expect(parsed.data).toEqual({
        email: "admin@neatly.example",
        name: "Neatly Admin",
        password: VALID_PASSWORD,
      });
    }
  });
});
