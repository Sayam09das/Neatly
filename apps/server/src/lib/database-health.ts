import { prisma } from "./db.ts";
import { logError } from "./logger.ts";

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    logError("Database health check failed");
    return false;
  }
}
