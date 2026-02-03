"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Languages, Eye } from "lucide-react";
import { Dictionary } from "@/features/i18n/dictionary.types";

interface OriginalToggleProps {
  translated: string;
  original: string;
  label: string;
  dict?: Dictionary;
}

export function OriginalToggle({
  translated,
  original,
  label,
  dict,
}: OriginalToggleProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  // Use dict if available, otherwise fallback to English defaults
  const viewOriginalText = dict?.comments.view_original ?? "View original";
  const viewTranslatedText =
    dict?.comments.view_translated ?? "View translated";

  if (translated === original) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setShowOriginal((v) => !v)}
      className="gap-2 text-muted-foreground text-xs hover:text-foreground"
    >
      {showOriginal ? (
        <>
          <Languages className="h-3 w-3" />
          {viewTranslatedText}
        </>
      ) : (
        <>
          <Eye className="h-3 w-3" />
          {viewOriginalText} ({label})
        </>
      )}
    </Button>
  );
}
