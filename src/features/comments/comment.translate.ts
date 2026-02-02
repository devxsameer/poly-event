"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY!,
});

export async function requestCommentTranslation(
  commentId: string,
  sourceLocale: string,
  targetLocale: string,
) {
  if (!targetLocale || sourceLocale === targetLocale) return;

  const supabase = await createServerSupabaseClient();

  const { data: existing } = await supabase
    .from("comment_translations")
    .select("id")
    .eq("comment_id", commentId)
    .eq("locale", targetLocale)
    .maybeSingle();

  if (existing) return;

  const { data: comment } = await supabase
    .from("comments")
    .select("content")
    .eq("id", commentId)
    .single();

  if (!comment) return;

  try {
    const translated = await lingo.localizeText(comment.content, {
      sourceLocale,
      targetLocale,
    });

    await supabase.from("comment_translations").insert({
      comment_id: commentId,
      locale: targetLocale,
      translated_content: translated,
    });
  } catch (err) {
    console.error("[comment-translation-failed]", {
      commentId,
      targetLocale,
      err,
    });
  }
}
