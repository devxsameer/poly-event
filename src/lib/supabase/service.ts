import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

export async function createServiceSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        persistSession: false,
      },
    },
  );
}
