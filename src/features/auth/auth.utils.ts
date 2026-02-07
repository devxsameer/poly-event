import { nextPathSchema } from "./auth.schema";

export function sanitizeNext(next: unknown): string {
  if (typeof next !== "string") return "/";

  const parsed = nextPathSchema.safeParse(next);
  if (!parsed.success) return "/";

  return parsed.data;
}
