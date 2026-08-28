import { redirect } from "next/navigation";
import { AUTH_ADMIN_REGISTER_PATH } from "@/config/auth";

export default function RegisterAliasPage(): never {
  redirect(AUTH_ADMIN_REGISTER_PATH);
}
