"use client";

import * as React from "react";
import { Globe, Check } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { localeNames, locales, type Locale } from "@/features/i18n/config";
import { setPreferredLocale } from "@/features/i18n/locale.actions";
import { triggerTopLoader } from "@/components/ui/top-loader";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  pathname: string;
  /** Unique identifier to prevent hydration mismatches when multiple instances exist */
  id?: string;
}

export function LanguageSwitcher({
  currentLocale,
  pathname,
  id,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  // Generate stable ID for Radix to prevent hydration mismatch
  const generatedId = React.useId();
  const menuId = id ?? generatedId;

  function getHref(targetLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = targetLocale;
    return segments.join("/");
  }

  function onSelect(locale: Locale) {
    if (locale === currentLocale) return;

    triggerTopLoader();
    startTransition(async () => {
      await setPreferredLocale(locale);
      router.push(getHref(locale));
    });
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild id={`lang-trigger-${menuId}`}>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer gap-2"
          disabled={pending}
        >
          <Globe className="h-4 w-4" />
          <span>{localeNames[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-32">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => onSelect(locale)}
            className="cursor-pointer flex items-center justify-between gap-2"
          >
            <span className={locale === currentLocale ? "font-semibold" : ""}>
              {localeNames[locale]}
            </span>
            {locale === currentLocale && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
