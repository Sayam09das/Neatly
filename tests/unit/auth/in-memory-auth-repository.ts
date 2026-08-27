import { randomUUID } from "node:crypto";
import type {
  AuthPasswordResetRecord,
  AuthRepository,
  AuthSessionRecord,
  AuthUserRecord,
  CreatePasswordResetRecordInput,
  CreateSessionRecordInput,
  CreateUserRecordInput,
} from "@/lib/auth/repository";

export class InMemoryAuthRepository implements AuthRepository {
  public readonly users: AuthUserRecord[] = [];
  public readonly sessions: AuthSessionRecord[] = [];
  public readonly resetTokens: AuthPasswordResetRecord[] = [];

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
      id: randomUUID(),
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role ?? "ADMIN",
      status: input.status ?? "ACTIVE",
      lastLoginAt: null,
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

  public async createSession(
    input: CreateSessionRecordInput,
  ): Promise<AuthSessionRecord> {
    const session: AuthSessionRecord = {
      id: randomUUID(),
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
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

  public async deleteSessionsForUser(userId: string): Promise<void> {
    for (let index = this.sessions.length - 1; index >= 0; index -= 1) {
      if (this.sessions[index]?.userId === userId) {
        this.sessions.splice(index, 1);
      }
    }
  }

  public async createPasswordResetToken(
    input: CreatePasswordResetRecordInput,
  ): Promise<AuthPasswordResetRecord> {
    const token: AuthPasswordResetRecord = {
      id: randomUUID(),
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      usedAt: null,
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

  public async completePasswordReset(input: {
    tokenId: string;
    userId: string;
    passwordHash: string;
    usedAt: Date;
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
