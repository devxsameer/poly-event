"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { translateCommentAction } from "@/features/comments/comment.actions";

export function useCommentTranslation({
  commentId,
  locale,
  eventId,
}: {
  commentId: string;
  locale: string;
  eventId: string;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      translateCommentAction({ commentId, targetLocale: locale }),

    onSuccess: (data) => {
      queryClient.setQueryData(["comments", eventId, locale], (old: any[]) =>
        old?.map((c) =>
          c.id === commentId
            ? {
                ...c,
                content: data.translated,
                translation: {
                  locale,
                  translated_content: data.translated,
                  status: "completed",
                },
              }
            : c,
        ),
      );
    },
  });
}
