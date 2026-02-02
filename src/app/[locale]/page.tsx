import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/features/i18n/get-dictionary";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 space-y-16">
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {dict.home.hero_title}
        </h1>

        <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
          {dict.home.hero_description}
        </p>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href={`/${locale}/events`}>
              {dict.home.explore_events}
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href={`/${locale}/login`}>
              {dict.home.create_event}
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>
              🌍 {dict.home.features.auto_translation.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {dict.home.features.auto_translation.description}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              💬 {dict.home.features.multilingual_discussions.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {dict.home.features.multilingual_discussions.description}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚡ {dict.home.features.built_for_web.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {dict.home.features.built_for_web.description}
          </CardContent>
        </Card>
      </section>

      <section className="rounded-lg border bg-muted/50 p-8 text-center space-y-4">
        <h2 className="text-2xl font-semibold">{dict.home.cta.title}</h2>
        <p className="text-muted-foreground">{dict.home.cta.description}</p>
        <Button asChild>
          <Link href={`/${locale}/dashboard/events/new`}>
            {dict.home.cta.button}
          </Link>
        </Button>
      </section>
    </main>
  );
}
