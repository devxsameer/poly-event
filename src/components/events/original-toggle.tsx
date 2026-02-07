"use client";

import { Button } from "@/components/ui/button";
import { Languages, Eye } from "lucide-react";
import { Dictionary } from "@/features/i18n/dictionary.types";

interface OriginalToggleProps {
  showOriginal: boolean;
  onToggle: () => void;
  hasTranslation: boolean;
  label: string;
  dict?: Dictionary;
}

export function OriginalToggle({
  showOriginal,
  onToggle,
  hasTranslation,
  label,
  dict,
}: OriginalToggleProps) {
  if (!hasTranslation) return null;

  const viewOriginalText = dict?.comments.view_original ?? "View original";
  const viewTranslatedText =
    dict?.comments.view_translated ?? "View translated";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
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
