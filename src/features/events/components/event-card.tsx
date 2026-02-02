import { EventWithTranslation } from "@/features/events/event.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalizedLink } from "@/components/localized-link";

export function EventCard({ event }: { event: EventWithTranslation }) {
  return (
    <LocalizedLink href={`/events/${event.id}`} className="block group">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/80 hover:-translate-y-0.5 hover:shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {event.title}
          </CardTitle>
          <p className="text-xs text-muted-foreground font-medium">
            Original language: {event.original_language.toUpperCase()}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground leading-relaxed line-clamp-2">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {event.location && (
              <span className="inline-flex items-center gap-1">
                📍 {event.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              {event.original_language.toUpperCase()}
              {!event.hasTranslation && (
                <span className="text-xs italic opacity-70">
                  (translating…)
                </span>
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </LocalizedLink>
  );
}
