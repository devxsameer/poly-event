"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  signInWithGitHubService,
  sendOtpService,
  verifyOtpService,
  signOutService,
} from "./auth.service";
import { sendOtpSchema, verifyOtpSchema } from "./auth.schema";
import { fail, ok } from "../shared/action-state";
import { AUTH_ERROR_KEYS, AuthError, AuthErrorKey } from "./auth.errors";

export async function signInWithGitHub(formData: FormData) {
  const next = formData.get("next")?.toString() ?? "/";

  const oauthUrl = await signInWithGitHubService(next);
  redirect(oauthUrl);
}
export async function sendOTP(_prevState: unknown, formData: FormData) {
  const parsed = sendOtpSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return fail(parsed.error.issues[0].message as AuthErrorKey);
  }

  try {
    await sendOtpService(parsed.data.email);
    return ok();
  } catch (err) {
    if (err instanceof AuthError) return fail(err.key);
    console.error("sendOTP failed", err);
    return fail(AUTH_ERROR_KEYS.UNKNOWN);
  }
}

export async function verifyOTP(_prevState: unknown, formData: FormData) {
  const parsed = verifyOtpSchema.safeParse({
    email: formData.get("email"),
    code: formData.get("code"),
  });

  if (!parsed.success) {
    return fail(parsed.error.issues[0].message as AuthErrorKey);
  }

  try {
    await verifyOtpService(parsed.data.email, parsed.data.code);
    revalidatePath("/", "layout");
    redirect(`/${formData.get("locale")}?auth_success=1`);
  } catch (err) {
    if (err instanceof AuthError) return fail(err.key as AuthErrorKey);
    console.error("verifyOTP failed", err);
    return fail(AUTH_ERROR_KEYS.UNKNOWN);
  }
}

export async function signOut(locale?: string) {
  await signOutService();

  revalidatePath("/", "layout");
  redirect(locale ? `/${locale}` : "/");
}
