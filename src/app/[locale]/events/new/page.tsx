import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CreateEventForm } from "@/components/events/create-event-form";
import { getDictionary } from "@/features/i18n/get-dictionary";
import { LocalizedLink } from "@/components/localized-link";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Locale } from "@/features/i18n/config";

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 🔒 Auth protection - redirect to login if not authenticated
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const dict = await getDictionary(locale);

  return (
    <PageWrapper size="sm">
      {/* Back Button */}
      <LocalizedLink href="/events" className="inline-block mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {dict.events.detail.back_to_events}
        </Button>
      </LocalizedLink>

      {/* Header */}
      <div className="mb-10 space-y-4">
        {/* Icon */}
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm">
          <Sparkles className="h-7 w-7 text-foreground" />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-linear-to-b from-foreground via-foreground to-foreground/50">
            {dict.events.create.title}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground max-w-lg text-base sm:text-lg">
          {dict.events.create.subtitle}
        </p>
      </div>

      {/* Form */}
      <CreateEventForm initialLocale={locale as Locale} dict={dict} />
    </PageWrapper>
  );
}
