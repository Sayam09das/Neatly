import { AUTH_ERROR_MESSAGES, AuthError } from "@/lib/auth/errors";
import type { AuthErrorCode, AuthFieldIssue, AuthUser } from "@/types/auth";

const SESSION_TOKEN_HEADER = "x-session-token";
const FORWARDED_FOR_HEADER = "x-forwarded-for";

export interface AuthClientContext {
  ip: string;
}

export interface AuthSessionClientResult {
  expiresAt: Date;
  sessionToken: string;
  user: AuthUser;
}

interface AuthApiErrorBody {
  code: string;
  details?: readonly AuthFieldIssue[];
  message: string;
}

interface AuthApiSuccessEnvelope<T> {
  data: T;
  error: null;
  success: true;
}

interface AuthApiErrorEnvelope {
  data: null;
  error: AuthApiErrorBody;
  success: false;
}

type AuthApiEnvelope<T> = AuthApiErrorEnvelope | AuthApiSuccessEnvelope<T>;

export class BackendAuthClient {
  public constructor(private readonly baseUrl: string) {}

  public async registerUser(input: unknown): Promise<AuthUser> {
    const data = await this.post<{ user: unknown }>("/auth/register", input);
    return parseAuthUser(data.user);
  }

  public async authenticateUser(
    input: unknown,
    context: AuthClientContext,
  ): Promise<AuthSessionClientResult> {
    const data = await this.post<{
      expiresAt: unknown;
      sessionToken: unknown;
      user: unknown;
    }>("/auth/login", input, { ip: context.ip });

    if (typeof data.sessionToken !== "string" || data.sessionToken === "") {
      throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
    }

    return {
      expiresAt: parseIsoDate(data.expiresAt),
      sessionToken: data.sessionToken,
      user: parseAuthUser(data.user),
    };
  }

  public async resolveSession(
    sessionToken: string | undefined,
  ): Promise<AuthUser | null> {
    const data = await this.get<{ user: unknown }>(
      "/auth/session",
      sessionToken,
    );

    if (data.user === null) {
      return null;
    }

    return parseAuthUser(data.user);
  }

  public async logout(sessionToken: string | undefined): Promise<void> {
    await this.post<{ signedOut: unknown }>(
      "/auth/logout",
      {},
      { sessionToken },
    );
  }

  public async requestPasswordReset(
    input: unknown,
    context: AuthClientContext,
  ): Promise<{ message: string }> {
    const data = await this.post<{ message: unknown }>(
      "/auth/forgot-password",
      input,
      { ip: context.ip },
    );

    if (typeof data.message !== "string") {
      throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
    }

    return { message: data.message };
  }

  public async resetPassword(
    input: unknown,
    context: AuthClientContext,
  ): Promise<Pick<AuthUser, "email" | "id">> {
    const data = await this.post<{ user: unknown }>(
      "/auth/reset-password",
      input,
      { ip: context.ip },
    );

    return parseAuthIdentity(data.user);
  }

  public async verifyEmail(
    input: unknown,
  ): Promise<Pick<AuthUser, "email" | "id">> {
    const data = await this.post<{ user: unknown }>(
      "/auth/verify-email",
      input,
    );
    return parseAuthIdentity(data.user);
  }

  public async requestEmailVerification(
    input: unknown,
    context: AuthClientContext,
  ): Promise<{ message: string }> {
    const data = await this.post<{ message: unknown }>(
      "/auth/resend-verification",
      input,
      { ip: context.ip },
    );

    if (typeof data.message !== "string") {
      throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
    }

    return { message: data.message };
  }

  private async get<T>(
    path: string,
    sessionToken: string | undefined,
  ): Promise<T> {
    return this.request<T>(path, {
      method: "GET",
      sessionToken,
    });
  }

  private async post<T>(
    path: string,
    body: unknown,
    options: { ip?: string; sessionToken?: string } = {},
  ): Promise<T> {
    return this.request<T>(path, {
      body: JSON.stringify(body ?? {}),
      ip: options.ip,
      method: "POST",
      sessionToken: options.sessionToken,
    });
  }

