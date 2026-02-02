"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  signInWithGitHubService,
  sendOtpService,
  verifyOtpService,
  signOutService,
} from "./auth.service";

export async function signInWithGitHub(formData: FormData) {
  const next = formData.get("next")?.toString() ?? "/";

  const oauthUrl = await signInWithGitHubService(next);
  redirect(oauthUrl);
}

export async function sendOTP(email: string) {
  await sendOtpService(email);
}

export async function verifyOTP(
  email: string,
  code: string,
  next: string = "/",
) {
  await verifyOtpService(email, code);

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signOut(locale?: string) {
  await signOutService();

  revalidatePath("/", "layout");
  redirect(locale ? `/${locale}` : "/");
}
