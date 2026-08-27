import bcrypt from "bcrypt";
import { AUTH_BCRYPT_COST } from "@/config/auth";

export async function hashPassword(
  password: string,
  cost: number = AUTH_BCRYPT_COST,
): Promise<string> {
  return bcrypt.hash(password, cost);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
