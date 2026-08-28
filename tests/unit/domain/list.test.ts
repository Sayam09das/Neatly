import { describe, expect, it } from "vitest";
import { PAGINATION_MAX_LIMIT } from "../../../apps/server/src/config/constants.ts";
import {
  resolvePagination,
  resolveSort,
} from "../../../apps/server/src/lib/domain/list.ts";
import { ValidationError } from "../../../apps/server/src/lib/errors.ts";

describe("resolvePagination", (): void => {
  it("applies defaults and caps oversized limits", (): void => {
    expect(resolvePagination(undefined)).toEqual({
      limit: 20,
      page: 1,
      skip: 0,
    });
    expect(resolvePagination({ limit: 500, page: 3, skip: 0 })).toEqual({
      limit: PAGINATION_MAX_LIMIT,
      page: 3,
      skip: PAGINATION_MAX_LIMIT * 2,
    });
  });
});

describe("resolveSort", (): void => {
  it("keeps whitelisted fields and rejects unknown fields", (): void => {
    expect(
      resolveSort({ direction: "asc", field: "name" }, ["name", "email"]),
    ).toEqual({ direction: "asc", field: "name" });
    expect((): void => {
      resolveSort({ direction: "desc", field: "passwordHash" }, ["name"]);
    }).toThrow(ValidationError);
  });
});
