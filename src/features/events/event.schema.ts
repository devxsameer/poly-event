import { z } from "zod";
import { locales } from "@/features/i18n/config";

export const createEventSchema = z
  .object({
    title: z.string().min(3, "Title is too short").max(100),
    description: z.string().min(10, "Description is too short"),
    start_time: z.string(),
    end_time: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
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
