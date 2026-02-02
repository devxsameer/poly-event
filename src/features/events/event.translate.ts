"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LingoDotDevEngine } from "lingo.dev/sdk";
import { locales } from "@/features/i18n/config";

const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY!,
});

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
      console.error("[translation-failed]", { eventId, target, err });
    });
  }
}

export async function requestEventTranslation(
  eventId: string,
  sourceLocale: string,
  targetLocale: string,
) {
  if (!targetLocale || sourceLocale === targetLocale) return;

  const supabase = await createServerSupabaseClient();

  const { data: existing } = await supabase
    .from("event_translations")
    .select("id")
    .eq("event_id", eventId)
    .eq("locale", targetLocale)
    .maybeSingle();

  if (existing) return;

  const { data: event } = await supabase
    .from("events")
    .select("title, description")
    .eq("id", eventId)
    .single();

  if (!event) return;

  try {
    const translated = await lingo.localizeObject(
      {
        title: event.title,
        description: event.description,
      },
      { sourceLocale, targetLocale },
    );

    await supabase.from("event_translations").insert({
      event_id: eventId,
      locale: targetLocale,
      translated_title: translated.title,
      translated_description: translated.description,
    });
  } catch (err) {
    console.error("[translation-error]", {
      eventId,
      targetLocale,
      err,
    });
  }
}
