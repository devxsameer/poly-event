"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { localizeText } from "@/lib/lingo";
import {
  canTranslate,
  markTranslationFailure,
  markTranslationSuccess,
} from "../translation/translation.guard";

export async function requestCommentTranslation(
  commentId: string,
  sourceLocale: string,
  targetLocale: string,
) {
  if (sourceLocale === targetLocale) return;

  const supabase = await createServerSupabaseClient();

  const { data: exists } = await supabase
    .from("comment_translations")
    .select("id")
    .eq("comment_id", commentId)
    .eq("locale", targetLocale)
    .maybeSingle();

  if (exists) return;

  const { data: comment } = await supabase
    .from("comments")
    .select("content")
    .eq("id", commentId)
    .single();

  if (!comment) return;

  const key = `comment:${commentId}:${targetLocale}`;

  const guard = canTranslate(key, comment.content);
  if (!guard.allowed) return;

  try {
    const translated = await localizeText(comment.content, {
      sourceLocale,
      targetLocale,
    });

    await supabase.from("comment_translations").insert({
      comment_id: commentId,
      locale: targetLocale,
      translated_content: translated,
    });

    markTranslationSuccess(key);
  } catch {
    markTranslationFailure(key);
  }
}
