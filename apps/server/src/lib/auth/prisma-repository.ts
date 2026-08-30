import { AUTH_OPERATOR_ROLES } from "../../config/auth.ts";
import { prisma } from "../db.ts";
import type {
  AuthEmailVerificationRecord,
  AuthPasswordResetRecord,
  AuthRepository,
  AuthSessionRecord,
  AuthUserRecord,
  CreateEmailVerificationRecordInput,
  CreatePasswordResetRecordInput,
  CreateSessionRecordInput,
  CreateUserRecordInput,
} from "./repository.ts";

function toUserRecord(user: {
  email: string;
  emailVerifiedAt: Date | null;
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
    emailVerifiedAt: user.emailVerifiedAt,
    lastLoginAt: user.lastLoginAt,
  };
}

function toSessionRecord(session: {
  createdAt: Date;
  expiresAt: Date;
  id: string;
  tokenHash: string;
  userId: string;
}): AuthSessionRecord {
  return {
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    id: session.id,
    tokenHash: session.tokenHash,
    userId: session.userId,
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

function toVerificationRecord(token: {
  expiresAt: Date;
  id: string;
  tokenHash: string;
  usedAt: Date | null;
  userId: string;
}): AuthEmailVerificationRecord {
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

  public async countAdminOperators(): Promise<number> {
    return prisma.user.count({
      where: {
        role: {
          in: [...AUTH_OPERATOR_ROLES],
        },
      },
    });
  }

  public async createUser(
    input: CreateUserRecordInput,
  ): Promise<AuthUserRecord> {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        emailVerifiedAt: input.emailVerifiedAt ?? null,
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

  public async updateUserStatus(
    userId: string,
    status: AuthUserRecord["status"],
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  }

  public async markLogin(userId: string, at: Date): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: at },
    });
  }

  public async markEmailVerified(userId: string, at: Date): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerifiedAt: at },
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

  public async findSessionById(id: string): Promise<AuthSessionRecord | null> {
    const session = await prisma.session.findUnique({
      where: { id },
    });

    return session === null ? null : toSessionRecord(session);
  }

  public async listSessionsByUserId(
    userId: string,
  ): Promise<readonly AuthSessionRecord[]> {
    const sessions = await prisma.session.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId },
    });

    return sessions.map(toSessionRecord);
  }

  public async deleteSessionById(id: string, userId: string): Promise<boolean> {
    const result = await prisma.session.deleteMany({
      where: { id, userId },
    });

    return result.count === 1;
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

  public async deleteSessionsForUserExcept(
    userId: string,
    keepTokenHash: string,
  ): Promise<void> {
    await prisma.session.deleteMany({
      where: {
        tokenHash: { not: keepTokenHash },
        userId,
      },
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

  public async createEmailVerificationToken(
    input: CreateEmailVerificationRecordInput,
  ): Promise<AuthEmailVerificationRecord> {
    const token = await prisma.emailVerificationToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
      },
    });

    return toVerificationRecord(token);
  }

  public async findEmailVerificationTokenByHash(
    tokenHash: string,
  ): Promise<AuthEmailVerificationRecord | null> {
    const token = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });

    return token === null ? null : toVerificationRecord(token);
  }

  public async consumeEmailVerificationToken(
    tokenId: string,
    usedAt: Date,
  ): Promise<boolean> {
    const result = await prisma.emailVerificationToken.updateMany({
      where: {
        id: tokenId,
        usedAt: null,
      },
      data: { usedAt },
    });

    return result.count === 1;
  }

  public async deleteEmailVerificationTokensForUser(
    userId: string,
  ): Promise<void> {
    await prisma.emailVerificationToken.deleteMany({
      where: { userId },
    });
  }

  public async completePasswordReset(input: {
    passwordHash: string;
    tokenId: string;
    usedAt: Date;
    userId: string;
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
