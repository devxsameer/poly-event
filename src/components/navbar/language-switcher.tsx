"use client";

import * as React from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { locales, type Locale } from "@/features/i18n/config";
import { setPreferredLocale } from "@/features/i18n/locale.actions";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();
  const router = useRouter();

  const currentLocale = params.locale as Locale;
  const [pending, startTransition] = React.useTransition();

  if (!pathname || !currentLocale) return null;

  function getHref(targetLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = targetLocale;
    return segments.join("/");
  }

  async function onSelect(locale: Locale) {
    startTransition(async () => {
      await setPreferredLocale(locale);
      router.push(getHref(locale));
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={pending}>
          <Globe className="h-4 w-4 mr-2" />
          {currentLocale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => onSelect(locale)}
            className={locale === currentLocale ? "font-semibold" : undefined}
          >
            {locale.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
