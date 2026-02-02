"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function signInWithGitHubService(next: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(
        next,
      )}`,
    },
  });

  if (error) throw new Error(error.message);
  if (!data.url) throw new Error("OAuth URL not returned");

  return data.url;
}

export async function sendOtpService(email: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
  });

  if (error) throw new Error(error.message);
}

export async function verifyOtpService(email: string, code: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: code,
    type: "email", // assumes OTP (not magic link)
  });

  if (error) throw new Error(error.message);
}

export async function signOutService() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
}
