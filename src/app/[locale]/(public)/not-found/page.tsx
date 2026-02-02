import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/features/i18n/get-dictionary";

export default async function LocalizedNotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-7xl font-bold">404</h1>

      <p className="text-muted-foreground text-lg">{dict.errors.not_found}</p>

      <div className="flex gap-3">
        <Button asChild>
          <Link href={`/${locale}`}>{dict.common.go_home}</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href={`/${locale}/login`}>{dict.common.login}</Link>
        </Button>
      </div>
    </div>
  );
}
