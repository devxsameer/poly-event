"use server";

import { createEventSchema } from "./event.schema";
import { createEvent } from "./event.service";
import { seedEventTranslations } from "./event.translate";
import { ok, fail } from "@/features/shared/action-state";
import { CreateEventState } from "./event.types";

export async function createEventAction(
  _prevState: unknown,
  formData: FormData,
): Promise<CreateEventState> {
  const parsed = createEventSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return fail({
      code: "VALIDATION",
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    });
  }

  try {
    const eventId = await createEvent(parsed.data);

    // fire and forget
    seedEventTranslations({
      eventId,
      sourceLocale: parsed.data.original_language,
    }).catch(() => {});

    return ok({
      eventId,
      locale: parsed.data.original_language,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Not authenticated") {
      return fail({ code: "AUTH", message: "Please login again" });
    }

    return fail({
      code: "UNKNOWN",
      message: "Failed to create event",
    });
  }
}
