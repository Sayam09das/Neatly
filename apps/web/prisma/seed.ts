import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { AUTH_BCRYPT_COST } from "../src/config/auth.ts";

const DEVELOPMENT_ADMIN_EMAIL = "admin@neatly.local";
const DEVELOPMENT_ADMIN_NAME = "Neatly Admin";

const prisma = new PrismaClient();

async function seedDevelopmentAdmin(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "The development seed script must never run in production.",
    );
  }

  const password = process.env.ADMIN_SEED_PASSWORD?.trim();

  if (password === undefined || password === "") {
    throw new Error(
      "ADMIN_SEED_PASSWORD is required to seed the development admin user.",
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email: DEVELOPMENT_ADMIN_EMAIL },
  });

  if (existing !== null) {
    return;
  }

  await prisma.user.create({
    data: {
      name: DEVELOPMENT_ADMIN_NAME,
      email: DEVELOPMENT_ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(password, AUTH_BCRYPT_COST),
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
