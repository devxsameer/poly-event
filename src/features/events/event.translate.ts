"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { localizeObject } from "@/lib/lingo";
import { locales } from "@/features/i18n/config";
import {
  canTranslate,
  markTranslationFailure,
  markTranslationSuccess,
} from "../translation/translation.guard";

export async function scheduleEventTranslations({
  eventId,
  sourceLocale,
}: {
  eventId: string;
  sourceLocale: string;
}) {
  for (const target of locales) {
    if (target === sourceLocale) continue;

    requestEventTranslation(eventId, sourceLocale, target).catch((err) => {
      console.error("[event-translation-failed]", {
        eventId,
        target,
        err,
      });
    });
  }
}

export async function requestEventTranslation(
  eventId: string,
  sourceLocale: string,
  targetLocale: string,
) {
  if (sourceLocale === targetLocale) return;

  const supabase = await createServerSupabaseClient();

  const { data: exists } = await supabase
    .from("event_translations")
    .select("id")
    .eq("event_id", eventId)
    .eq("locale", targetLocale)
    .maybeSingle();

  if (exists) return;

  const { data: event } = await supabase
    .from("events")
    .select("title, description")
    .eq("id", eventId)
    .single();

  if (!event) return;

  const key = `event:${eventId}:${targetLocale}`;

  const guard = canTranslate(key, `${event.title} ${event.description}`);

  if (!guard.allowed) {
    console.warn("[translation-skipped]", guard.reason);
    return;
  }

  try {
    const translated = await localizeObject(
      { title: event.title, description: event.description },
      { sourceLocale, targetLocale },
    );

    await supabase.from("event_translations").insert({
      event_id: eventId,
      locale: targetLocale,
      translated_title: translated.title,
      translated_description: translated.description,
    });

    markTranslationSuccess(key);
  } catch (err) {
    markTranslationFailure(key);
    throw err;
  }
}
