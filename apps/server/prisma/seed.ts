import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const AUTH_BCRYPT_COST = 12;
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

  const passwordHash = await bcrypt.hash(password, AUTH_BCRYPT_COST);

  if (existing !== null) {
    await prisma.user.update({
      data: {
        emailVerifiedAt: existing.emailVerifiedAt ?? new Date(),
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
      },
      where: { email: DEVELOPMENT_ADMIN_EMAIL },
    });
    return;
  }

  await prisma.user.create({
    data: {
      email: DEVELOPMENT_ADMIN_EMAIL,
      emailVerifiedAt: new Date(),
      name: DEVELOPMENT_ADMIN_NAME,
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
