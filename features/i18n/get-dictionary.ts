import "server-only";
import { locales, defaultLocale } from "@/features/i18n/config";

export async function getDictionary(locale: string) {
  const safeLocale = locales.includes(locale as any) ? locale : defaultLocale;

  return (await import(`@/i18n/${safeLocale}.json`)).default;
}
