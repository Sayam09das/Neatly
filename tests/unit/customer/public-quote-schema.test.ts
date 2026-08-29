import { describe, expect, it } from "vitest";
import {
  QUOTE_APPROXIMATE_SIZES,
  QUOTE_PREFERRED_TIMES,
} from "@/config/customer";
import {
  quoteExtraContactLines,
  quoteRequestFormSchema,
  quoteRequestValuesFromAccount,
  toQuoteRequestPayload,
} from "@/lib/validations/public-quote.schema";

const validBase = {
  additionalNotes: "Gate code 12",
  approximateSize: QUOTE_APPROXIMATE_SIZES[0],
  bathrooms: "2",
  bedrooms: "3",
  companyWebsite: "",
  email: "ada@neatly.example",
  extraEmail: "",
  extraPersonEmail: "",
  extraPersonName: "",
  extraPersonPhone: "",
  extraPhone1: "",
  extraPhone2: "",
  frequency: "ONE_TIME" as const,
  fullName: "Ada Customer",
  phone: "5551234567",
  preferredDate: "2026-09-10",
  preferredTime: QUOTE_PREFERRED_TIMES[0],
  propertyType: "HOUSE" as const,
  serviceAddress: "12 Oak Street",
  serviceId: "svc_1",
  serviceType: "RESIDENTIAL" as const,
};

describe("quote request account contact", (): void => {
  it("prefills name, email, phone, and address from the signed-in account", (): void => {
    const values = quoteRequestValuesFromAccount(
      {
        address: "12 Oak Street",
        email: "ada@neatly.example",
        name: "Ada Customer",
        phone: "5551234567",
      },
      "svc_1",
    );

    expect(values.fullName).toBe("Ada Customer");
    expect(values.email).toBe("ada@neatly.example");
    expect(values.phone).toBe("5551234567");
    expect(values.serviceAddress).toBe("12 Oak Street");
    expect(values.serviceId).toBe("svc_1");
    expect(values.extraEmail).toBe("");
  });

  it("accepts one extra email, two extra phones, and one extra person", (): void => {
    const parsed = quoteRequestFormSchema.safeParse({
      ...validBase,
      extraEmail: "roommate@neatly.example",
      extraPersonEmail: "sam@neatly.example",
      extraPersonName: "Sam Neighbor",
      extraPersonPhone: "5559876543",
      extraPhone1: "5551112233",
      extraPhone2: "5554445566",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects an extra person without a name and appends extras into notes", (): void => {
    expect(
      quoteRequestFormSchema.safeParse({
        ...validBase,
        extraPersonEmail: "sam@neatly.example",
      }).success,
    ).toBe(false);

    const payload = toQuoteRequestPayload({
      ...validBase,
      extraEmail: "roommate@neatly.example",
      extraPhone1: "5551112233",
    });

    expect(payload.email).toBe("ada@neatly.example");
    expect(payload.additionalNotes).toContain("Gate code 12");
    expect(payload.additionalNotes).toContain(
      "Additional email: roommate@neatly.example",
    );
    expect(payload.additionalNotes).toContain("Additional phone: 5551112233");
    expect(payload).not.toHaveProperty("extraEmail");
  });

  it("formats extra contact lines for review", (): void => {
    expect(
      quoteExtraContactLines({
        ...validBase,
        extraEmail: "Roommate@Neatly.example",
        extraPersonName: "Sam Neighbor",
        extraPersonPhone: "5559876543",
      }),
    ).toEqual([
      "Additional email: roommate@neatly.example",
      "Additional person: Sam Neighbor · 5559876543",
    ]);
  });
});
