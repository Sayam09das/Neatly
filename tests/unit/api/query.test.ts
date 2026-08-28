import { describe, expect, it } from "vitest";
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
} from "../../../apps/server/src/config/constants.ts";
import { ValidationError } from "../../../apps/server/src/lib/errors.ts";
import {
  parseAllowedFilters,
  parsePagination,
  parseSort,
  toPaginationMeta,
} from "../../../apps/server/src/lib/query.ts";

describe("parsePagination", (): void => {
  it("applies defaults and rejects an excessive limit", (): void => {
    const defaults = parsePagination(new URLSearchParams());

    expect(defaults).toEqual({
      limit: PAGINATION_DEFAULT_LIMIT,
      page: PAGINATION_DEFAULT_PAGE,
      skip: 0,
    });
    expect((): void => {
      parsePagination(new URLSearchParams("page=2&limit=500"));
    }).toThrow(ValidationError);
  });

  it("rejects invalid page values", (): void => {
    expect((): void => {
      parsePagination(new URLSearchParams("page=0"));
    }).toThrow(ValidationError);
    expect((): void => {
      parsePagination(new URLSearchParams("page=abc"));
    }).toThrow(ValidationError);
  });
});

describe("toPaginationMeta", (): void => {
  it("normalizes list metadata", (): void => {
    expect(toPaginationMeta(35, { limit: 10, page: 2, skip: 10 })).toEqual({
      limit: 10,
      page: 2,
      total: 35,
      totalPages: 4,
    });
  });
});

describe("parseSort", (): void => {
  it("accepts a whitelisted field and rejects unknown fields", (): void => {
    expect(
      parseSort(new URLSearchParams("sort=createdAt&order=desc"), [
        "createdAt",
        "name",
      ]),
    ).toEqual({
      direction: "desc",
      field: "createdAt",
    });

    expect((): void => {
      parseSort(new URLSearchParams("sort=passwordHash"), ["createdAt"]);
    }).toThrow(ValidationError);
  });
});

describe("parseAllowedFilters", (): void => {
  it("copies only whitelisted filter fields", (): void => {
    const filters = parseAllowedFilters(
      new URLSearchParams("status=ACTIVE&passwordHash=secret&name=Ada"),
      ["status", "name"],
    );

    expect(filters).toEqual({
      name: "Ada",
      status: "ACTIVE",
    });
    expect(filters).not.toHaveProperty("passwordHash");
  });
});
