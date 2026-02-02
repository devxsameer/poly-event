"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  createCommentAction,
  CreateCommentState,
} from "@/features/comments/comment.actions";
import { toast } from "sonner";

export function CommentForm({
  eventId,
  locale,
}: {
  eventId: string;
  locale: string;
}) {
  const [state, action, pending] = useActionState<CreateCommentState, FormData>(
    createCommentAction,
    { status: "idle" },
  );

  useEffect(() => {
    if (state.status === "success") {
      toast("Comment added", {
        description: "Translations will appear automatically.",
      });
    }
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      {state.status === "error" && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <input type="hidden" name="event_id" value={eventId} />
      <input type="hidden" name="original_language" value={locale} />

      <Textarea name="content" placeholder="Write a comment…" rows={3} />

      <Button disabled={pending}>Post comment</Button>
    </form>
  );
}
