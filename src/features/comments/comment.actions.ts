"use server";

import { createCommentSchema } from "./comment.schema";
import { createComment } from "./comment.service";
import { requestCommentTranslation } from "./comment.translate";

export type CreateCommentState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; commentId: string };

export async function createCommentAction(
  _prev: CreateCommentState,
  formData: FormData,
): Promise<CreateCommentState> {
  const parsed = createCommentSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0].message,
    };
  }

  let commentId: string;

  try {
    commentId = await createComment(parsed.data);
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Failed to add comment",
    };
  }

  return {
    status: "success",
    commentId,
  };
}

export async function triggerCommentTranslation(
  commentId: string,
  sourceLocale: string,
  targetLocale: string,
) {
  requestCommentTranslation(commentId, sourceLocale, targetLocale);
}
