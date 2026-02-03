import { EventWithTranslation } from "@/features/events/event.types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LocalizedLink } from "@/components/localized-link";
import { Dictionary } from "@/features/i18n/dictionary.types";
import { MapPin, Clock, Globe, ArrowRight, Languages } from "lucide-react";

interface EventCardProps {
  event: EventWithTranslation;
  dict: Dictionary;
  featured?: boolean;
}

export function EventCard({ event, dict, featured }: EventCardProps) {
  const t = dict.events.card;

  return (
    <LocalizedLink
      href={`/events/${event.id}`}
      className={`block group ${featured ? "md:col-span-2" : ""}`}
    >
      <Card className="relative h-full overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/5">
        {/* Top highlight line */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              {/* Language badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  {t.original_language}: {event.original_language.toUpperCase()}
                </span>
                {!event.hasTranslation && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-500">
                    <Languages className="h-3 w-3 animate-pulse" />
                    {t.translating}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                className={`font-semibold tracking-tight transition-colors group-hover:text-primary ${featured ? "text-xl sm:text-2xl" : "text-lg"}`}
              >
                {event.title}
              </h3>
            </div>

            {/* Arrow indicator */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p
            className={`text-muted-foreground leading-relaxed ${featured ? "line-clamp-3" : "line-clamp-2"}`}
          >
            {event.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {event.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {new Date(event.start_time).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </LocalizedLink>
  );
}
