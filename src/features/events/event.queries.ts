"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { EventWithTranslation } from "./event.types";
export async function getEventsForLocale(locale: string): Promise<
  (EventWithTranslation & {
    hasTranslation: boolean;
  })[]
> {
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
        translated_description
      )
    `,
    )
    .order("start_time", { ascending: true });

  if (error) throw new Error(error.message);

  return data.map((event) => {
    const translation = event.event_translations?.find(
      (t) => t.locale === locale,
    );

    return {
      id: event.id,
      original_language: event.original_language,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location,
      title: translation?.translated_title ?? event.title,
      description: translation?.translated_description ?? event.description,
      hasTranslation: Boolean(translation),
    };
  });
}

export async function getEventById(eventId: string, locale: string) {
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
        translated_description
      )
    `,
    )
    .eq("id", eventId)
    .single();

  if (error || !data) throw new Error("Event not found");

  const translation = data.event_translations?.find((t) => t.locale === locale);

  return {
    id: data.id,
    original_language: data.original_language,
    start_time: data.start_time,
    end_time: data.end_time,
    location: data.location,

    title: translation?.translated_title ?? data.title,
    description: translation?.translated_description ?? data.description,
    originalTitle: data.title,
    originalDescription: data.description,

    hasTranslation: Boolean(translation),
  };
}
