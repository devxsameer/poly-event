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
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>{event.title}</CardTitle>

          <p className="text-xs text-muted-foreground">
            Original language: {event.original_language.toUpperCase()}
          </p>

          <LanguageSwitcher
            eventId={id}
            sourceLocale={event.original_language}
          />
        </CardHeader>

        <CardContent className="space-y-4">
          {!event.hasTranslation && event.original_language !== locale && (
            <p className="text-xs italic text-muted-foreground">
              Translation is being generated. Showing original content.
            </p>
          )}

          <p>{event.description}</p>

          {event.location && (
            <p className="text-sm text-muted-foreground">📍 {event.location}</p>
          )}

          <p className="text-sm text-muted-foreground">
            🕒 {new Date(event.start_time).toLocaleString()}
          </p>

          <div className="pt-4 border-t">
            <h3 className="font-medium mb-3">Comments</h3>
            <CommentForm eventId={id} locale={locale} />
            <CommentList comments={comments} locale={locale} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
