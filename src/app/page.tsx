import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { detectPreferredLocale } from "@/features/i18n/detect-locale";

export default async function RootPage() {
  const locale = detectPreferredLocale({
    cookies: await cookies(),
    headers: await headers(),
  });

  redirect(`/${locale}`);
}
