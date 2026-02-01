import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Discover events in your language
        </h1>

        <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
          PolyEvent removes language barriers from global events. Organizers
          write once. Attendees read, comment, and engage in their own language.
        </p>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href={`/${locale}/events`}>Explore Events</Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href={`/${locale}/login`}>Create an Event</Link>
          </Button>
        </div>
      </section>

      {/* Value Props */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>🌍 Automatic Translation</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Events and discussions are translated automatically using Lingo.dev
            — no manual localization required.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>💬 Multilingual Discussions</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Comment in your own language. Others read it in theirs. Original
            text is always preserved.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚡ Built for the Web</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Built with Next.js, Supabase, and modern server-first architecture
            for speed and reliability.
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="rounded-lg border bg-muted/50 p-8 text-center space-y-4">
        <h2 className="text-2xl font-semibold">
          Hosting an international event?
        </h2>
        <p className="text-muted-foreground">
          Stop worrying about language. Focus on the experience.
        </p>
        <Button asChild>
          <Link href={`/${locale}/dashboard/events/new`}>
            Create Your Event
          </Link>
        </Button>
      </section>
    </main>
  );
}
