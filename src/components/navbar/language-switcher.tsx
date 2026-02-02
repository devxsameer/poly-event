"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { locales, type Locale } from "@/features/i18n/config";
import { setPreferredLocale } from "@/features/i18n/locale.actions";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  pathname: string;
}

export function LanguageSwitcher({
  currentLocale,
  pathname,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function getHref(targetLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = targetLocale;
    return segments.join("/");
  }

  function onSelect(locale: Locale) {
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
