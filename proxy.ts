import { NextResponse, type NextRequest } from "next/server";
import { withSupabase } from "@/lib/supabase/proxy";
import { detectPreferredLocale } from "@/features/i18n/detect-locale";
import { getLocaleFromPathname } from "@/features/i18n/validate-locale";

export async function proxy(request: NextRequest) {
  // 1️⃣ Supabase session refresh (DO NOT MOVE)
  const { response, user } = await withSupabase(request);

  const pathname = request.nextUrl.pathname;

  // 2️⃣ Root → locale
  if (pathname === "/") {
    const locale = detectPreferredLocale(request, user?.preferred_locale);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // 3️⃣ Validate locale
  const localeFromPath = getLocaleFromPathname(pathname);
  if (!localeFromPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/404";
    return NextResponse.rewrite(url);
  }

  // 4️⃣ Pass through
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
