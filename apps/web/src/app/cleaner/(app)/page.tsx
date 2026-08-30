import { redirect } from "next/navigation";
import { CLEANER_PATHS } from "@/config/cleaner";

export default function CleanerHomePage(): never {
  redirect(CLEANER_PATHS.dashboard);
}
