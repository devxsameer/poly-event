import "server-only";
import { locales, defaultLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionary.types";

export async function getDictionary(locale: string): Promise<Dictionary> {
  const safeLocale: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  return (await import(`@/i18n/${safeLocale}.json`)).default;
}
