import { describe, expect, it } from "vitest";
import { AuthError } from "../../../apps/server/src/lib/auth/errors.ts";
import { verifyPassword } from "../../../apps/server/src/lib/auth/password.ts";
import { MemoryRateLimiter } from "../../../apps/server/src/lib/auth/rate-limit.ts";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import { ValidationError } from "../../../apps/server/src/lib/errors.ts";
import { AuthService } from "../../../apps/server/src/services/auth.service.ts";
import type {
  CleanerInvitationEmailInput,
  EmailProvider,
  PasswordResetEmailInput,
  VerificationEmailInput,
} from "../../../apps/server/src/services/email/provider.ts";
import { EmailService } from "../../../apps/server/src/services/email.service.ts";
import { InMemoryAuthRepository } from "../auth/in-memory-auth-repository";
import { createDomainHarness } from "./in-memory-domain.ts";

const SESSION_SECRET = "test-session-secret-value-32-chars-min";
const SITE_URL = "https://neatly.example";
const CLEANER_PASSWORD = "correct-horse-battery-staple";
const admin: Actor = { id: "admin-1", role: "ADMIN" };
const context = { ip: "127.0.0.1" };

class RecordingEmailProvider implements EmailProvider {
  public failInvitation = false;
  public readonly invitations: CleanerInvitationEmailInput[] = [];

  public async sendPasswordResetEmail(
    _input: PasswordResetEmailInput,
  ): Promise<void> {
    return undefined;
  }

  public async sendVerificationEmail(
    _input: VerificationEmailInput,
  ): Promise<void> {
    return undefined;
  }

  public async sendCleanerInvitationEmail(
    input: CleanerInvitationEmailInput,
  ): Promise<void> {
    if (this.failInvitation) {
      throw new Error("Invitation email failed.");
    }

    this.invitations.push(input);
  }
}

function createInvitationHarness(now?: () => Date): {
  auth: AuthService;
  cleaners: ReturnType<typeof createDomainHarness>["cleaners"];
  emails: RecordingEmailProvider;
  repository: InMemoryAuthRepository;
} {
  const repository = new InMemoryAuthRepository();
  const emails = new RecordingEmailProvider();
  const auth = new AuthService(
    repository,
    new EmailService(emails),
    SESSION_SECRET,
    {
      now,
      siteUrl: SITE_URL,
      verifyLimiter: new MemoryRateLimiter(),
    },
  );
  const { cleaners } = createDomainHarness(now, auth);

  return { auth, cleaners, emails, repository };
}

function tokenFromUrl(url: string): string {
  return new URL(url).searchParams.get("token") ?? "";
}

