"use client";

import { Comment } from "@/features/comments/comment.types";
import { Button } from "@/components/ui/button";
import { triggerCommentTranslation } from "@/features/comments/comment.actions";

export function CommentItem({
  comment,
  locale,
}: {
  comment: Comment;
  locale: string;
}) {
  return (
    <div className="border rounded p-3 space-y-1">
      {!comment.hasTranslation && comment.original_language !== locale && (
        <p className="text-xs italic text-muted-foreground">Translating…</p>
      )}

      <p>{comment.content}</p>

      {!comment.hasTranslation && comment.original_language !== locale && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            triggerCommentTranslation(
              comment.id,
              comment.original_language,
              locale,
            )
          }
        >
          Retry translation
        </Button>
      )}
    </div>
  );
}
