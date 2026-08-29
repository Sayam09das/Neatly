import { z } from "@neatly/config/zod";
import {
  CLEANER_WEEKDAYS,
  type CleanerWeekDayAvailability,
} from "../../services/cleaners/cleaner.types.ts";

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid time.");

const weekdaySchema = z.enum(CLEANER_WEEKDAYS);

const daySchema = z
  .strictObject({
    available: z.boolean(),
    day: weekdaySchema,
    end: timeSchema.nullable(),
    start: timeSchema.nullable(),
  })
  .superRefine((value, ctx) => {
    if (!value.available) {
      return;
    }

    if (value.start === null || value.end === null) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a start and end time.",
        path: value.start === null ? ["start"] : ["end"],
      });
      return;
    }

    if (value.start >= value.end) {
      ctx.addIssue({
        code: "custom",
        message: "End time must be after the start time.",
        path: ["end"],
      });
    }
  });

export const updateCleanerAvailabilityBodySchema = z
  .strictObject({
    week: z.array(daySchema).length(CLEANER_WEEKDAYS.length),
  })
  .superRefine((value, ctx) => {
    const days = new Set(value.week.map((day) => day.day));

    if (days.size !== CLEANER_WEEKDAYS.length) {
      ctx.addIssue({
        code: "custom",
        message: "Provide availability for each weekday.",
        path: ["week"],
      });
    }
  })
  .transform((value): { week: CleanerWeekDayAvailability[] } => value);

export type UpdateCleanerAvailabilityBody = z.infer<
  typeof updateCleanerAvailabilityBodySchema
>;
