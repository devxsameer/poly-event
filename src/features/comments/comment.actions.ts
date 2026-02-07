"use server";

import { createServiceSupabaseClient } from "@/lib/supabase/service";
import { createCommentSchema } from "./comment.schema";
import { createComment } from "./comment.service";
import { lingo } from "@/lib/lingo";

export async function createCommentAction(input: {
  eventId: string;
  content: string;
  originalLanguage: string;
}): Promise<{ commentId: string }> {
  const parsed = createCommentSchema.safeParse({
    event_id: input.eventId,
    content: input.content,
    original_language: input.originalLanguage,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const commentId = await createComment(parsed.data);
  return { commentId };
}

export async function translateCommentAction({
  commentId,
  targetLocale,
}: {
  commentId: string;
  targetLocale: string;
}): Promise<{ translated: string }> {
  const supabase = await createServiceSupabaseClient();

  const { data: comment } = await supabase
    .from("comments")
    .select("content, original_language")
    .eq("id", commentId)
    .single();

  if (!comment) throw new Error("Comment not found");
  if (comment.original_language === targetLocale) {
    return { translated: comment.content };
  }

  const translated = await lingo.localizeText(comment.content, {
    sourceLocale: comment.original_language,
    targetLocale,
  });

  await supabase.from("comment_translations").upsert(
    {
      comment_id: commentId,
      locale: targetLocale,
      translated_content: translated,
      status: "completed",
      last_error: null,
    },
    { onConflict: "comment_id,locale" },
  );

  return { translated };
}
