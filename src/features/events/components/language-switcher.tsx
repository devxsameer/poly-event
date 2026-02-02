"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { triggerEventTranslation } from "@/features/events/event.actions";

export function LanguageSwitcher({
  eventId,
  sourceLocale,
}: {
  eventId: string;
  sourceLocale: string;
}) {
  const [lang, setLang] = useState("");

  return (
    <div className="flex gap-2 items-center">
      <input
        className="border px-2 py-1 text-sm rounded"
        placeholder="Translate to (e.g. es, de)"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
      />

      <Button
        size="sm"
        variant="outline"
        onClick={() => triggerEventTranslation(eventId, sourceLocale, lang)}
      >
        Translate
      </Button>
    </div>
  );
}