describe("Cleaner invitation domain", (): void => {
  it("lets an admin invite a cleaner without emailing a password", async (): Promise<void> => {
    const { auth, cleaners, emails, repository } = createInvitationHarness();
    const result = await cleaners.invite(
      admin,
      {
        email: "Mia@Neatly.example",
        name: "Mia Cleaner",
        phone: "555-0100",
      },
      context,
    );

    expect(result.invitationSent).toBe(true);
    expect(result.cleaner.accountState).toBe("INVITED");
    expect(result.cleaner.status).toBe("INACTIVE");
    expect(result.cleaner.email).toBe("mia@neatly.example");
    expect(emails.invitations[0]?.to).toBe("mia@neatly.example");
    expect(emails.invitations[0]?.activateUrl).toContain("/cleaner/activate");
    expect(JSON.stringify(emails.invitations[0])).not.toContain(
      CLEANER_PASSWORD,
    );

    const user = await auth.findUserByEmail("mia@neatly.example");
    expect(user?.role).toBe("STAFF");
    expect(user?.status).toBe("INACTIVE");
    expect(user?.emailVerifiedAt).toBeNull();
    expect(user?.passwordHash).not.toBe(CLEANER_PASSWORD);
    expect(repository.verificationTokens).toHaveLength(1);
  });

  it("rejects duplicate emails, non-admins, and role assignment from the client", async (): Promise<void> => {
    const { cleaners } = createInvitationHarness();
    await cleaners.invite(
      admin,
      {
        email: "mia@neatly.example",
        name: "Mia Cleaner",
        phone: "555-0100",
      },
      context,
    );

    await expect(
      cleaners.invite(
        admin,
        {
          email: "mia@neatly.example",
          name: "Other",
          phone: "555-0101",
        },
        context,
      ),
    ).rejects.toBeInstanceOf(ValidationError);

    await expect(
      cleaners.invite(
        { id: "cleaner-1", role: "CLEANER" },
        {
          email: "other@neatly.example",
          name: "Other",
          phone: "555-0101",
        },
        context,
      ),
    ).rejects.toThrow();
  });

  it("activates a single-use invitation and blocks reuse, expiry, and deactivated login", async (): Promise<void> => {
    let now = new Date("2026-08-30T10:00:00.000Z");
    const { auth, cleaners, emails } = createInvitationHarness((): Date => now);
    const invited = await cleaners.invite(
      admin,
      {
        email: "mia@neatly.example",
        name: "Mia Cleaner",
        phone: "555-0100",
      },
      context,
    );
    const token = tokenFromUrl(emails.invitations[0]?.activateUrl ?? "");
    const inspection = await cleaners.inspectInvitation(token);
    expect(inspection).toMatchObject({
      email: "mia@neatly.example",
      status: "valid",
    });

    const activated = await cleaners.activateInvitation(
      { password: CLEANER_PASSWORD, token },
      context,
    );
    expect(activated.user.status).toBe("ACTIVE");
    expect(activated.sessionToken).toBeTruthy();

    const user = await auth.findUserByEmail("mia@neatly.example");
    expect(user?.status).toBe("ACTIVE");
    expect(user?.emailVerifiedAt).not.toBeNull();
    expect(
      await verifyPassword(CLEANER_PASSWORD, user?.passwordHash ?? ""),
    ).toBe(true);

    const cleaner = await cleaners.getById(admin, invited.cleaner.id);
    expect(cleaner.accountState).toBe("ACTIVE");
    expect(cleaner.status).toBe("ACTIVE");

    await expect(
      cleaners.activateInvitation(
        { password: CLEANER_PASSWORD, token },
        context,
      ),
    ).rejects.toBeInstanceOf(AuthError);

    await expect(cleaners.inspectInvitation(token)).resolves.toEqual({
      status: "invalid",
    });

    const expired = await cleaners.invite(
      admin,
      {
        email: "expired@neatly.example",
        name: "Expired Cleaner",
        phone: "555-0102",
      },
      context,
    );
    const expiredToken = tokenFromUrl(emails.invitations[1]?.activateUrl ?? "");
    now = new Date("2026-09-07T10:00:01.000Z");
    await expect(cleaners.inspectInvitation(expiredToken)).resolves.toEqual({
      status: "expired",
    });
    await expect(
      cleaners.activateInvitation(
        { password: CLEANER_PASSWORD, token: expiredToken },
        context,
      ),
    ).rejects.toMatchObject({ code: "TOKEN_EXPIRED" });
    expect(expired.cleaner.accountState).toBe("INVITED");

    const deactivated = await cleaners.deactivate(admin, invited.cleaner.id);
    expect(deactivated.status).toBe("INACTIVE");
    const deactivatedUser = await auth.findUserByEmail("mia@neatly.example");
    expect(deactivatedUser?.status).toBe("INACTIVE");

    await expect(
      auth.authenticateUser(
        { email: "mia@neatly.example", password: CLEANER_PASSWORD },
        context,
      ),
    ).rejects.toBeInstanceOf(AuthError);

    const restored = await cleaners.activate(admin, invited.cleaner.id);
    expect(restored.status).toBe("ACTIVE");
    const session = await auth.authenticateUser(
      { email: "mia@neatly.example", password: CLEANER_PASSWORD },
      context,
    );
    expect(session.user.id).toBe(user?.id);
  });

  it("resends invitations and reports email failure without duplicating the cleaner", async (): Promise<void> => {
    const { cleaners, emails } = createInvitationHarness();
    emails.failInvitation = true;
    const created = await cleaners.invite(
      admin,
      {
        email: "mia@neatly.example",
        name: "Mia Cleaner",
        phone: "555-0100",
      },
      context,
    );
    expect(created.invitationSent).toBe(false);
    expect(created.cleaner.accountState).toBe("INVITED");

    emails.failInvitation = false;
    const resent = await cleaners.resendInvitation(
      admin,
      created.cleaner.id,
      context,
    );
    expect(resent.invitationSent).toBe(true);
    expect(emails.invitations).toHaveLength(1);

    const listed = await cleaners.list(admin);
    expect(listed.items).toHaveLength(1);
  });

  it("does not activate an invited cleaner from the admin activate action", async (): Promise<void> => {
    const { cleaners } = createInvitationHarness();
    const created = await cleaners.invite(
      admin,
      {
        email: "mia@neatly.example",
        name: "Mia Cleaner",
        phone: "555-0100",
      },
      context,
    );

    await expect(
      cleaners.activate(admin, created.cleaner.id),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