  private async request<T>(
    path: string,
    options: {
      body?: string;
      ip?: string;
      method: "GET" | "POST";
      sessionToken?: string;
    },
  ): Promise<T> {
    const headers = new Headers();
    headers.set("accept", "application/json");

    if (options.body !== undefined) {
      headers.set("content-type", "application/json");
    }

    if (options.ip !== undefined && options.ip !== "") {
      headers.set(FORWARDED_FOR_HEADER, options.ip);
    }

    if (options.sessionToken !== undefined && options.sessionToken !== "") {
      headers.set(SESSION_TOKEN_HEADER, options.sessionToken);
    }

    let response: Response;

    try {
      response = await fetch(this.resolveUrl(path), {
        body: options.body,
        cache: "no-store",
        headers,
        method: options.method,
      });
    } catch {
      throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
    }

    const envelope = await readEnvelope<T>(response);

    if (!envelope.success) {
      throw toAuthError(envelope.error);
    }

    return envelope.data;
  }

  private resolveUrl(path: string): string {
    const origin = this.baseUrl.endsWith("/")
      ? this.baseUrl.slice(0, -1)
      : this.baseUrl;
    return `${origin}${path}`;
  }
}

async function readEnvelope<T>(
  response: Response,
): Promise<AuthApiEnvelope<T>> {
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
  }

  if (!isRecord(payload) || typeof payload.success !== "boolean") {
    throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
  }

  if (payload.success === true) {
    return {
      data: payload.data as T,
      error: null,
      success: true,
    };
  }

  if (!isRecord(payload.error) || typeof payload.error.message !== "string") {
    throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
  }

  return {
    data: null,
    error: {
      code:
        typeof payload.error.code === "string"
          ? payload.error.code
          : "INTERNAL_ERROR",
      message: payload.error.message,
      ...(isFieldIssues(payload.error.details)
        ? { details: payload.error.details }
        : {}),
    },
    success: false,
  };
}

function toAuthError(error: AuthApiErrorBody): AuthError {
  const code = isAuthErrorCode(error.code) ? error.code : "INTERNAL_ERROR";
  const message =
    code === "INTERNAL_ERROR"
      ? AUTH_ERROR_MESSAGES.INTERNAL_ERROR
      : error.message;

  return new AuthError(code, message, error.details);
}

function parseAuthUser(value: unknown): AuthUser {
  if (!isRecord(value)) {
    throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
  }

  if (
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.email !== "string" ||
    !isAuthUserRole(value.role) ||
    !isAuthUserStatus(value.status)
  ) {
    throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
  }

  if ("passwordHash" in value || "sessionToken" in value) {
    throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
  }

  return {
    email: value.email,
    id: value.id,
    lastLoginAt: parseOptionalDate(value.lastLoginAt),
    name: value.name,
    role: value.role,
    status: value.status,
  };
}

function parseAuthIdentity(value: unknown): Pick<AuthUser, "email" | "id"> {
  if (!isRecord(value)) {
    throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
  }

  if (typeof value.id !== "string" || typeof value.email !== "string") {
    throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
  }

  return {
    email: value.email,
    id: value.id,
  };
}

function parseIsoDate(value: unknown): Date {
  if (typeof value !== "string") {
    throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
  }

  return date;
}

function parseOptionalDate(value: unknown): Date | null {
  if (value === null) {
    return null;
  }

  return parseIsoDate(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAuthErrorCode(code: string): code is AuthErrorCode {
  return (
    code === "FORBIDDEN" ||
    code === "INTERNAL_ERROR" ||
    code === "INVALID_CREDENTIALS" ||
    code === "INVALID_INPUT" ||
    code === "RATE_LIMITED" ||
    code === "SESSION_EXPIRED" ||
    code === "TOKEN_EXPIRED" ||
    code === "TOKEN_INVALID" ||
    code === "UNAUTHORIZED"
  );
}

function isAuthUserRole(value: unknown): value is AuthUser["role"] {
  return (
    value === "ADMIN" ||
    value === "CONTENT_MANAGER" ||
    value === "STAFF" ||
    value === "SUPER_ADMIN"
  );
}

function isAuthUserStatus(value: unknown): value is AuthUser["status"] {
  return value === "ACTIVE" || value === "INACTIVE" || value === "SUSPENDED";
}

function isFieldIssues(value: unknown): value is readonly AuthFieldIssue[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      return (
        isRecord(item) &&
        typeof item.field === "string" &&
        typeof item.issue === "string"
      );
    })
  );
}
