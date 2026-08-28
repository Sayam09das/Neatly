import { redirect } from "next/navigation";
import { AUTH_ADMIN_LOGIN_PATH } from "@/config/auth";

export default function LoginAliasPage(): never {
  redirect(AUTH_ADMIN_LOGIN_PATH);
}
