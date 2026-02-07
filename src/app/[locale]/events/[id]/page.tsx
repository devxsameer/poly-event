import { getEventByIdRaw } from "@/features/events/event.queries";
import { getDictionary } from "@/features/i18n/get-dictionary";
import { PageWrapper } from "@/components/layout/page-wrapper";

import { notFound } from "next/navigation";
import EventDetailClient from "@/components/events/event-detail-client";
import { Locale } from "@/features/i18n/config";
import { getCommentsForEvent } from "@/features/comments/comment.queries";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const dict = await getDictionary(locale);

  // Validate UUID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  let event;
  let comments;

  try {
    [event, comments] = await Promise.all([
      getEventByIdRaw(id, locale),
      getCommentsForEvent(id, locale),
    ]);
  } catch {
    notFound();
  }

  return (
    <PageWrapper size="md">
      <EventDetailClient
        dict={dict}
        locale={locale as Locale}
        event={event}
        initialComments={comments}
      />
    </PageWrapper>
  );
}
