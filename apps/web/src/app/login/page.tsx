import { redirect } from "next/navigation";
import { AUTH_ADMIN_LOGIN_PATH } from "@/config/auth";
import { isSafePostLoginPath } from "@/lib/auth/submit-login";

interface LoginAliasPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginAliasPage({
  searchParams,
}: LoginAliasPageProps): Promise<never> {
  const { next } = await searchParams;

  if (typeof next === "string" && isSafePostLoginPath(next)) {
    redirect(`${AUTH_ADMIN_LOGIN_PATH}?next=${encodeURIComponent(next)}`);
  }

  redirect(AUTH_ADMIN_LOGIN_PATH);
}
