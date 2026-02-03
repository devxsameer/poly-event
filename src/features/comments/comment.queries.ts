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
        translated_content
      )
    `,
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data.map((comment) => {
    const translation = comment.comment_translations?.find(
      (t) => t.locale === locale,
    );

    return {
      id: comment.id,
      event_id: comment.event_id,
      original_language: comment.original_language,
      created_at: comment.created_at,

      content: translation?.translated_content ?? comment.content,
      original_content: comment.content,

      hasTranslation: Boolean(translation),
    };
  });
}
