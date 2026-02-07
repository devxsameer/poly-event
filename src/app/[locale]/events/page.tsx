import { getEventsForLocale } from "@/features/events/event.queries";
import { EventList } from "@/components/events/event-list";
import { getDictionary } from "@/features/i18n/get-dictionary";
import { LocalizedLink } from "@/components/localized-link";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { Plus, Globe, Sparkles } from "lucide-react";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [events, dict] = await Promise.all([
    getEventsForLocale(locale),
    getDictionary(locale),
  ]);


  return (
    <PageWrapper size="lg">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <Globe className="h-3 w-3" />
              <span>
                {events.length}{" "}
                {events.length === 1
                  ? dict.common.event_count_singular
                  : dict.nav.events.toLowerCase()}{" "}
                {dict.common.available}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-linear-to-b from-foreground via-foreground to-foreground/50">
                {dict.events.title}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground max-w-xl text-base sm:text-lg">
              {dict.events.subtitle}
            </p>
          </div>

          {/* CTA Button */}
          <LocalizedLink href="/events/new" className="shrink-0">
            <Button
              size="lg"
              className="gap-2 rounded-full shadow-lg shadow-primary/20"
            >
              <Plus className="h-4 w-4" />
              {dict.nav.create_event}
            </Button>
          </LocalizedLink>
        </div>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <EventList events={events} dict={dict} />
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {dict.events.empty.title}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            {dict.events.empty.description}
          </p>
          <LocalizedLink href="/events/new">
            <Button className="gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              {dict.nav.create_event}
            </Button>
          </LocalizedLink>
        </div>
      )}
    </PageWrapper>
  );
}
