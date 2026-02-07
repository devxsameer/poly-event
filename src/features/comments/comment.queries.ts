"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Comment } from "./comment.types";

export async function getCommentsForEvent(
  eventId: string,
  locale: string,
): Promise<Comment[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      event_id,
      content,
      original_language,
      created_at,
      comment_translations (
        locale,
        translated_content,
        status
      )
    `,
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    throw new Error("Failed to load comments");
  }

  return data.map((comment) => {
    const translation = comment.comment_translations?.find(
      (t) => t.locale === locale,
    );

    return {
      id: comment.id,
      event_id: comment.event_id,
      original_language: comment.original_language,
      created_at: comment.created_at,

      original_content: comment.content,
      content:
        translation?.status === "completed"
          ? translation.translated_content!
          : comment.content,

      translation,
    };
  });
}
