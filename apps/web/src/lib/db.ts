import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  neatlyPrisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.neatlyPrisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.neatlyPrisma = prisma;
}
