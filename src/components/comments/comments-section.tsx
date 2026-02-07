"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { CommentItem } from "./comment-item";
import { CommentFormOptimistic } from "./comment-form-optimistic";
import { createCommentAction } from "@/features/comments/comment.actions";
import { Comment } from "@/features/comments/comment.types";
import { Dictionary } from "@/features/i18n/dictionary.types";

export function CommentsSection({
  eventId,
  locale,
  initialComments,
  dict,
}: {
  eventId: string;
  locale: string;
  initialComments: Comment[];
  dict: Dictionary;
}) {
  const queryClient = useQueryClient();

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", eventId, locale],
    queryFn: async () => initialComments,
    initialData: initialComments,
    staleTime: Infinity,
  });
  const createMutation = useMutation({
    mutationFn: (content: string) =>
      createCommentAction({
        eventId,
        content,
        originalLanguage: locale,
      }),

    onMutate: async (content) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", eventId, locale],
      });

      const previous = queryClient.getQueryData<Comment[]>([
        "comments",
        eventId,
        locale,
      ]);

      const tempId = `temp-${crypto.randomUUID()}`;

      queryClient.setQueryData<Comment[]>(
        ["comments", eventId, locale],
        (old = []) => [
          ...old,
          {
            id: tempId,
            event_id: eventId,
            original_language: locale,
            original_content: content,
            content,
            created_at: new Date().toISOString(),
            isOptimistic: true,
            isPending: true,
          } as any,
        ],
      );

      return { previous, tempId };
    },

    onSuccess: ({ commentId }, _content, ctx) => {
      queryClient.setQueryData<Comment[]>(
        ["comments", eventId, locale],
        (old = []) =>
          old.map((c: any) =>
            c.id === ctx?.tempId
              ? { ...c, id: commentId, isOptimistic: false, isPending: false }
              : c,
          ),
      );
    },

    onError: (_err, _content, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["comments", eventId, locale], ctx.previous);
      }
    },
  });

  const t = dict.events.detail;

  return (
    <div className="space-y-6">
      <CommentFormOptimistic
        dict={dict}
        isPending={createMutation.isPending}
        onSubmit={createMutation.mutate}
      />

      {comments.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50 mb-4">
            <MessageCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">{t.no_comments}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              locale={locale}
              dict={dict}
              eventId={eventId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
