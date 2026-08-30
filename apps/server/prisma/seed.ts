import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  AUTH_BCRYPT_COST,
  AUTH_PASSWORD_MIN_LENGTH,
} from "../src/config/auth.ts";

const prisma = new PrismaClient();

function readSeedAdmin(): {
  email: string;
  name: string;
  password: string;
} {
  const email = (process.env.ADMIN_EMAIL ?? process.env.ADMIN_SEED_EMAIL ?? "")
    .trim()
    .toLowerCase();
  const name = (
    process.env.ADMIN_USERNAME ??
    process.env.ADMIN_NAME ??
    ""
  ).trim();
  const password = (
    process.env.ADMIN_PASSWORD ??
    process.env.ADMIN_SEED_PASSWORD ??
    ""
  ).trim();

  if (email === "" || name === "" || password === "") {
    throw new Error(
      "ADMIN_EMAIL, ADMIN_USERNAME, and ADMIN_PASSWORD are required to seed the development admin user.",
    );
  }

  if (password.length < AUTH_PASSWORD_MIN_LENGTH) {
    throw new Error(
      `ADMIN_PASSWORD must be at least ${String(AUTH_PASSWORD_MIN_LENGTH)} characters.`,
    );
  }

  return { email, name, password };
}

async function seedDevelopmentAdmin(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "The development seed script must never run in production.",
    );
  }

  const { email, name, password } = readSeedAdmin();
  const passwordHash = await bcrypt.hash(password, AUTH_BCRYPT_COST);
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing !== null) {
    await prisma.user.update({
      data: {
        emailVerifiedAt: existing.emailVerifiedAt ?? new Date(),
        name,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
      },
      where: { email },
    });
    return;
  }

  await prisma.user.create({
    data: {
      email,
      emailVerifiedAt: new Date(),
      name,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
}

try {
  await seedDevelopmentAdmin();
} finally {
  await prisma.$disconnect();
}
