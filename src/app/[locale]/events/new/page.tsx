import { CreateEventForm } from "@/features/events/components/create-event-form";

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold">Create event</h1>
        <p className="text-sm text-muted-foreground">
          Share an event in your chosen language. We&apos;ll translate it
          automatically.
        </p>
      </div>

      <CreateEventForm initialLocale={locale} />
    </div>
  );
}
