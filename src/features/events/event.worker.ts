"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { localizeObject } from "@/lib/lingo";
import {
  canTranslate,
  markTranslationFailure,
  markTranslationSuccess,
} from "../translation/translation.guard";

export async function processEventTranslation(
  eventId: string,
  sourceLocale: string,
  targetLocale: string,
) {
  if (sourceLocale === targetLocale) return;

  const supabase = await createServerSupabaseClient();

  const { data: translation } = await supabase
    .from("event_translations")
    .select("status")
    .eq("event_id", eventId)
    .eq("locale", targetLocale)
    .single();

  if (!translation || translation.status !== "pending") return;

  const { data: event } = await supabase
    .from("events")
    .select("title, description")
    .eq("id", eventId)
    .single();

  if (!event) return;

  const key = `event:${eventId}:${targetLocale}`;
  const guard = canTranslate(key, `${event.title} ${event.description}`);

  if (!guard.allowed) {
    await supabase
      .from("event_translations")
      .update({
        status: "failed",
        last_error: guard.reason,
      })
      .eq("event_id", eventId)
      .eq("locale", targetLocale);
    return;
  }

  try {
    const translated = await localizeObject(
      { title: event.title, description: event.description },
      { sourceLocale, targetLocale },
    );

    await supabase
      .from("event_translations")
      .update({
        translated_title: translated.title,
        translated_description: translated.description,
        status: "completed",
        last_error: null,
      })
      .eq("event_id", eventId)
      .eq("locale", targetLocale);

    markTranslationSuccess(key);
  } catch (err) {
    markTranslationFailure(key);

    await supabase
      .from("event_translations")
      .update({
        status: "failed",
        last_error: err instanceof Error ? err.message : "Unknown error",
      })
      .eq("event_id", eventId)
      .eq("locale", targetLocale);
  }
}
