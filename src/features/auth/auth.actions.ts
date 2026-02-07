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
import { ActionState, fail, ok } from "../shared/action-state";
import { AUTH_ERROR_KEYS, AuthError, AuthErrorKey } from "./auth.errors";
import { sanitizeNext } from "./auth.utils";

export async function signInWithGitHub(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionState<void, AuthErrorKey>> {
  const rawNext = formData.get("next")?.toString() ?? null;
  const next = sanitizeNext(rawNext);
  let oauthUrl;
  try {
    oauthUrl = await signInWithGitHubService(next);
  } catch (err) {
    if (err instanceof AuthError) {
      return fail(err.key);
    }

    console.error("signInWithGitHub failed", err);
    return fail(AUTH_ERROR_KEYS.UNKNOWN as AuthErrorKey);
  }
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
    return fail(AUTH_ERROR_KEYS.UNKNOWN as AuthErrorKey);
  }
}

export async function verifyOTP(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionState<void, AuthErrorKey>> {
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
  } catch (err) {
    if (err instanceof AuthError) return fail(err.key as AuthErrorKey);
    console.error("verifyOTP failed", err);
    return fail(AUTH_ERROR_KEYS.UNKNOWN as AuthErrorKey);
  }
  redirect(`/en?auth_success=1`);
}

export async function signOut(locale?: string) {
  await signOutService();

  revalidatePath("/", "layout");
  redirect(locale ? `/${locale}` : "/");
}
