import { describe, expect, it } from "vitest";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import {
  NotFoundError,
  ValidationError,
} from "../../../apps/server/src/lib/errors.ts";
import { createDomainHarness } from "./in-memory-domain.ts";

const admin: Actor = { id: "admin-1", role: "ADMIN" };

describe("ReviewService", (): void => {
  it("creates, retrieves, updates, and hides testimonials", async (): Promise<void> => {
    const { reviews } = createDomainHarness();
    const created = await reviews.create(admin, {
      content: "The team left the kitchen spotless.",
      customerName: "Ada",
      rating: 5,
    });

    expect(created.isActive).toBe(true);
    expect(created.rating).toBe(5);

    const fetched = await reviews.getById(created.id);
    expect(fetched.id).toBe(created.id);

    const updated = await reviews.update(admin, created.id, { rating: 4 });
    expect(updated.rating).toBe(4);

    const hidden = await reviews.hide(admin, created.id);
    expect(hidden.isActive).toBe(false);
    await expect(reviews.getById(created.id)).rejects.toBeInstanceOf(
      NotFoundError,
    );
    await expect(reviews.getById(created.id, admin)).resolves.toMatchObject({
      isActive: false,
    });
  });

  it("rejects invalid ratings and missing reviews", async (): Promise<void> => {
    const { reviews } = createDomainHarness();
    await expect(
      reviews.create(admin, {
        content: "Nice",
        customerName: "Ada",
        rating: 6,
      }),
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(reviews.getById("missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
