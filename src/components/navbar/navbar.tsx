"use client";

import * as React from "react";
import { Menu, X, Globe } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/auth.actions";
import { LocalizedLink } from "../localized-link";
import { LanguageSwitcher } from "./language-switcher";
import { type Locale } from "@/features/i18n/config";
import { Dictionary } from "@/features/i18n/dictionary.types";

interface NavbarProps {
  user: User | null;
  dict: Dictionary;
}

export function Navbar({ user, dict }: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();

  if (!pathname || !params?.locale) return null;
  const locale = params.locale as Locale;

  async function handleSignOut() {
    try {
      await signOut();
    } finally {
      setOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* Brand */}
        <LocalizedLink
          href="/"
          className="flex items-center gap-2 font-semibold"
        >
          <Globe className="h-5 w-5" />
          <span>PolyEvent</span>
          <span className="hidden md:inline text-xs text-muted-foreground">
            · {dict.nav.brand_tagline}
          </span>
        </LocalizedLink>

        {/* Desktop Nav */}
        <nav className="ml-8 hidden md:flex items-center gap-6 text-sm">
          <LocalizedLink href="/events">{dict.nav.events}</LocalizedLink>
          {user && (
            <LocalizedLink href="/dashboard/events/new">
              {dict.nav.create}
            </LocalizedLink>
          )}
        </nav>

        {/* Desktop Right */}
        <div className="ml-auto hidden md:flex items-center gap-2">
          <LanguageSwitcher currentLocale={locale} pathname={pathname} />
          {user ? (
            <Button onClick={handleSignOut} variant="ghost" size="sm">
              {dict.common.logout}
            </Button>
          ) : (
            <LocalizedLink href="/login">
              <Button variant="ghost" size="sm">
                {dict.common.login}
              </Button>
            </LocalizedLink>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="ml-auto md:hidden p-2"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background p-4 space-y-4">
          <LocalizedLink href="/events" onClick={() => setOpen(false)}>
            {dict.nav.events}
          </LocalizedLink>

          {user && (
            <LocalizedLink
              href="/dashboard/events/new"
              onClick={() => setOpen(false)}
            >
              {dict.nav.create_event}
            </LocalizedLink>
          )}

          <LanguageSwitcher currentLocale={locale} pathname={pathname} />

          {user ? (
            <Button onClick={handleSignOut} variant="ghost" className="w-full">
              {dict.common.logout}
            </Button>
          ) : (
            <LocalizedLink href="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">
                {dict.common.login}
              </Button>
            </LocalizedLink>
          )}
        </div>
      )}
    </header>
  );
}
