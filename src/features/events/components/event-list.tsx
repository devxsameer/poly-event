import { EventWithTranslation } from "@/features/events/event.types";
import { EventCard } from "./event-card";

export function EventList({ events }: { events: EventWithTranslation[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">No events yet.</p>
        <p className="text-muted-foreground/60 text-sm mt-1">
          Check back later for upcoming events.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
