import { getEventsForLocale } from "@/features/events/event.queries";
import { EventList } from "@/features/events/components/event-list";
import { triggerEventTranslation } from "@/features/events/event.actions";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const events = await getEventsForLocale(locale);

  // 🔥 Opportunistic background translations
  for (const event of events) {
    if (!event.hasTranslation && event.original_language !== locale) {
      triggerEventTranslation(event.id, event.original_language, locale).catch(
        () => {},
      );
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12 px-6">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
          Events
        </h1>
        <EventList events={events} />
      </div>
    </main>
  );
}
