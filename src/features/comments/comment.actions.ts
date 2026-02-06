"use server";

import { createCommentSchema } from "./comment.schema";
import { createComment } from "./comment.service";
import { requestCommentTranslation } from "./comment.translate";
import { ActionResult, ok, fail } from "@/features/shared/action-state";

// Legacy type for backwards compatibility
export type CreateCommentState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; commentId: string };

/**
 * Create a new comment with ActionResult return type
 */
export async function createCommentAction(
  _prev: ActionResult<{ commentId: string }>,
  formData: FormData,
): Promise<ActionResult<{ commentId: string }>> {
  const parsed = createCommentSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return fail(parsed.error.issues[0].message);
  }

  try {
    const commentId = await createComment(parsed.data);
    return ok({ commentId });
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Failed to add comment");
  }
}

/**
 * Trigger translation for a comment to a target locale
 * Fire-and-forget - doesn't wait for completion
 */
export async function triggerCommentTranslation(
  commentId: string,
  sourceLocale: string,
  targetLocale: string,
): Promise<void> {
  // Fire-and-forget with error logging
  requestCommentTranslation(commentId, sourceLocale, targetLocale).catch(
    (err) => {
      console.error(`Translation failed for comment ${commentId}:`, err);
    },
  );
}

/**
 * Trigger translations for all target locales
 */
export async function triggerAllCommentTranslations(
  commentId: string,
  sourceLocale: string,
  targetLocales: string[],
): Promise<void> {
  await Promise.allSettled(
    targetLocales.map((targetLocale) =>
      requestCommentTranslation(commentId, sourceLocale, targetLocale),
    ),
  );
}
