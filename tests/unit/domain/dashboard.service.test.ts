import { describe, expect, it } from "vitest";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import { AuthorizationError } from "../../../apps/server/src/lib/errors.ts";
import { createDomainHarness } from "./in-memory-domain.ts";

const admin: Actor = { id: "admin-1", role: "ADMIN" };
const portal: Actor = { id: "customer-1", role: "CUSTOMER" };

describe("DashboardService", (): void => {
  it("aggregates live counts without fabricating revenue", async (): Promise<void> => {
    const { catalog, customers, dashboard, reviews } = createDomainHarness();
    await customers.create(admin, {
      email: "ada@neatly.example",
      name: "Ada",
    });
    await catalog.create(admin, {
      fullDescription: "Full clean",
      name: "Home Refresh",
      shortDescription: "Weekly tidy",
    });
    await reviews.create(admin, {
      content: "Spotless",
      customerName: "Ada",
      rating: 5,
    });

    const metrics = await dashboard.getMetrics(admin);
    expect(metrics.customers).toEqual({ active: 1, total: 1 });
    expect(metrics.services).toEqual({ active: 1, total: 1 });
    expect(metrics.reviews).toEqual({ active: 1, total: 1 });
    expect(metrics.bookings.total).toBe(0);
    expect(metrics).not.toHaveProperty("revenue");

    await expect(dashboard.getMetrics(portal)).rejects.toBeInstanceOf(
      AuthorizationError,
    );
  });
});

describe("AdminService", (): void => {
  it("delegates customer deactivation instead of duplicating rules", async (): Promise<void> => {
    const { admin: adminService, customers } = createDomainHarness();
    const created = await customers.create(admin, {
      email: "ada@neatly.example",
      name: "Ada",
    });

    const inactive = await adminService.deactivateCustomer(admin, created.id);
    expect(inactive.status).toBe("INACTIVE");

    await expect(
      adminService.deactivateCustomer(portal, created.id),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });
});
