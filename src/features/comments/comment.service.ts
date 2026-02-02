"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CreateCommentInput } from "./comment.types";

export async function createComment(input: CreateCommentInput) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("comments")
    .insert({
      event_id: input.event_id,
      author_id: user.id,
      original_language: input.original_language,
      content: input.content,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  return data.id;
}
