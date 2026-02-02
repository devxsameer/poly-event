import { EventWithTranslation } from "@/features/events/event.types";
import { EventCard } from "./event-card";

export function EventList({ events }: { events: EventWithTranslation[] }) {
  if (events.length === 0) {
    return <p className="text-muted-foreground">No events yet.</p>;
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
