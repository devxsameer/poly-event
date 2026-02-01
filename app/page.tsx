import { redirect } from "next/navigation";
import { headers } from "next/headers";

const SUPPORTED_LOCALES = ["en", "hi", "fr"];
const DEFAULT_LOCALE = "en";

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");

  let locale = DEFAULT_LOCALE;

  if (acceptLanguage) {
    const detected = acceptLanguage
      .split(",")
      .map((lang: string) => lang.split(";")[0].trim().slice(0, 2))
      .find((lang: string) => SUPPORTED_LOCALES.includes(lang));

    if (detected) {
      locale = detected;
    }
  }

  redirect(`/${locale}`);
}
