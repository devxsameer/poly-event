import parser from "accept-language-parser";
import {
  locales,
  defaultLocale,
  localeCookieName,
  type Locale,
} from "./config";

type LocaleRequest = {
  cookies: {
    get(name: string): { value: string } | undefined;
  };
  headers: {
    get(name: string): string | null;
  };
};

export function detectPreferredLocale(
  request: LocaleRequest,
  userLocale?: string | null,
): Locale {
  // 1️⃣ DB wins (logged-in users)
  if (userLocale && locales.includes(userLocale as Locale)) {
    return userLocale as Locale;
  }

  // 2️⃣ Cookie
  const cookie = request.cookies.get(localeCookieName);
  if (cookie && locales.includes(cookie.value as Locale)) {
    return cookie.value as Locale;
  }

  // 3️⃣ Accept-Language
  const acceptLang = request.headers.get("accept-language");
  if (acceptLang) {
    const match = parser.pick(locales, acceptLang, { loose: true });
    if (match) return match as Locale;
  }

  // 4️⃣ Default
  return defaultLocale;
}
