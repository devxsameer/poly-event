"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Languages, RefreshCw, User, Eye } from "lucide-react";
import { Dictionary } from "@/features/i18n/dictionary.types";
import { Comment } from "@/features/comments/comment.types";
import { useCommentTranslation } from "@/hooks/use-comment-translation";

export function CommentItem({
  comment,
  locale,
  dict,
  eventId,
}: {
  comment: Comment;
  locale: string;
  dict: Dictionary;
  eventId: string;
}) {
  const [showOriginal, setShowOriginal] = useState(false);

  const hasCompletedTranslation = comment.translation?.status === "completed";

  const shouldTranslate =
    comment.original_language !== locale &&
    (!comment.translation || comment.translation.status === "failed");

  const mutation = useCommentTranslation({
    commentId: comment.id,
    locale,
    eventId,
  });

  // 🔥 auto-start translation
  useEffect(() => {
    if (shouldTranslate && !mutation.isPending) {
      mutation.mutate();
    }
  }, [shouldTranslate]);

  const text =
    showOriginal || !hasCompletedTranslation
      ? comment.original_content
      : comment.content;

  return (
    <div className="group relative rounded-xl border border-border/50 bg-secondary/20 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>

        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Globe className="h-3 w-3" />
          {comment.original_language.toUpperCase()}
        </span>

        {mutation.isPending && (
          <span className="inline-flex items-center gap-1 text-xs text-amber-500">
            <Languages className="h-3 w-3 animate-pulse" />
            {dict.events.card.translating}
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-foreground/90 whitespace-pre-wrap">{text}</p>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        {hasCompletedTranslation && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowOriginal((v) => !v)}
            className="text-xs gap-1"
          >
            {showOriginal ? (
              <>
                <Languages className="h-3 w-3" />
                {dict.comments.view_translated}
              </>
            ) : (
              <>
                <Eye className="h-3 w-3" />
                {dict.comments.view_original}
              </>
            )}
          </Button>
        )}

        {mutation.isError && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => mutation.mutate()}
            className="text-xs text-destructive gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            {dict.comments.retry_translation}
          </Button>
        )}
      </div>
    </div>
  );
}
