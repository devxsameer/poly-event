"use client";

import { useRef, useId, useTransition } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dictionary } from "@/features/i18n/dictionary.types";
import { createCommentAction } from "@/features/comments/comment.actions";
import { triggerCommentTranslation } from "@/features/comments/comment.actions";
import { locales } from "@/features/i18n/config";
import { Comment } from "@/features/comments/comment.types";

interface CommentFormOptimisticProps {
  eventId: string;
  locale: string;
  dict: Dictionary;
  onOptimisticAdd: (tempId: string, content: string) => void;
  onConfirm: (tempId: string, realComment: Comment) => void;
  onError: (tempId: string) => void;
}

export function CommentFormOptimistic({
  eventId,
  locale,
  dict,
  onOptimisticAdd,
  onConfirm,
  onError,
}: CommentFormOptimisticProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tempIdRef = useRef<string>("");
  const formId = useId();
  const [isPending, startTransition] = useTransition();

  const t = dict.comments;

  async function handleSubmit(formData: FormData) {
    const content = formData.get("content") as string;

    if (!content?.trim()) {
      toast.error("Please enter a comment", { position: "top-center" });
      return;
    }

    // Generate temp ID for optimistic update
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    tempIdRef.current = tempId;

    // Show optimistic comment immediately
    onOptimisticAdd(tempId, content.trim());

    // Clear form immediately for better UX
    formRef.current?.reset();
    textareaRef.current?.focus();

    // Submit to server
    startTransition(async () => {
      try {
        const result = await createCommentAction(
          { ok: false, error: "" },
          formData,
        );

        if (!result.ok) {
          onError(tempId);
          toast.error(result.error || "Failed to post comment", {
            position: "top-center",
          });
          return;
        }

        // Replace optimistic comment with real one
        const realComment: Comment = {
          id: result.data.commentId,
          event_id: eventId,
          content: content.trim(),
          original_content: content.trim(),
          original_language: locale,
          created_at: new Date().toISOString(),
          hasTranslation: true,
        };

        onConfirm(tempId, realComment);

        toast.success(t.toast.success, {
          description: t.toast.success_description,
          position: "top-center",
        });

        // Trigger translations to all other locales
        const targetLocales = locales.filter((l) => l !== locale);
        for (const targetLocale of targetLocales) {
          triggerCommentTranslation(
            result.data.commentId,
            locale,
            targetLocale,
          ).catch(() => {});
        }
      } catch {
        onError(tempId);
        toast.error("Failed to post comment", { position: "top-center" });
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="relative" id={formId}>
      <input type="hidden" name="event_id" value={eventId} />
      <input type="hidden" name="original_language" value={locale} />

      <div className="relative group">
        <Textarea
          ref={textareaRef}
          name="content"
          placeholder={t.placeholder}
          disabled={isPending}
          rows={3}
          className="pr-14 resize-none bg-secondary/30 border-border/50 focus:border-foreground/30 focus:ring-1 focus:ring-purple-500/20 transition-all rounded-xl"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />

        <Button
          type="submit"
          size="icon"
          disabled={isPending}
          className="absolute bottom-3 right-3 h-8 w-8 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Press{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">
          ⌘
        </kbd>
        +
        <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">
          Enter
        </kbd>{" "}
        to submit
      </p>
    </form>
  );
}
