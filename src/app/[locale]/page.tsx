import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/features/i18n/get-dictionary";
import { ArrowRight, Globe, MessageCircle, Zap } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const features = [
    {
      icon: Globe,
      title: dict.home.features.auto_translation.title,
      desc: dict.home.features.auto_translation.description,
    },
    {
      icon: MessageCircle,
      title: dict.home.features.multilingual_discussions.title,
      desc: dict.home.features.multilingual_discussions.description,
    },
    {
      icon: Zap,
      title: dict.home.features.built_for_web.title,
      desc: dict.home.features.built_for_web.description,
    },
  ];

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Gradient orbs */}
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute -right-40 top-40 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-150 w-150 rounded-full bg-linear-to-r from-purple-500/5 to-blue-500/5 blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[60px_60px]"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, black 70%, transparent 100%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* HERO SECTION */}
        <section className="flex flex-col items-center justify-center text-center pt-20 pb-16 sm:pt-24 sm:pb-24">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:border-border hover:text-foreground">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>{dict.home.badge}</span>
          </div>

          {/* Hero Title */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            <span className="bg-clip-text text-transparent bg-linear-to-b from-foreground via-foreground to-foreground/50">
              {dict.home.hero_title}
            </span>
          </h1>

          {/* Hero Description */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            {dict.home.hero_description}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 min-w-[160px] rounded-full text-base font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              <Link href={`/${locale}/events`}>
                {dict.home.explore_events}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 min-w-[160px] rounded-full text-base font-medium border-border/60 hover:bg-accent hover:border-border"
            >
              <Link href={`/${locale}/dashboard/events/new`}>
                {dict.home.create_event}
              </Link>
            </Button>
          </div>

          {/* Powered By */}
          <p className="mt-12 text-sm text-muted-foreground/60">
            {dict.home.powered_by}
          </p>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Why PolyEvent?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Built for global teams and communities
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/60 hover:shadow-xl"
              >
                {/* Top highlight line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 text-foreground transition-colors group-hover:bg-foreground/10">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16 sm:py-24">
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-b from-card/50 to-card/20 backdrop-blur-sm">
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />

            <div className="px-6 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  {dict.home.cta.title}
                </span>
              </h2>
              <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
                {dict.home.cta.description}
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full px-8 text-base font-medium shadow-lg"
                >
                  <Link href={`/${locale}/dashboard/events/new`}>
                    {dict.home.cta.button}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer spacing */}
        <div className="h-16" />
      </div>
    </main>
  );
}
