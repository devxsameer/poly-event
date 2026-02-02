import { EventWithTranslation } from "@/features/events/event.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalizedLink } from "@/components/localized-link";

export function EventCard({ event }: { event: EventWithTranslation }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <p className="text-xs text-muted-foreground">
          Original language: {event.original_language.toUpperCase()}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>{event.description}</p>

        {event.location && (
          <p className="text-sm text-muted-foreground">📍 {event.location}</p>
        )}

        <p className="text-xs text-muted-foreground">
          {event.original_language.toUpperCase()}
          {!event.hasTranslation && (
            <span className="ml-2 italic">(translating…)</span>
          )}
        </p>

        <LocalizedLink href={`/events/${event.id}`}>
          <Card className="hover:shadow-md transition">...</Card>
        </LocalizedLink>
      </CardContent>
    </Card>
  );
}
