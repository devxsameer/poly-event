"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { locales, localeCookieName } from "@/features/i18n/config";
import { setPreferredLocale } from "@/features/i18n/actions";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();
  const currentLocale = params.locale;

  if (!pathname || !currentLocale) return null;

  function getHref(targetLocale: string) {
    const segments = pathname.split("/");
    segments[1] = targetLocale; // locale is always segment 1
    return segments.join("/");
  }

  async function onSelect(locale: string) {
    // 1️⃣ Persist to backend (DB)
    await setPreferredLocale(locale);

    // 2️⃣ Persist to cookie (Proxy reads this)
    document.cookie = `${localeCookieName}=${locale}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={getHref(locale)}
          onClick={() => onSelect(locale)}
          className={`text-sm ${
            locale === currentLocale
              ? "font-semibold underline"
              : "opacity-70 hover:opacity-100"
          }`}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
