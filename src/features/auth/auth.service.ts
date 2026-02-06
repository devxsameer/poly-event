"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mapSupabaseAuthError } from "./supabase-error.mapper";
import { AuthError } from "./auth.errors";

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
    email,
  });

  if (error) {
    throw new AuthError(mapSupabaseAuthError(error));
  }
}

export async function verifyOtpService(email: string, code: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });

  if (error) {
    throw new AuthError(mapSupabaseAuthError(error));
  }
}

export async function signOutService() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
}
