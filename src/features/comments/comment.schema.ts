import { z } from "zod";
import { locales } from "@/features/i18n/config";

export const createCommentSchema = z.object({
  event_id: z.uuid(),
  content: z.string().min(1).max(500),
  original_language: z.enum(locales),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
