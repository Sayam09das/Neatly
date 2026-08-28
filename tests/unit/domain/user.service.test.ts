import { describe, expect, it } from "vitest";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import {
  AuthorizationError,
  NotFoundError,
} from "../../../apps/server/src/lib/errors.ts";
import { createDomainHarness } from "./in-memory-domain.ts";

const admin: Actor = { id: "admin-1", role: "ADMIN" };

describe("UserService", (): void => {
  it("returns profiles without secrets and updates allowed fields", async (): Promise<void> => {
    const { store, users } = createDomainHarness();
    const now = new Date("2026-08-29T00:00:00.000Z");
    store.users.set("user-1", {
      createdAt: now,
      email: "admin@neatly.example",
      emailVerifiedAt: now,
      id: "user-1",
      lastLoginAt: null,
      name: "Neatly Admin",
      role: "ADMIN",
      status: "ACTIVE",
      updatedAt: now,
    });

    const profile = await users.getById(admin, "user-1");
    expect(profile).not.toHaveProperty("passwordHash");
    expect(Object.keys(profile).sort()).toEqual([
      "createdAt",
      "email",
      "emailVerifiedAt",
      "id",
      "lastLoginAt",
      "name",
      "role",
      "status",
      "updatedAt",
    ]);

    const renamed = await users.updateProfile(admin, "user-1", {
      name: "Ada Admin",
    });
    expect(renamed.name).toBe("Ada Admin");

    const suspended = await users.setStatus(admin, "user-1", "SUSPENDED");
    expect(suspended.status).toBe("SUSPENDED");

    const listed = await users.list(admin, { search: "ada" });
    expect(listed.items).toHaveLength(1);
  });

  it("rejects missing users and non-admin access", async (): Promise<void> => {
    const { users } = createDomainHarness();
    const portal: Actor = { id: "customer-1", role: "CUSTOMER" };

    await expect(users.getById(admin, "missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
    await expect(users.list(portal)).rejects.toBeInstanceOf(AuthorizationError);
  });
});
