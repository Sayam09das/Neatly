import { type Actor, requireAdminActor } from "../../lib/domain/actor.ts";
import { NotFoundError, ValidationError } from "../../lib/errors.ts";
import type { SettingsRepository } from "../../repositories/settings.repository.ts";
import type { SettingsRecord, UpdateSettingsInput } from "./settings.types.ts";

export class SettingsService {
  private readonly settings: SettingsRepository;

  public constructor(settings: SettingsRepository) {
    this.settings = settings;
  }

  public async get(actor: Actor): Promise<SettingsRecord> {
    requireAdminActor(actor);
    const record = await this.settings.find();

    if (record === null) {
      throw new NotFoundError("Site settings were not found.");
    }

    return record;
  }

  public async update(
    actor: Actor,
    input: UpdateSettingsInput,
  ): Promise<SettingsRecord> {
    requireAdminActor(actor);
    await this.get(actor);
    const updated = await this.settings.update({
      address:
        input.address === undefined
          ? undefined
          : requireText(input.address, "address"),
      businessName:
        input.businessName === undefined
          ? undefined
          : requireText(input.businessName, "businessName"),
      defaultSeoDesc:
        input.defaultSeoDesc === undefined
          ? undefined
          : requireText(input.defaultSeoDesc, "defaultSeoDesc"),
      defaultSeoTitle:
        input.defaultSeoTitle === undefined
          ? undefined
          : requireText(input.defaultSeoTitle, "defaultSeoTitle"),
      email: input.email,
      notificationEmail: input.notificationEmail,
      phone:
        input.phone === undefined
          ? undefined
          : requireText(input.phone, "phone"),
      serviceAreas: input.serviceAreas,
      socialLinks: input.socialLinks,
      tagline:
        input.tagline === undefined
          ? undefined
          : requireText(input.tagline, "tagline"),
      workingHours: input.workingHours,
    });

    if (updated === null) {
      throw new NotFoundError("Site settings were not found.");
    }

    return updated;
  }
}

function requireText(value: string, field: string): string {
  const trimmed = value.trim();

  if (trimmed === "") {
    throw new ValidationError("Validation failed.", [
      { field, issue: "This field is required." },
    ]);
  }

  return trimmed;
}
