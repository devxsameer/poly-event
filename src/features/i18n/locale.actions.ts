"use server";

import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { locales, type Locale, localeCookieName } from "./config";

export async function setPreferredLocale(locale: Locale) {
  if (!locales.includes(locale)) {
    throw new Error("Invalid locale");
  }

  // 1️⃣ Cookie (always)
  const cookieStore = await cookies();
  cookieStore.set(localeCookieName, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  // 2️⃣ DB (only if logged in)
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { persisted: "cookie-only" as const };
  }

  const { error } = await supabase
    .from("users")
    .update({ preferred_locale: locale })
    .eq("id", user.id);

  if (error) {
    // don’t break UX — cookie already updated
    console.error("Failed to persist locale", error);
    return { persisted: "cookie-only" as const };
  }

  return { persisted: "cookie+db" as const };
}
