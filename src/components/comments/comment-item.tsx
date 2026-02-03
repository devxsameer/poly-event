"use client";

import { useState } from "react";
import { Comment } from "@/features/comments/comment.types";
import { Button } from "@/components/ui/button";
import { triggerCommentTranslation } from "@/features/comments/comment.actions";
import {
  Globe,
  Languages,
  RefreshCw,
  User,
  Eye,
  ChevronDown,
} from "lucide-react";
import { Dictionary } from "@/features/i18n/dictionary.types";

interface CommentItemProps {
  comment: Comment;
  locale: string;
  dict: Dictionary;
}

export function CommentItem({ comment, locale, dict }: CommentItemProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const isTranslating =
    !comment.hasTranslation && comment.original_language !== locale;
  const hasTranslatedContent = comment.content !== comment.original_content;

  const t = dict.comments;

  async function handleRetry() {
    if (isRetrying) return;
    setIsRetrying(true);
    try {
      await triggerCommentTranslation(
        comment.id,
        comment.original_language,
        locale,
      );
    } finally {
      // Keep retrying state for a moment to prevent spam clicking
      setTimeout(() => setIsRetrying(false), 2000);
    }
  }

  return (
    <div className="group relative rounded-xl border border-border/50 bg-secondary/20 p-4 transition-all duration-300 hover:bg-secondary/30 hover:border-border/80 hover:shadow-lg hover:shadow-purple-500/5">
      {/* Subtle top highlight on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar placeholder */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500/20 to-blue-500/20 ring-1 ring-border/50">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground/80">
              {dict.common.anonymous}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground">
              <Globe className="h-2.5 w-2.5" />
              {comment.original_language.toUpperCase()}
            </span>
            {isTranslating && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-500">
                <Languages className="h-2.5 w-2.5 animate-pulse" />
                {dict.events.card.translating}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(comment.created_at).toLocaleDateString(locale, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {isTranslating && (
        <p className="text-xs text-muted-foreground mb-2 italic">
          {t.translation_pending}
        </p>
      )}

      {/* Content */}
      <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
        {showOriginal ? comment.original_content : comment.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
        {/* Toggle original/translated */}
        {hasTranslatedContent && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowOriginal((v) => !v)}
            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5"
          >
            {showOriginal ? (
              <>
                <Languages className="h-3 w-3" />
                {t.view_translated}
              </>
            ) : (
              <>
                <Eye className="h-3 w-3" />
                {t.view_original} ({comment.original_language.toUpperCase()})
              </>
            )}
          </Button>
        )}

        {/* Retry button */}
        {isTranslating && (
          <Button
            size="sm"
            variant="ghost"
            disabled={isRetrying}
            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5"
            onClick={handleRetry}
          >
            <RefreshCw
              className={`h-3 w-3 ${isRetrying ? "animate-spin" : ""}`}
            />
            {t.retry_translation}
          </Button>
        )}

        {/* Expand indicator for long comments */}
        {comment.content.length > 300 && (
          <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto" />
        )}
      </div>
    </div>
  );
}
