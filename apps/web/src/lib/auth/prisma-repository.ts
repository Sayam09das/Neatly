import { prisma } from "@neatly/api/db";
import type {
  AuthPasswordResetRecord,
  AuthRepository,
  AuthSessionRecord,
  AuthUserRecord,
  CreatePasswordResetRecordInput,
  CreateSessionRecordInput,
  CreateUserRecordInput,
} from "@/lib/auth/repository";

function toUserRecord(user: {
  email: string;
  id: string;
  lastLoginAt: Date | null;
  name: string;
  passwordHash: string;
  role: AuthUserRecord["role"];
  status: AuthUserRecord["status"];
}): AuthUserRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
  };
}

function toSessionRecord(session: {
  expiresAt: Date;
  id: string;
  tokenHash: string;
  userId: string;
}): AuthSessionRecord {
  return {
    id: session.id,
    userId: session.userId,
    tokenHash: session.tokenHash,
    expiresAt: session.expiresAt,
  };
}

function toResetRecord(token: {
  expiresAt: Date;
  id: string;
  tokenHash: string;
  usedAt: Date | null;
  userId: string;
}): AuthPasswordResetRecord {
  return {
    id: token.id,
    userId: token.userId,
    tokenHash: token.tokenHash,
    expiresAt: token.expiresAt,
    usedAt: token.usedAt,
  };
}

export class PrismaAuthRepository implements AuthRepository {
  public async findUserByEmail(email: string): Promise<AuthUserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user === null ? null : toUserRecord(user);
  }

  public async findUserById(id: string): Promise<AuthUserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user === null ? null : toUserRecord(user);
  }

  public async createUser(
    input: CreateUserRecordInput,
  ): Promise<AuthUserRecord> {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role ?? "ADMIN",
        status: input.status ?? "ACTIVE",
      },
    });

    return toUserRecord(user);
  }

  public async updatePasswordHash(
    userId: string,
    passwordHash: string,
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  public async markLogin(userId: string, at: Date): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: at },
    });
  }

  public async createSession(
    input: CreateSessionRecordInput,
  ): Promise<AuthSessionRecord> {
    const session = await prisma.session.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
      },
    });

    return toSessionRecord(session);
  }

  public async findSessionByTokenHash(
    tokenHash: string,
  ): Promise<AuthSessionRecord | null> {
    const session = await prisma.session.findUnique({
      where: { tokenHash },
    });

    return session === null ? null : toSessionRecord(session);
  }

  public async deleteSessionByTokenHash(tokenHash: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { tokenHash },
    });
  }

  public async deleteSessionsForUser(userId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { userId },
    });
  }

  public async createPasswordResetToken(
    input: CreatePasswordResetRecordInput,
  ): Promise<AuthPasswordResetRecord> {
    const token = await prisma.passwordResetToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
      },
    });

    return toResetRecord(token);
  }

  public async findPasswordResetTokenByHash(
    tokenHash: string,
  ): Promise<AuthPasswordResetRecord | null> {
    const token = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    return token === null ? null : toResetRecord(token);
  }

  public async consumePasswordResetToken(
    tokenId: string,
    usedAt: Date,
  ): Promise<boolean> {
    const result = await prisma.passwordResetToken.updateMany({
      where: {
        id: tokenId,
        usedAt: null,
      },
      data: { usedAt },
    });

    return result.count === 1;
  }

  public async deletePasswordResetTokensForUser(userId: string): Promise<void> {
    await prisma.passwordResetToken.deleteMany({
      where: { userId },
    });
  }

  public async completePasswordReset(input: {
    tokenId: string;
    userId: string;
    passwordHash: string;
    usedAt: Date;
  }): Promise<boolean> {
    return prisma.$transaction(async (tx): Promise<boolean> => {
      const consumed = await tx.passwordResetToken.updateMany({
        where: {
          id: input.tokenId,
          usedAt: null,
        },
        data: { usedAt: input.usedAt },
      });

      if (consumed.count !== 1) {
        return false;
      }

      await tx.user.update({
        where: { id: input.userId },
        data: { passwordHash: input.passwordHash },
      });

      await tx.session.deleteMany({
        where: { userId: input.userId },
      });

      await tx.passwordResetToken.deleteMany({
        where: {
          userId: input.userId,
          id: { not: input.tokenId },
        },
      });

      return true;
    });
  }
}
