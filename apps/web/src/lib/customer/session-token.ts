import { cookies } from "next/headers";
import { AUTH_SESSION_COOKIE_NAME } from "@/config/auth";

export async function readCustomerSessionToken(): Promise<string | undefined> {
  const jar = await cookies();
  const sessionToken = jar.get(AUTH_SESSION_COOKIE_NAME)?.value;

  if (sessionToken === undefined || sessionToken.trim() === "") {
    return undefined;
  }

  return sessionToken;
}
