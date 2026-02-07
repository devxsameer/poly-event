import { z } from "zod";
import { locales } from "@/features/i18n/config";

// Helper to transform empty strings to null
const emptyToNull = z
  .string()
  .transform((val) => (val === "" ? null : val))
  .nullable();

export const createEventSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be 100 characters or less"),
    description: z
      .string()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must be at most 1000 characters"),
    start_time: z
      .string()
      .min(1, "Start time is required")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid start time"),
    end_time: emptyToNull.optional(),
    location: emptyToNull.optional(),
    original_language: z.enum(locales),
  })
  .refine(
    (data) =>
      !data.end_time || new Date(data.end_time) > new Date(data.start_time),
    {
      message: "End time must be after start time",
      path: ["end_time"],
    },
  );

export type CreateEventInput = z.infer<typeof createEventSchema>;
