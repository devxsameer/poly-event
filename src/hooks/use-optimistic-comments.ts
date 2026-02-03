import { useState, useCallback, useOptimistic, useTransition } from "react";
import { Comment } from "@/features/comments/comment.types";

export interface OptimisticComment extends Comment {
  isOptimistic?: boolean;
  isPending?: boolean;
}

interface UseOptimisticCommentsOptions {
  initialComments: Comment[];
}

/**
 * Hook for managing optimistic UI updates for comments
 */
export function useOptimisticComments({
  initialComments,
}: UseOptimisticCommentsOptions) {
  const [comments, setComments] = useState<OptimisticComment[]>(
    initialComments.map((c) => ({
      ...c,
      isOptimistic: false,
      isPending: false,
    })),
  );
  const [isPending, startTransition] = useTransition();

  // Optimistic add - shows comment immediately
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state: OptimisticComment[], newComment: OptimisticComment) => [
      newComment,
      ...state,
    ],
  );

  // Add a new optimistic comment
  const addComment = useCallback(
    (comment: OptimisticComment) => {
      startTransition(() => {
        addOptimisticComment({
          ...comment,
          isOptimistic: true,
          isPending: true,
        });
      });
    },
    [addOptimisticComment],
  );

  // Confirm a comment (when server confirms creation)
  const confirmComment = useCallback((id: string, realComment: Comment) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...realComment, isOptimistic: false, isPending: false }
          : c,
      ),
    );
  }, []);

  // Update a comment with new translation data
  const updateComment = useCallback((id: string, updates: Partial<Comment>) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  }, []);

  // Remove a failed optimistic comment
  const removeComment = useCallback((id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Add new comment to the list (from realtime)
  const appendComment = useCallback((comment: Comment) => {
    setComments((prev) => {
      // Avoid duplicates
      if (prev.some((c) => c.id === comment.id)) return prev;
      return [{ ...comment, isOptimistic: false, isPending: false }, ...prev];
    });
  }, []);

  return {
    comments: optimisticComments,
    isPending,
    addComment,
    confirmComment,
    updateComment,
    removeComment,
    appendComment,
  };
}
