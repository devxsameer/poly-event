"use server";

import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { locales, type Locale, localeCookieName } from "./config";

export async function setPreferredLocale(locale: Locale) {
  if (!locales.includes(locale)) {
    throw new Error("Invalid locale");
  }

  const cookieStore = await cookies();
  cookieStore.set(localeCookieName, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { persisted: "cookie-only" };
  }

  const { error } = await supabase
    .from("users")
    .update({ preferred_locale: locale })
    .eq("id", user.id);

  if (error) {
    throw new Error("Failed to persist locale preference");
  }

  return { persisted: "cookie+db" };
}
