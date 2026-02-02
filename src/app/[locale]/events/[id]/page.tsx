import { getEventById } from "@/features/events/event.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { triggerEventTranslation } from "@/features/events/event.actions";
import { LanguageSwitcher } from "@/features/events/components/language-switcher";
import { CommentList } from "@/components/comments/comment-list";
import { CommentForm } from "@/components/comments/comment-form";
import { getCommentsForEvent } from "@/features/comments/comment.queries";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const event = await getEventById(id, locale);

  // 🔥 fire-and-forget only
  if (!event.hasTranslation && event.original_language !== locale) {
    triggerEventTranslation(id, event.original_language, locale);
  }

  const comments = await getCommentsForEvent(id, locale);

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-3xl py-12 px-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl">{event.title}</CardTitle>

            <p className="text-xs text-muted-foreground font-medium">
              Original language: {event.original_language.toUpperCase()}
            </p>

            <LanguageSwitcher
              eventId={id}
              sourceLocale={event.original_language}
            />
          </CardHeader>

          <CardContent className="space-y-6">
            {!event.hasTranslation && event.original_language !== locale && (
              <p className="text-sm italic text-muted-foreground bg-secondary/50 px-3 py-2 rounded-lg">
                Translation is being generated. Showing original content…
              </p>
            )}

            <p className="leading-relaxed">{event.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {event.location && (
                <span className="inline-flex items-center gap-1">
                  📍 {event.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                🕒 {new Date(event.start_time).toLocaleString()}
              </span>
            </div>

            <div className="pt-6 border-t border-border/50">
              <h3 className="font-semibold text-lg mb-4">Comments</h3>
              <CommentForm eventId={id} locale={locale} />
              <CommentList comments={comments} locale={locale} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
