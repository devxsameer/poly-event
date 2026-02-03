import { getEventById } from "@/features/events/event.queries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { triggerEventTranslation } from "@/features/events/event.actions";
import { LanguageSwitcher } from "@/components/events/language-switcher";
import { CommentsSection } from "@/components/comments/comments-section";
import { getCommentsForEvent } from "@/features/comments/comment.queries";
import { getDictionary } from "@/features/i18n/get-dictionary";
import { LocalizedLink } from "@/components/localized-link";
import { PageWrapper } from "@/components/layout/page-wrapper";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Globe,
  Languages,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { OriginalToggle } from "@/components/events/original-toggle";
import { notFound } from "next/navigation";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const dict = await getDictionary(locale);

  // Validate UUID format to prevent database errors
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  let event;
  let comments;

  try {
    [event, comments] = await Promise.all([
      getEventById(id, locale),
      getCommentsForEvent(id, locale),
    ]);
  } catch {
    notFound();
  }

  // 🔥 fire-and-forget only
  if (!event.hasTranslation && event.original_language !== locale) {
    triggerEventTranslation(id, event.original_language, locale);
  }

  const t = dict.events.detail;

  return (
    <PageWrapper size="md">
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

      {/* Main Event Card */}
      <Card className="overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm shadow-xl">
        {/* Top highlight line */}
        <div className="h-1 bg-linear-to-r from-purple-500 via-blue-500 to-purple-500" />

        <CardHeader className="space-y-6 pb-4">
          {/* Language Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Globe className="h-3 w-3" />
                {t.original_language}: {event.original_language.toUpperCase()}
              </span>
              {!event.hasTranslation && event.original_language !== locale && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-500">
                  <Languages className="h-3 w-3 animate-pulse" />
                  {dict.events.card.translating}
                </span>
              )}
              <OriginalToggle
                translated={event.description}
                original={event.originalDescription}
                label={event.original_language.toUpperCase()}
              />
            </div>
            <LanguageSwitcher
              eventId={id}
              sourceLocale={event.original_language}
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            {event.title}
          </h1>

          {/* Translation Notice */}
          {!event.hasTranslation && event.original_language !== locale && (
            <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3">
              <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200/80">
                {t.translation_pending}
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Description */}
          <p className="text-foreground/90 leading-relaxed text-base whitespace-pre-wrap">
            {event.description}
          </p>

          {/* Event Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {event.location && (
              <div className="flex items-start gap-3 rounded-lg bg-secondary/30 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
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
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
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

          {/* Comments Section */}
          <div className="pt-8 border-t border-border/50">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">{t.comments}</h2>
              <span className="text-sm text-muted-foreground">
                ({comments.length})
              </span>
            </div>

            <div className="space-y-6">
              <CommentsSection
                eventId={id}
                locale={locale}
                initialComments={comments}
                dict={dict}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
