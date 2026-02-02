import "server-only";
import { locales, defaultLocale, type Locale } from "./config";

export async function getDictionary(locale: string) {
  const safeLocale: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  return (await import(`@/i18n/${safeLocale}.json`)).default;
}
