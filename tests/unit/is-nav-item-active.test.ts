import { describe, expect, it } from "vitest";
import { isNavItemActive } from "@/components/layout/navbar/is-nav-item-active";
import { getPublishedPhone } from "@/config/landing";

describe("isNavItemActive", (): void => {
  it("treats / as exact-only", (): void => {
    expect(isNavItemActive("/", "/")).toBe(true);
    expect(isNavItemActive("/about", "/")).toBe(false);
  });

  it("activates a section for itself and nested routes", (): void => {
    expect(isNavItemActive("/services", "/services")).toBe(true);
    expect(isNavItemActive("/services/deep-clean", "/services")).toBe(true);
    expect(isNavItemActive("/services-extra", "/services")).toBe(false);
    expect(isNavItemActive("/blog", "/services")).toBe(false);
  });
});

describe("getPublishedPhone", (): void => {
  it("does not publish development placeholder contact as a live number", (): void => {
    expect(getPublishedPhone()).toBeNull();
  });
});
