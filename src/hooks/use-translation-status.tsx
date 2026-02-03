import { useEffect, useState, useCallback } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { Languages, CheckCircle2 } from "lucide-react";
import { localeNames, type Locale } from "@/features/i18n/config";

export type TranslationStatus =
  | "pending"
  | "translating"
  | "completed"
  | "failed";

export interface TranslationUpdate {
  id: string;
  locale: string;
  status: TranslationStatus;
  timestamp: number;
}

interface UseTranslationStatusOptions {
  entityType: "event" | "comment";
  entityId: string;
  showToasts?: boolean;
}

/**
 * Hook to track real-time translation status for an event or comment
 */
export function useTranslationStatus({
  entityType,
  entityId,
  showToasts = true,
}: UseTranslationStatusOptions) {
  const [translations, setTranslations] = useState<
    Map<string, TranslationStatus>
  >(new Map());
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Subscribe to Supabase Realtime for translation updates
  useEffect(() => {
    if (!entityId) return;

    const supabase = createBrowserSupabaseClient();
    const tableName =
      entityType === "event" ? "event_translations" : "comment_translations";
    const foreignKey = entityType === "event" ? "event_id" : "comment_id";

    const channel = supabase
      .channel(`${entityType}-translations-${entityId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: tableName,
          filter: `${foreignKey}=eq.${entityId}`,
        },
        (payload) => {
          const locale = payload.new.locale as Locale;

          setTranslations((prev) => {
            const updated = new Map(prev);
            updated.set(locale, "completed");
            return updated;
          });

          if (showToasts) {
            toast.success(`Translation complete`, {
              description: `Now available in ${localeNames[locale] ?? locale.toUpperCase()}`,
              icon: <CheckCircle2 className="h-4 w-4" />,
              position: "bottom-right",
              duration: 3000,
            });
          }
        },
      )
      .subscribe((status) => {
        setIsSubscribed(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [entityId, entityType, showToasts]);

  // Mark a locale as translating
  const markTranslating = useCallback(
    (locale: string) => {
      setTranslations((prev) => {
        const updated = new Map(prev);
        updated.set(locale, "translating");
        return updated;
      });

      if (showToasts) {
        toast.info(
          `Translating to ${localeNames[locale as Locale] ?? locale}...`,
          {
            icon: <Languages className="h-4 w-4 animate-pulse" />,
            position: "bottom-right",
            duration: 2000,
          },
        );
      }
    },
    [showToasts],
  );

  // Get status for a specific locale
  const getStatus = useCallback(
    (locale: string): TranslationStatus => {
      return translations.get(locale) ?? "pending";
    },
    [translations],
  );

  // Check if all target locales are translated
  const allCompleted = useCallback(
    (targetLocales: string[]): boolean => {
      return targetLocales.every((l) => translations.get(l) === "completed");
    },
    [translations],
  );

  return {
    translations,
    isSubscribed,
    markTranslating,
    getStatus,
    allCompleted,
  };
}
