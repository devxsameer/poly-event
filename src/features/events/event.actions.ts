"use server";
import { createEventSchema } from "./event.schema";
import { createEvent } from "./event.service";
import {
  requestEventTranslation,
  scheduleEventTranslations,
} from "./event.translate";

export type CreateEventActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "success";
      locale: string;
      eventId: string;
    };

export async function createEventAction(
  _prev: CreateEventActionState,
  formData: FormData,
): Promise<CreateEventActionState> {
  const parsed = createEventSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues.map((e) => e.message).join(", "),
    };
  }

  let eventId: string;

  try {
    eventId = await createEvent(parsed.data);
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Failed to create event",
    };
  }

  // Schedule background work (non-blocking)
  scheduleEventTranslations({
    eventId,
    sourceLocale: parsed.data.original_language,
  });

  return {
    status: "success",
    locale: parsed.data.original_language,
    eventId,
  };
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
