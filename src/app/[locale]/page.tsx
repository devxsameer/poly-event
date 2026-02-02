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
    <main className="mx-auto max-w-6xl px-4 py-20 space-y-28">
      {/* HERO */}
      <section className="text-center space-y-6">
        <span>🌍 {dict.home.badge}</span>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          {dict.home.hero_title}
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {dict.home.hero_description}
        </p>

        <p>{dict.home.powered_by}</p>

        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Button asChild size="lg">
            <Link href={`/${locale}/events`}>{dict.home.explore_events}</Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href={`/${locale}/dashboard/events/new`}>
              {dict.home.create_event}
            </Link>
          </Button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌐 {dict.home.features.auto_translation.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {dict.home.features.auto_translation.description}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💬 {dict.home.features.multilingual_discussions.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {dict.home.features.multilingual_discussions.description}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ {dict.home.features.built_for_web.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {dict.home.features.built_for_web.description}
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="rounded-xl border bg-muted/40 p-12 text-center space-y-4">
        <h2 className="text-3xl font-semibold">{dict.home.cta.title}</h2>
        <p className="mx-auto max-w-xl text-muted-foreground">
          {dict.home.cta.description}
        </p>
        <Button asChild size="lg">
          <Link href={`/${locale}/dashboard/events/new`}>
            {dict.home.cta.button}
          </Link>
        </Button>
      </section>
    </main>
  );
}
