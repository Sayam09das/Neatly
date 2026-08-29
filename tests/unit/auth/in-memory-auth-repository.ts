import { randomUUID } from "node:crypto";
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
} from "../../../apps/server/src/lib/auth/repository.ts";

export class InMemoryAuthRepository implements AuthRepository {
  public readonly resetTokens: AuthPasswordResetRecord[] = [];
  public readonly sessions: AuthSessionRecord[] = [];
  public readonly users: AuthUserRecord[] = [];
  public readonly verificationTokens: AuthEmailVerificationRecord[] = [];

  public async findUserByEmail(email: string): Promise<AuthUserRecord | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  public async findUserById(id: string): Promise<AuthUserRecord | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  public async createUser(
    input: CreateUserRecordInput,
  ): Promise<AuthUserRecord> {
    const user: AuthUserRecord = {
      email: input.email,
      emailVerifiedAt: input.emailVerifiedAt ?? null,
      id: randomUUID(),
      lastLoginAt: null,
      name: input.name,
      passwordHash: input.passwordHash,
      role: input.role ?? "ADMIN",
      status: input.status ?? "ACTIVE",
    };
    this.users.push(user);
    return user;
  }

  public async updatePasswordHash(
    userId: string,
    passwordHash: string,
  ): Promise<void> {
    const user = await this.findUserById(userId);

    if (user !== null) {
      user.passwordHash = passwordHash;
    }
  }

  public async markLogin(userId: string, at: Date): Promise<void> {
    const user = await this.findUserById(userId);

    if (user !== null) {
      user.lastLoginAt = at;
    }
  }

  public async markEmailVerified(userId: string, at: Date): Promise<void> {
    const user = await this.findUserById(userId);

    if (user !== null) {
      user.emailVerifiedAt = at;
    }
  }

  public async createSession(
    input: CreateSessionRecordInput,
  ): Promise<AuthSessionRecord> {
    const session: AuthSessionRecord = {
      createdAt: new Date(),
      expiresAt: input.expiresAt,
      id: randomUUID(),
      tokenHash: input.tokenHash,
      userId: input.userId,
    };
    this.sessions.push(session);
    return session;
  }

  public async findSessionByTokenHash(
    tokenHash: string,
  ): Promise<AuthSessionRecord | null> {
    return (
      this.sessions.find((session) => session.tokenHash === tokenHash) ?? null
    );
  }

  public async deleteSessionByTokenHash(tokenHash: string): Promise<void> {
    const index = this.sessions.findIndex(
      (session) => session.tokenHash === tokenHash,
    );

    if (index >= 0) {
      this.sessions.splice(index, 1);
    }
  }

  public async findSessionById(id: string): Promise<AuthSessionRecord | null> {
    return this.sessions.find((session) => session.id === id) ?? null;
  }

  public async listSessionsByUserId(
    userId: string,
  ): Promise<readonly AuthSessionRecord[]> {
    return this.sessions
      .filter((session) => session.userId === userId)
      .sort(
        (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
      );
  }

  public async deleteSessionById(id: string, userId: string): Promise<boolean> {
    const index = this.sessions.findIndex(
      (session) => session.id === id && session.userId === userId,
    );

    if (index < 0) {
      return false;
    }

    this.sessions.splice(index, 1);
    return true;
  }

  public async deleteSessionsForUser(userId: string): Promise<void> {
    for (let index = this.sessions.length - 1; index >= 0; index -= 1) {
      if (this.sessions[index]?.userId === userId) {
        this.sessions.splice(index, 1);
      }
    }
  }

  public async deleteSessionsForUserExcept(
    userId: string,
    keepTokenHash: string,
  ): Promise<void> {
    for (let index = this.sessions.length - 1; index >= 0; index -= 1) {
      const session = this.sessions[index];

      if (
        session !== undefined &&
        session.userId === userId &&
        session.tokenHash !== keepTokenHash
      ) {
        this.sessions.splice(index, 1);
      }
    }
  }

  public async createPasswordResetToken(
    input: CreatePasswordResetRecordInput,
  ): Promise<AuthPasswordResetRecord> {
    const token: AuthPasswordResetRecord = {
      expiresAt: input.expiresAt,
      id: randomUUID(),
      tokenHash: input.tokenHash,
      usedAt: null,
      userId: input.userId,
    };
    this.resetTokens.push(token);
    return token;
  }

  public async findPasswordResetTokenByHash(
    tokenHash: string,
  ): Promise<AuthPasswordResetRecord | null> {
    return (
      this.resetTokens.find((token) => token.tokenHash === tokenHash) ?? null
    );
  }

  public async consumePasswordResetToken(
    tokenId: string,
    usedAt: Date,
  ): Promise<boolean> {
    const token = this.resetTokens.find((item) => item.id === tokenId);

    if (token === undefined || token.usedAt !== null) {
      return false;
    }

    token.usedAt = usedAt;
    return true;
  }

  public async deletePasswordResetTokensForUser(userId: string): Promise<void> {
    for (let index = this.resetTokens.length - 1; index >= 0; index -= 1) {
      if (this.resetTokens[index]?.userId === userId) {
        this.resetTokens.splice(index, 1);
      }
    }
  }

  public async createEmailVerificationToken(
    input: CreateEmailVerificationRecordInput,
  ): Promise<AuthEmailVerificationRecord> {
    const token: AuthEmailVerificationRecord = {
      expiresAt: input.expiresAt,
      id: randomUUID(),
      tokenHash: input.tokenHash,
      usedAt: null,
      userId: input.userId,
    };
    this.verificationTokens.push(token);
    return token;
  }

  public async findEmailVerificationTokenByHash(
    tokenHash: string,
  ): Promise<AuthEmailVerificationRecord | null> {
    return (
      this.verificationTokens.find((token) => token.tokenHash === tokenHash) ??
      null
    );
  }

  public async consumeEmailVerificationToken(
    tokenId: string,
    usedAt: Date,
  ): Promise<boolean> {
    const token = this.verificationTokens.find((item) => item.id === tokenId);

    if (token === undefined || token.usedAt !== null) {
      return false;
    }

    token.usedAt = usedAt;
    return true;
  }

  public async deleteEmailVerificationTokensForUser(
    userId: string,
  ): Promise<void> {
    for (
      let index = this.verificationTokens.length - 1;
      index >= 0;
      index -= 1
    ) {
      if (this.verificationTokens[index]?.userId === userId) {
        this.verificationTokens.splice(index, 1);
      }
    }
  }

  public async completePasswordReset(input: {
    passwordHash: string;
    tokenId: string;
    usedAt: Date;
    userId: string;
  }): Promise<boolean> {
    const consumed = await this.consumePasswordResetToken(
      input.tokenId,
      input.usedAt,
    );

    if (!consumed) {
      return false;
    }

    await this.updatePasswordHash(input.userId, input.passwordHash);
    await this.deleteSessionsForUser(input.userId);

    for (let index = this.resetTokens.length - 1; index >= 0; index -= 1) {
      const token = this.resetTokens[index];

      if (
        token !== undefined &&
        token.userId === input.userId &&
        token.id !== input.tokenId
      ) {
        this.resetTokens.splice(index, 1);
      }
    }

    return true;
  }
}
