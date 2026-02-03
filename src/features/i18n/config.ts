export const locales = [
  "en", // English
  "es", // Spanish
  "fr", // French
  "de", // German
  "pt", // Portuguese
  "hi", // Hindi
  "ar", // Arabic
  "ja", // Japanese
  "zh-Hans", // Simplified Chinese
  "ko", // Korean
  "ru", // Russian
  "id", // Indonesian
] as const;

export const rtlLocales: Locale[] = ["ar"];
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "NEXT_LOCALE";

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  hi: "हिन्दी",
  ar: "العربية",
  ja: "日本語",
  "zh-Hans": "简体中文",
  ko: "한국어",
  ru: "Русский",
  id: "Bahasa Indonesia",
};
