import { EventWithTranslation } from "@/features/events/event.types";
import { EventCard } from "./event-card";
import { Dictionary } from "@/features/i18n/dictionary.types";

interface EventListProps {
  events: EventWithTranslation[];
  dict: Dictionary;
}

export function EventList({ events, dict }: EventListProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      {events.map((event, index) => (
        <EventCard
          key={event.id}
          event={event}
          dict={dict}
          featured={index === 0}
        />
      ))}
    </div>
  );
}
