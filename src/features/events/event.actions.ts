"use server";

import { createEventSchema } from "./event.schema";
import { createEvent } from "./event.service";
import { seedEventTranslations } from "./event.translate";
import { ok, fail } from "@/features/shared/action-state";
import { CreateEventState } from "./event.types";
import { createServiceSupabaseClient } from "@/lib/supabase/service";
import { lingo } from "@/lib/lingo";

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

export async function translateEventAction({
  eventId,
  targetLocale,
}: {
  eventId: string;
  targetLocale: string;
}) {
  const supabase = await createServiceSupabaseClient();

  const { data: event } = await supabase
    .from("events")
    .select("title, description, original_language")
    .eq("id", eventId)
    .single();

  if (!event) throw new Error("Event not found");

  const translated = await lingo.localizeObject(
    { title: event.title, description: event.description },
    {
      sourceLocale: event.original_language,
      targetLocale,
    },
  );

  await supabase.from("event_translations").upsert(
    {
      event_id: eventId,
      locale: targetLocale,
      translated_title: translated.title,
      translated_description: translated.description,
      status: "completed",
      last_error: null,
    },
    { onConflict: "event_id,locale" },
  );

  return translated;
}
