import { requestEventTranslation } from "../events/event.translate";

// features/translation/translation.scheduler.ts
export async function ensureEventTranslation({
  eventId,
  sourceLocale,
  targetLocale,
}: {
  eventId: string;
  sourceLocale: string;
  targetLocale: string;
}) {
  if (sourceLocale === targetLocale) return;
  await requestEventTranslation(eventId, sourceLocale, targetLocale);
}
