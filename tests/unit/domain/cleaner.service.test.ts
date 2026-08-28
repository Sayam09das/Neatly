import { describe, expect, it } from "vitest";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import {
  AuthorizationError,
  ConflictError,
  NotFoundError,
} from "../../../apps/server/src/lib/errors.ts";
import { createDomainHarness } from "./in-memory-domain.ts";

const admin: Actor = { id: "admin-1", role: "ADMIN" };

describe("CleanerService", (): void => {
  it("creates, retrieves, updates, and deactivates cleaners", async (): Promise<void> => {
    const { cleaners } = createDomainHarness();
    const created = await cleaners.create(admin, {
      email: "Mia@Neatly.example",
      name: "Mia Cleaner",
    });

    expect(created.email).toBe("mia@neatly.example");
    expect(created.status).toBe("ACTIVE");

    const fetched = await cleaners.getById(admin, created.id);
    expect(fetched.name).toBe("Mia Cleaner");

    const updated = await cleaners.update(admin, created.id, {
      name: "Mia Updated",
    });
    expect(updated.name).toBe("Mia Updated");

    await expect(
      cleaners.create(admin, {
        email: "mia@neatly.example",
        name: "Duplicate",
      }),
    ).rejects.toBeInstanceOf(ConflictError);

    const inactive = await cleaners.deactivate(admin, created.id);
    expect(inactive.status).toBe("INACTIVE");

    const stats = await cleaners.stats(admin);
    expect(stats.inactive).toBe(1);

    const restored = await cleaners.activate(admin, created.id);
    expect(restored.status).toBe("ACTIVE");
  });

  it("rejects missing cleaners and non-admin lists", async (): Promise<void> => {
    const { cleaners } = createDomainHarness();
    const portal: Actor = { id: "cleaner-1", role: "CLEANER" };

    await expect(cleaners.getById(admin, "missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
    await expect(cleaners.list(portal)).rejects.toBeInstanceOf(
      AuthorizationError,
    );
  });
});
