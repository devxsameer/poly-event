import parser from "accept-language-parser";
import { locales, defaultLocale, localeCookieName } from "./config";
import type { NextRequest } from "next/server";

export function detectPreferredLocale(
  request: NextRequest,
  userLocale?: string | null,
) {
  // 1️⃣ DB wins (logged-in users)
  if (userLocale && locales.includes(userLocale as any)) {
    return userLocale;
  }

  // 2️⃣ Cookie
  const cookie = request.cookies.get(localeCookieName);
  if (cookie && locales.includes(cookie.value as any)) {
    return cookie.value;
  }

  // 3️⃣ Accept-Language
  const acceptLang = request.headers.get("accept-language");
  if (acceptLang) {
    const match = parser.pick(locales, acceptLang, { loose: true });
    if (match) return match;
  }

  return defaultLocale;
}
