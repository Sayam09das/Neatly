import { loadClientEnv } from "@neatly/config";

export function getSiteUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;

  if (raw === undefined || raw.trim() === "") {
    return undefined;
  }

  return loadClientEnv({ NEXT_PUBLIC_SITE_URL: raw }).NEXT_PUBLIC_SITE_URL;
}
