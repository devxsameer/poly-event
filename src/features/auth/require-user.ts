import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw Object.assign(new Error("Unauthorized"), {
      code: "UNAUTHORIZED",
    });
  }

  return data.user;
}
