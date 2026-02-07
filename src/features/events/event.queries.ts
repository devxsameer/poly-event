"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getEventsForLocale(locale: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id,
      original_language,
      start_time,
      end_time,
      location,
      title,
      description,
      event_translations (
        locale,
        translated_title,
        translated_description,
        status
      )
    `,
    )
    .order("start_time", { ascending: true });

  if (error || !data) {
    throw new Error("Failed to fetch events");
  }

  return Promise.all(
    data.map(async (event) => {
      // same language → no translation
      if (event.original_language === locale) {
        return {
          id: event.id,
          original_language: event.original_language,
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          title: event.title,
          description: event.description,
          hasTranslation: true,
        };
      }

      const existing = event.event_translations?.find(
        (t) => t.locale === locale && t.status === "completed",
      );

      // already translated
      if (existing) {
        return {
          id: event.id,
          original_language: event.original_language,
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          title: existing.translated_title ?? event.title,
          description: existing.translated_description ?? event.description,
          hasTranslation: true,
        };
      }

      // // 🔥 LAZY TRANSLATION (ON READ)
      // const translated = await localizeObject(
      //   { title: event.title, description: event.description },
      //   {
      //     sourceLocale: event.original_language,
      //     targetLocale: locale,
      //   },
      // );

      // // persist once (idempotent)
      // await supabase.from("event_translations").upsert(
      //   {
      //     event_id: event.id,
      //     locale,
      //     translated_title: translated.title,
      //     translated_description: translated.description,
      //     status: "completed",
      //   },
      //   { onConflict: "event_id,locale" },
      // );

      return {
        id: event.id,
        original_language: event.original_language,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location,
        title: event.title,
        description: event.description,
        hasTranslation: true,
      };
    }),
  );
}
export async function getEventByIdRaw(eventId: string, locale: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      description,
      original_language,
      start_time,
      end_time,
      location,
      event_translations (
        locale,
        translated_title,
        translated_description,
        status,
        last_error
      )
    `,
    )
    .eq("id", eventId)
    .single();

  console.log(data);
  if (error || !data) throw new Error("Event not found");

  const translation = data.event_translations?.find((t) => t.locale === locale);

  return {
    ...data,
    translation,
  };
}
