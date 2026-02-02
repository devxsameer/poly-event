// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Hind, Outfit } from "next/font/google";
import "@/styles/globals.css";

import { Navbar } from "@/components/navbar/navbar";
import { TopLoader } from "@/components/ui/top-loader";
import { AuthSuccessToast } from "@/features/auth/components/auth-success-toast";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { defaultLocale, locales } from "@/features/i18n/config";
import { Toaster } from "sonner";
import { getDictionary } from "@/features/i18n/get-dictionary";
import { Suspense } from "react";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const hind = Hind({
  weight: ["400", "500", "700"],
  variable: "--font-hind",
  subsets: ["devanagari"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PolyEvent",
  description: "Multilingual events, built for the web",
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const isRTL = locale === "ar" || locale === "he";
  const fontStrategy = locale === "hi" ? "font-hindi" : "font-sans";

  if (!locales.includes(locale as (typeof locales)[number])) {
    redirect(`/${defaultLocale}/not-found`);
  }
  const dict = await getDictionary(locale);

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${outfit.variable} ${hind.variable} ${fontStrategy} antialiased`}
      >
        <Suspense fallback={null}>
          <TopLoader />
          <AuthSuccessToast />
        </Suspense>
        <Navbar user={user} dict={dict} />
        <Toaster theme="dark" />
        {children}
      </body>
    </html>
  );
}
