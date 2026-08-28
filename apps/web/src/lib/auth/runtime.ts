import { loadServerEnv } from "@neatly/config/server";
import { BackendAuthClient } from "@/lib/auth/api-client";

let authClient: BackendAuthClient | undefined;

export function getAuthService(): BackendAuthClient {
  if (authClient === undefined) {
    const env = loadServerEnv();
    authClient = new BackendAuthClient(env.NEATLY_API_URL);
  }

  return authClient;
}
