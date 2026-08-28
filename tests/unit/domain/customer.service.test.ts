import { describe, expect, it } from "vitest";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import {
  AuthorizationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../apps/server/src/lib/errors.ts";
import { createDomainHarness } from "./in-memory-domain.ts";

const admin: Actor = { id: "admin-1", role: "ADMIN" };
const otherCustomer: Actor = { id: "customer-b", role: "CUSTOMER" };

describe("CustomerService", (): void => {
  it("creates, retrieves, updates, searches, and paginates customers", async (): Promise<void> => {
    const { customers } = createDomainHarness();
    const created = await customers.create(admin, {
      email: "Ada@Neatly.example",
      name: "Ada Customer",
      phone: "555-0100",
    });

    expect(created.email).toBe("ada@neatly.example");
    expect(created.status).toBe("ACTIVE");
    expect(created).not.toHaveProperty("passwordHash");

    const fetched = await customers.getById(admin, created.id);
    expect(fetched.id).toBe(created.id);

    const updated = await customers.update(admin, created.id, {
      name: "Ada Updated",
    });
    expect(updated.name).toBe("Ada Updated");

    await customers.create(admin, {
      email: "ben@neatly.example",
      name: "Ben Customer",
    });

    const listed = await customers.list(admin, {
      pagination: { limit: 1, page: 1, skip: 0 },
      search: "ada",
      sort: { direction: "asc", field: "name" },
    });
    expect(listed.items).toHaveLength(1);
    expect(listed.pagination.total).toBe(1);
    expect(listed.pagination.limit).toBe(1);
  });

  it("rejects duplicate emails and missing customers", async (): Promise<void> => {
    const { customers } = createDomainHarness();
    await customers.create(admin, {
      email: "ada@neatly.example",
      name: "Ada",
    });

    await expect(
      customers.create(admin, {
        email: "ada@neatly.example",
        name: "Ada Two",
      }),
    ).rejects.toBeInstanceOf(ConflictError);

    await expect(customers.getById(admin, "missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
    await expect(
      customers.create(admin, { email: "ok@neatly.example", name: "   " }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("deactivates customers and enforces ownership", async (): Promise<void> => {
    const { customers } = createDomainHarness();
    const created = await customers.create(admin, {
      email: "ada@neatly.example",
      name: "Ada",
      userId: "customer-a",
    });

    const owner: Actor = { id: "customer-a", role: "CUSTOMER" };
    await expect(customers.getById(owner, created.id)).resolves.toMatchObject({
      id: created.id,
    });
    await expect(
      customers.getById(otherCustomer, created.id),
    ).rejects.toBeInstanceOf(AuthorizationError);
    await expect(
      customers.update(otherCustomer, created.id, { name: "Hacked" }),
    ).rejects.toBeInstanceOf(AuthorizationError);
    await expect(customers.list(owner)).rejects.toBeInstanceOf(
      AuthorizationError,
    );

    const inactive = await customers.deactivate(admin, created.id);
    expect(inactive.status).toBe("INACTIVE");

    const stats = await customers.stats(admin);
    expect(stats).toEqual({ active: 0, inactive: 1, total: 1 });

    const restored = await customers.activate(admin, created.id);
    expect(restored.status).toBe("ACTIVE");
  });
});
