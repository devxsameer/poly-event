"use client";

import { useEffect, useCallback, useRef } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { Comment } from "@/features/comments/comment.types";
import { Dictionary } from "@/features/i18n/dictionary.types";
import { CommentItem } from "./comment-item";
import { CommentFormOptimistic } from "./comment-form-optimistic";
import {
  useOptimisticComments,
  type OptimisticComment,
} from "@/hooks/use-optimistic-comments";
import { MessageCircle, Loader2 } from "lucide-react";

interface CommentsSectionProps {
  eventId: string;
  locale: string;
  initialComments: Comment[];
  dict: Dictionary;
}

/**
 * Real-time comments section with optimistic UI
 */
export function CommentsSection({
  eventId,
  locale,
  initialComments,
  dict,
}: CommentsSectionProps) {
  const {
    comments,
    addComment,
    confirmComment,
    updateComment,
    appendComment,
    removeComment,
  } = useOptimisticComments({ initialComments });

  const isInitialMount = useRef(true);

  // Subscribe to real-time comment updates
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    // Subscribe to new comments
    const commentsChannel = supabase
      .channel(`event-comments-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          // Skip if this is the initial mount
          if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
          }

          const newComment: Comment = {
            id: payload.new.id,
            event_id: payload.new.event_id,
            content: payload.new.content,
            original_content: payload.new.content,
            original_language: payload.new.original_language,
            created_at: payload.new.created_at,
            hasTranslation: false,
          };

          appendComment(newComment);
        },
      )
      .subscribe();

    // Subscribe to translation updates
    const translationsChannel = supabase
      .channel(`comment-translations-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comment_translations",
        },
        (payload) => {
          const {
            comment_id,
            locale: translatedLocale,
            translated_content,
          } = payload.new;

          // Only update if this translation is for the current locale
          if (translatedLocale === locale) {
            updateComment(comment_id, {
              content: translated_content,
              hasTranslation: true,
            });
          }
        },
      )
      .subscribe();

    isInitialMount.current = false;

    return () => {
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(translationsChannel);
    };
  }, [eventId, locale, appendComment, updateComment]);

  // Handle optimistic comment creation
  const handleOptimisticAdd = useCallback(
    (tempId: string, content: string) => {
      const optimisticComment: OptimisticComment = {
        id: tempId,
        event_id: eventId,
        content,
        original_content: content,
        original_language: locale,
        created_at: new Date().toISOString(),
        hasTranslation: true, // It's in the user's language
        isOptimistic: true,
        isPending: true,
      };

      addComment(optimisticComment);
    },
    [eventId, locale, addComment],
  );

  // Handle successful comment creation
  const handleConfirm = useCallback(
    (tempId: string, realComment: Comment) => {
      confirmComment(tempId, realComment);
    },
    [confirmComment],
  );

  // Handle failed comment creation
  const handleError = useCallback(
    (tempId: string) => {
      removeComment(tempId);
    },
    [removeComment],
  );

  const t = dict.events.detail;

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <CommentFormOptimistic
        eventId={eventId}
        locale={locale}
        dict={dict}
        onOptimisticAdd={handleOptimisticAdd}
        onConfirm={handleConfirm}
        onError={handleError}
      />

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50 mb-4">
            <MessageCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">{t.no_comments}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <CommentItemWithStatus
                comment={comment}
                locale={locale}
                dict={dict}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Wrapper component for CommentItem with optimistic status
function CommentItemWithStatus({
  comment,
  locale,
  dict,
}: {
  comment: OptimisticComment;
  locale: string;
  dict: Dictionary;
}) {
  const isOptimistic = comment.isOptimistic ?? false;
  const isPending = comment.isPending ?? false;

  return (
    <div className={`relative ${isPending ? "opacity-70" : ""}`}>
      {isPending && (
        <div className="absolute top-3 right-3 z-10">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
      <CommentItem comment={comment} locale={locale} dict={dict} />
      {isOptimistic && !isPending && (
        <div className="absolute top-3 right-3">
          <span className="text-xs text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full">
            Just posted
          </span>
        </div>
      )}
    </div>
  );
}
