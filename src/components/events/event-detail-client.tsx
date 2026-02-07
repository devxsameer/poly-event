"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/localized-link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Globe,
  MessageCircle,
  Languages,
  Sparkles,
} from "lucide-react";
import { OriginalToggle } from "@/components/events/original-toggle";
import { Dictionary } from "@/features/i18n/dictionary.types";
import { Locale } from "@/features/i18n/config";
import { EventWithResolvedTranslation } from "@/features/events/event.types";
import { useEventTranslation } from "@/hooks/use-event-translation";
import { useEffect, useState } from "react";
import { Comment } from "@/features/comments/comment.types";
import { CommentsSection } from "../comments/comments-section";

interface EventDetailClientProps {
  locale: Locale;
  dict: Dictionary;
  event: EventWithResolvedTranslation;
  initialComments: Comment[];
}
export default function EventDetailClient({
  event,
  locale,
  dict,
  initialComments,
}: EventDetailClientProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const { translation } = event;
  const shouldTranslate =
    event.original_language !== locale &&
    (!translation || translation.status === "failed");
  const { event: translatedEvent, mutation } = useEventTranslation({
    eventId: event.id,
    locale,
    shouldTranslate,
    initialData: event,
  });

  useEffect(() => {
    setShowOriginal(false);
  }, [locale]);

  const t = dict.events.detail;
  const hasCompletedTranslation =
    translatedEvent?.translation?.status === "completed";

  const title =
    showOriginal || !hasCompletedTranslation
      ? event.title
      : translatedEvent.translation?.translated_title;

  const description =
    showOriginal || !hasCompletedTranslation
      ? event.description
      : translatedEvent.translation?.translated_description;

  return (
    <>
      {/* Back Button */}
      <LocalizedLink href="/events" className="inline-block mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.back_to_events}
        </Button>
      </LocalizedLink>

      <Card className="overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm shadow-xl">
        <div className="h-1 bg-linear-to-r from-purple-500 via-blue-500 to-purple-500" />

        <CardHeader className="space-y-6 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Globe className="h-3 w-3" />
              {t.original_language}: {event.original_language.toUpperCase()}
            </span>
            {mutation.isPending && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-500">
                <Languages className="h-3 w-3 animate-pulse" />
                {dict.events.card.translating}
              </span>
            )}

            <OriginalToggle
              showOriginal={showOriginal}
              onToggle={() => !mutation.isPending && setShowOriginal((v) => !v)}
              hasTranslation={hasCompletedTranslation}
              label={event.original_language.toUpperCase()}
              dict={dict}
            />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            {title}
          </h1>

          {mutation.isPending && (
            <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3">
              <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200/80">
                {t.translation_pending}
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-8">
          <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {event.location && (
              <div className="flex items-start gap-3 rounded-lg bg-secondary/30 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">
                    {t.location}
                  </p>
                  <p className="text-sm font-medium">{event.location}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 rounded-lg bg-secondary/30 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-0.5">
                  {t.date_time}
                </p>
                <p className="text-sm font-medium">
                  {new Date(event.start_time).toLocaleDateString(locale, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {new Date(event.start_time).toLocaleTimeString(locale, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">{t.comments}</h2>
              <span className="text-sm text-muted-foreground">
                ({initialComments.length})
              </span>
            </div>

            <CommentsSection
              eventId={event.id}
              locale={locale}
              initialComments={initialComments}
              dict={dict}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
