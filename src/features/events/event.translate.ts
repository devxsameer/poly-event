"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { locales } from "@/features/i18n/config";
import { processEventTranslation } from "./event.worker";

export async function seedEventTranslations({
  eventId,
  sourceLocale,
}: {
  eventId: string;
  sourceLocale: string;
}) {
  const supabase = await createServerSupabaseClient();

  const rows = locales
    .filter((l) => l !== sourceLocale)
    .map((locale) => ({
      event_id: eventId,
      locale,
      status: "pending",
    }));

  await supabase
    .from("event_translations")
    .upsert(rows, { onConflict: "event_id,locale" });

  // Fire-and-forget background work
  queueMicrotask(() => {
    for (const { locale } of rows) {
      processEventTranslation(eventId, sourceLocale, locale).catch(() => {});
    }
  });
}

export async function retryEventTranslation(
  eventId: string,
  sourceLocale: string,
  targetLocale: string,
) {
  const supabase = await createServerSupabaseClient();

  await supabase
    .from("event_translations")
    .update({
      status: "pending",
      last_error: null,
    })
    .eq("event_id", eventId)
    .eq("locale", targetLocale);

  processEventTranslation(eventId, sourceLocale, targetLocale).catch(() => {});
}
