"use server";

import { redirect } from "next/navigation";
import { AUTH_ADMIN_LOGIN_PATH } from "@/config/auth";
import { logoutCurrentSession } from "@/lib/auth/current-user";

export async function signOut(): Promise<void> {
  await logoutCurrentSession();
  redirect(AUTH_ADMIN_LOGIN_PATH);
}
