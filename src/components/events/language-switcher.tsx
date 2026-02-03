"use client";

import { Button } from "@/components/ui/button";
import { triggerEventTranslation } from "@/features/events/event.actions";
import { locales, localeNames } from "@/features/i18n/config";
import { Languages, RefreshCw } from "lucide-react";
import { useState } from "react";

export function LanguageSwitcher({
  eventId,
  sourceLocale,
}: {
  eventId: string;
  sourceLocale: string;
}) {
  const [translating, setTranslating] = useState<string | null>(null);

  async function handleTranslate(targetLocale: string) {
    if (translating) return;
    setTranslating(targetLocale);

    try {
      await triggerEventTranslation(eventId, sourceLocale, targetLocale);
    } finally {
      setTimeout(() => setTranslating(null), 2000);
    }
  }

  // Filter out the source locale
  const targetLocales = locales.filter((l) => l !== sourceLocale);

  if (targetLocales.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Languages className="h-3 w-3" />
        Translate:
      </span>
      {targetLocales.map((locale) => (
        <Button
          key={locale}
          size="sm"
          variant="outline"
          className="h-7 text-xs px-2 gap-1"
          disabled={translating === locale}
          onClick={() => handleTranslate(locale)}
        >
          {translating === locale && (
            <RefreshCw className="h-3 w-3 animate-spin" />
          )}
          {localeNames[locale] ?? locale.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
