import { describe, expect, it } from "vitest";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import {
  ConflictError,
  NotFoundError,
} from "../../../apps/server/src/lib/errors.ts";
import { createDomainHarness } from "./in-memory-domain.ts";

const admin: Actor = { id: "admin-1", role: "ADMIN" };
const offeringInput = {
  fullDescription: "A complete residential clean.",
  name: "Home Refresh",
  shortDescription: "Weekly tidy",
};

describe("CatalogService", (): void => {
  it("creates, retrieves, updates, and archives offerings", async (): Promise<void> => {
    const { catalog } = createDomainHarness();
    const created = await catalog.create(admin, offeringInput);

    expect(created.slug).toBe("home-refresh");
    expect(created.isActive).toBe(true);

    const fetched = await catalog.getById(created.id);
    expect(fetched.id).toBe(created.id);

    const updated = await catalog.update(admin, created.id, {
      name: "Deep Refresh",
    });
    expect(updated.slug).toBe("deep-refresh");

    await expect(
      catalog.create(admin, { ...offeringInput, slug: "deep-refresh" }),
    ).rejects.toBeInstanceOf(ConflictError);

    const archived = await catalog.archive(admin, created.id);
    expect(archived.isActive).toBe(false);

    await expect(catalog.getById(created.id)).rejects.toBeInstanceOf(
      NotFoundError,
    );
    await expect(catalog.getById(created.id, admin)).resolves.toMatchObject({
      id: created.id,
      isActive: false,
    });

    const publicList = await catalog.list({ search: "refresh" });
    expect(publicList.items).toHaveLength(0);

    const adminList = await catalog.list({ search: "refresh" }, admin);
    expect(adminList.items).toHaveLength(1);
  });

  it("rejects missing offerings", async (): Promise<void> => {
    const { catalog } = createDomainHarness();
    await expect(catalog.getById("missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
