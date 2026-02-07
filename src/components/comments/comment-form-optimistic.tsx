"use client";

import { useRef, useId } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dictionary } from "@/features/i18n/dictionary.types";

export function CommentFormOptimistic({
  dict,
  onSubmit,
  isPending,
}: {
  dict: Dictionary;
  onSubmit: (content: string) => void;
  isPending: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formId = useId();

  const t = dict.comments;

  function handleSubmit(formData: FormData) {
    const content = String(formData.get("content") ?? "").trim();
    if (!content) {
      toast.error("Please enter a comment");
      return;
    }

    onSubmit(content);
    formRef.current?.reset();
    textareaRef.current?.focus();
  }

  return (
    <form ref={formRef} action={handleSubmit} id={formId}>
      <Textarea
        ref={textareaRef}
        name="content"
        placeholder={t.placeholder}
        disabled={isPending}
        rows={3}
        className="pr-14 resize-none bg-secondary/30 border-border/50 rounded-xl"
      />

      <Button
        type="submit"
        size="icon"
        disabled={isPending}
        className="absolute bottom-3 right-3 h-8 w-8"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
