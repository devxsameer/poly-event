"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CreateEventInput } from "./event.schema";

export async function createEvent(input: CreateEventInput) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("events")
    .insert({
      creator_id: user.id,
      original_language: input.original_language,
      title: input.title,
      description: input.description,
      start_time: input.start_time,
      end_time: input.end_time ?? null,
      location: input.location ?? null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  return data.id;
}
