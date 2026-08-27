import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { AUTH_TOKEN_BYTES } from "@/config/auth";

export function generateAuthToken(): string {
  return randomBytes(AUTH_TOKEN_BYTES).toString("hex");
}

export function hashAuthToken(token: string, secret: string): string {
  return createHmac("sha256", secret).update(token).digest("hex");
}

export function authTokensEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}
