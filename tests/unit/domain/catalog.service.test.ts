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

  it("returns a customer-safe public detail by slug and hides inactive offerings", async (): Promise<void> => {
    const { catalog } = createDomainHarness();
    const visible = await catalog.create(admin, {
      ...offeringInput,
      benefits: ["Dusted surfaces"],
      excludedTasks: ["Interior oven"],
      faqs: [{ answer: "Yes, weekly.", question: "Is this recurring?" }],
      includedTasks: ["Kitchen counters"],
      seoDescription: "Weekly home tidy.",
      seoTitle: "Home Refresh Cleaning",
    });

    const detail = await catalog.getPublicBySlug("home-refresh");
    expect(detail.id).toBe(visible.id);
    expect(detail.fullDescription).toBe(offeringInput.fullDescription);
    expect(detail.benefits).toEqual(["Dusted surfaces"]);
    expect(detail.includedTasks).toEqual(["Kitchen counters"]);
    expect(detail.excludedTasks).toEqual(["Interior oven"]);
    expect(detail.faqs).toEqual([
      { answer: "Yes, weekly.", question: "Is this recurring?" },
    ]);
    expect(JSON.stringify(detail)).not.toContain("isActive");
    expect(JSON.stringify(detail)).not.toContain("coverMediaId");

    await catalog.archive(admin, visible.id);
    await expect(
      catalog.getPublicBySlug("home-refresh"),
    ).rejects.toBeInstanceOf(NotFoundError);
    await expect(catalog.getPublicBySlug("missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("lists only active public offerings and omits admin catalog fields", async (): Promise<void> => {
    const { catalog } = createDomainHarness();
    const visible = await catalog.create(admin, offeringInput);
    await catalog.create(admin, {
      fullDescription: "Office clean.",
      isFeatured: true,
      name: "Studio Reset",
      shortDescription: "Desk and kitchen tidy",
    });
    const archived = await catalog.create(admin, {
      fullDescription: "Archived offering.",
      name: "Retired Clean",
      shortDescription: "No longer offered",
    });
    await catalog.archive(admin, archived.id);

    const result = await catalog.listPublic({ search: "desk" });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual({
      coverImageAlt: null,
      coverImageUrl: null,
      id: expect.any(String),
      isFeatured: true,
      name: "Studio Reset",
      shortDescription: "Desk and kitchen tidy",
      slug: "studio-reset",
    });
    expect(result.items[0]?.id).not.toBe(visible.id);
    expect(JSON.stringify(result.items)).not.toContain("faqs");
    expect(JSON.stringify(result.items)).not.toContain("seoTitle");
    expect(JSON.stringify(result.items)).not.toContain("isActive");
    expect(JSON.stringify(result.items)).not.toContain("coverMediaId");
  });

  it("rejects missing offerings", async (): Promise<void> => {
    const { catalog } = createDomainHarness();
    await expect(catalog.getById("missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
