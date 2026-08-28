import type { IncomingMessage } from "node:http";
import { AUTH_SESSION_TOKEN_HEADER } from "../../config/auth.ts";
import { getHeader } from "../request.ts";

export function getSessionToken(req: IncomingMessage): string | undefined {
  const bearer = getHeader(req, "authorization");

  if (bearer !== undefined) {
    const normalized = bearer.toLowerCase();

    if (normalized.startsWith("bearer ")) {
      const token = bearer.slice("bearer ".length).trim();
      return token === "" ? undefined : token;
    }
  }

  const headerToken = getHeader(req, AUTH_SESSION_TOKEN_HEADER);
  return headerToken === "" ? undefined : headerToken;
}
