// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";

import { Navbar } from "@/components/navbar/navbar";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { defaultLocale, locales } from "@/features/i18n/config";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
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

  if (!locales.includes(locale as (typeof locales)[number])) {
    redirect(`/${defaultLocale}/not-found`);
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang={locale}>
      <body className={`${outfit.variable} antialiased`}>
        <Navbar user={user} />
        {children}
      </body>
    </html>
  );
}
