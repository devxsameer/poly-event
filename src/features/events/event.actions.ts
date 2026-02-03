"use server";
import { createEventSchema } from "./event.schema";
import { createEvent } from "./event.service";
import {
  requestEventTranslation,
  scheduleEventTranslations,
} from "./event.translate";
import { ActionResult, ok, fail } from "@/features/shared/action-result";

export async function createEventAction(
  _prev: unknown,
  formData: FormData,
): Promise<ActionResult<{ eventId: string; locale: string }>> {
  const parsed = createEventSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return fail(parsed.error.issues.map((i) => i.message).join(", "));
  }

  try {
    const eventId = await createEvent(parsed.data);

    // 🔥 non-blocking background translations
    scheduleEventTranslations({
      eventId,
      sourceLocale: parsed.data.original_language,
    });

    return ok({
      eventId,
      locale: parsed.data.original_language,
    });
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Failed to create event");
  }
}

export async function triggerEventTranslation(
  eventId: string,
  sourceLocale: string,
  targetLocale: string,
) {
  // Fire-and-forget (hackathon-safe)
  requestEventTranslation(eventId, sourceLocale, targetLocale).catch((err) => {
    console.error("Translation failed", err);
  });
}
