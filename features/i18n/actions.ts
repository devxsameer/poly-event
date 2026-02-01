"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { locales } from "./config";

export async function setPreferredLocale(locale: string) {
  if (!locales.includes(locale as any)) return;

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("users")
    .update({ preferred_locale: locale })
    .eq("id", user.id);
}
